/**
 * imagex
 * author: joeyguo
 * HomePage: https://github.com/gkajs/imagex
 * MIT Licensed.
 */

const FolderParser = require('../plugins/parse-folder')
const ImageRatio   = require('../plugins/image-ratio')
const ImageCrop    = require('../plugins/image-crop')
const ImageBgColor = require('../plugins/image-bgcolor')
const ImageSprites = require('../plugins/image-sprites')
const ImageName    = require('../plugins/image-name')
const ImageFlatten = require('../plugins/image-flatten')
const ImageSplit   = require('../plugins/image-split')
const ImageDiff    = require('../plugins/image-diff')
const ImageUnique  = require('../plugins/image-unique')

const imageMin     = require("./mini")
const path         = require("path")
const generate     = require("./generate")

const {
    getTmpDir,
    writeFile,
    deleteDir,
} = require("./file");

const {
    pluginIn,
    pluginCompose,
} = require("./utils");

module.exports = function imagex(options, callback) {
    let {
        dir,
        imgOutput: dest,
        prefix,
        bgcolor,
        split,
        diff,
        crop,
        unique,
        sprites,
        count,
        algorithm = 'left-right',
        mini,
        replace,
        info,
        ratio = 1,
    } = options

    if (!dir) return console.log('\n[error]: ' + 'dir required!\n----------------------------');

    // MINI source image
    if (replace && mini) return mini(dir);

    global.tmpDir = getTmpDir();

    let plugins = pluginIn([
        [true,    new ImageRatio(ratio)],
        [true,    new ImageFlatten()],
        [split,   new ImageSplit()],
        [bgcolor, new ImageBgColor(bgcolor)],
        [diff,    new ImageDiff()],
        [crop,    new ImageCrop()],
        [unique,  new ImageUnique()],
        [sprites, new ImageSprites({algorithm, count})],
        [true,    new ImageName({prefix, dest})]
    ])

    let transform = pluginCompose(...plugins);
    
    let dataRes = [];
    let dataArr = new FolderParser().parse(dir);
    
    dataArr.map(data => {

        // 处理图片
        transform(data, data => {

            // 生成图片
            generate(data, () => {

                // 等待多组图片处理完成
                if (dataRes.push(data) !== dataArr.length) return

                // 压缩图片
                mini && imageMin(dest);

                dataRes.sort((a, b) => a.ratio - b.ratio);

                const infoPath = path.join(dest, "__info", "data.json")
                const infoStr  = JSON.stringify(dataRes, null, '    ')

                // 生成图片信息
                info && writeFile(infoPath, infoStr, () => console.log(` ✔ images __info generated`))

                // 完成处理，回传数据
                callback && callback(dataRes);

                // 删除临时的图片文件夹
                deleteDir(tmpDir);
            })
        })
    })
}