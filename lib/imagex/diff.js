/**
 * imagex
 * author: joeyguo
 * HomePage: https://github.com/gkajs/imagex
 * MIT Licensed.
 *
 * image diff
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

function diff(isDiff, tmpDir, src2id, callback) {
	if (!isDiff) {
        callback(src2id, {});
        return;
    }

    tmpDir = path.join(tmpDir, 'diff');

    var len = Object.keys(src2id).length,
        j = 0,
        src2iddiff = {},
        src2info = {};

	src2iddiff[getKeyByVal(src2id, 0)] = 0;

    mkdirp(tmpDir, function (err) {

    	for (var i = 0; i < len; i++) {
    		((id) => {
    			if (id === len - 1) {
    				return;
    			}
    			var base = getKeyByVal(src2id, id),
    				src  = getKeyByVal(src2id, id + 1);

                var filename = path.basename(src),
                    diffFilepath = path.join(tmpDir, filename);

                src2iddiff[diffFilepath] = id + 1;

				var baseStream = fs.createReadStream(base),
					srcStream = fs.createReadStream(src);

				diffStream(baseStream, srcStream, function(err, outputStream, hasDiff) {
					if (err) throw err;

					var writeStream = fs.createWriteStream(diffFilepath).on('finish', function(){
                        ++j;
                        if (j === len - 1) {
                            console.log(' ✔ image diff generated');
                            callback && callback(src2iddiff);
                        }
                    });
					outputStream.pipe(writeStream);
				});
            })(i);
    	}
    });
}

module.exports = diff;
