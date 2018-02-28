/**
 * imagex
 * author: joeyguo
 * HomePage: https://github.com/gkajs/imagex
 * MIT Licensed.
 *
 * diff
 */

var fs = require('fs'),
    path   = require('path'),
    mkdirp = require('mkdirp'),
    PNG = require('pngjs').PNG;

function getKeyByVal(obj, val) {
	for(var k in obj) {
		if (obj[k] == val) {
			return k;
			break;
		}
	}
	return ''
}

function diffStream(stream1, stream2, done) {
	var hasDiff = 0;
	var writeStream = new PNG();

	stream1
		.pipe(writeStream)
		.once('error', done)
		.on('parsed', function() {

			var data1 = this.data;
			writeStream = new PNG({width: this.width, height: this.height});

			stream2
				.pipe(new PNG())
				.once('error', done)
				.on('parsed', function() {
					var data2 = this.data;

					if (data1.length !== data2.length) { // error
					}

					var i = 0;
					var data = writeStream.data;

					while (data1[i] != null) {

						if (data1[i] !== data2[i] ||
							data1[i + 1] !== data2[i + 1] ||
							data1[i + 2] !== data2[i + 2] ||
							data1[i + 3] !== data2[i + 3]) {

							hasDiff = 1;

							data[i] = data2[i];
							data[i + 1] = data2[i + 1];
							data[i + 2] = data2[i + 2];
							data[i + 3] = data2[i + 3];
						}

						i += 4;
					}

					return done(null, writeStream.pack(), hasDiff);
				}
			);
		}
	);
}

function diff(isDiff, data, callback) {
	if (!isDiff) {
        callback(data);
        return;
    }

    let tmpDir = path.join(global.tmpDir, 'diff');

    let {
        frames,
        animations
    } = data;

    mkdirp(tmpDir, function (err) {
    	for (var i = 0, j = 0, len = frames.length; i < len; i++) {
            ((fIndex) => {
            	if (fIndex === len - 1) return;

            	let base = frames[fIndex]['src'],
    				src  = frames[fIndex + 1]['src'];

                let diffFilepath = path.join(tmpDir, filename = path.basename(src));

				let baseStream = fs.createReadStream(base),
					srcStream = fs.createReadStream(src);

				diffStream(baseStream, srcStream, function(err, outputStream, hasDiff) {
					if (err) throw err;

					frames[fIndex + 1]['src'] = diffFilepath;
					var writeStream = fs.createWriteStream(diffFilepath).on('finish', function(){
                        ++j;
                        if (j === len - 1) {
                            console.log(' ✔ diff done');
                            callback && callback(data);
                        }
                    });
					outputStream.pipe(writeStream);
				});

        	})(i);
        }
    });
}

module.exports = diff;
