/**
 * GKA (generate keyframes animation)
 * author: joeyguo
 * HomePage: https://github.com/joeyguo/gka
 * MIT Licensed.
 *
 */

const fs        = require("fs"),
    path        = require('path'),
    mkdirp      = require('mkdirp'),
    Spritesmith = require('spritesmith');

// sprites
// 生成合图, 返回坐标数据
function gsprites(srcs, filepath, algorithm, callback) {
    Spritesmith.run({
        src: srcs,
        algorithm: algorithm,
        algorithmOpts: {sort: false},
    }, function(err, r) {
        mkdirp(path.dirname(filepath), function (err) {
            fs.writeFileSync(filepath, r.image);
            // console.log('[-] ' + path.basename(filepath) +' generated');
            callback && callback(r, filepath);
        });
    });
}

// 获取所有输出的文件路径，并去重
function getFiles(data) {
    var srcs = data.frames.map(item => {
        return item['src'];
    });
    return srcs.filter((item, index, self) => {
          return self.indexOf(item) == index;     
    });
}

module.exports = class ImageSpritesPlugin {
    constructor({algorithm, spritesCount}) {
        this.algorithm = algorithm
        this.spritesCount = spritesCount
        this.apply = this.apply.bind(this)
    }

    apply(compiler) {
        compiler.hooks.on('transform', (context, next) => {
            let {
                options,
                data,
                fileSystem,
            } = context;

            const {
                algorithm,
                spritesCount
            } = this;

            let tmpDir = path.join(fileSystem.tmpdir, 'sprites', data.ratio);

            var files = getFiles(data);
            var count = !spritesCount? files.length: spritesCount,
                result = [];

            for(var i = 0, len = files.length; i<len; i += count) {
                result.push(files.slice(i,i + count));
            }
            const rlen = result.length;
            let pr = result.map((items, j) => {

                let newfilepath = path.join(tmpDir, `sprites${(rlen !== 1? "-" + (j + 1): "")}${path.extname(items[0])}`);

                return new Promise(resolve => {
                    gsprites(items, newfilepath, algorithm, (r, filepath) => {
                        for (var i = 0, coors; i < data.frames.length; i++) {
                            coors = r.coordinates[data.frames[i]['src']];
                            if (!coors) continue;
                            data.frames[i]['w'] = r.properties.width;
                            data.frames[i]['h'] = r.properties.height;
                            data.frames[i]['width'] = coors.width;
                            data.frames[i]['height'] = coors.height;
                            data.frames[i]['x'] = coors.x;
                            data.frames[i]['y'] = coors.y;
                            data.frames[i]['src'] = filepath;
                        }
                        resolve();
                    })
                })
            })

            Promise.all(pr).then(_ => {
                console.log('[+] sprites');
                next(context);
            })
        })
    }
}