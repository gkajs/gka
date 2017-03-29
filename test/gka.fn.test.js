var assert = require('assert');
var fs = require('fs');
var path = require('path');

var getfiles = require('../lib/core/getfiles');
var ridding = require('../lib/core/ridding');
var x2x = require('../lib/core/x2x');
var gcss = require('../lib/core/gcss');


var expected_src2id = {};
var imgFolder = path.join(__dirname, "img4test");

for (var i = 0; i < 8; i++) {
    expected_src2id[path.join(__dirname, "img4test", `gkatest_${i+1}.png`)] = i;
}

var expected_src2id_after_ridding = { 
    [path.join(imgFolder, "gkatest_1.png")]: 0,
    [path.join(imgFolder, "gkatest_2.png")]: 1,
    [path.join(imgFolder, "gkatest_3.png")]: 2,
    [path.join(imgFolder, "gkatest_4.png")]: 3,
    [path.join(imgFolder, "gkatest_5.png")]: 4,
    [path.join(imgFolder, "gkatest_6.png")]: 2,
    [path.join(imgFolder, "gkatest_7.png")]: 1,
    [path.join(imgFolder, "gkatest_8.png")]: 7
};

var expected_xx = { 
    src2distid:
       { [path.join(imgFolder, "gkatest_1.png")]: 1,
         [path.join(imgFolder, "gkatest_2.png")]: 2,
         [path.join(imgFolder, "gkatest_3.png")]: 3,
         [path.join(imgFolder, "gkatest_4.png")]: 4,
         [path.join(imgFolder, "gkatest_5.png")]: 5,
         [path.join(imgFolder, "gkatest_6.png")]: 3,
         [path.join(imgFolder, "gkatest_7.png")]: 2,
         [path.join(imgFolder, "gkatest_8.png")]: 6 },
    distids: [ 1, 2, 3, 4, 5, 6 ],
    src2src:
       { [path.join(imgFolder, "gkatest_1.png")]: path.join(imgFolder, "gkatest_1.png"),
         [path.join(imgFolder, "gkatest_2.png")]: path.join(imgFolder, "gkatest_2.png"),
         [path.join(imgFolder, "gkatest_3.png")]: path.join(imgFolder, "gkatest_3.png"),
         [path.join(imgFolder, "gkatest_4.png")]: path.join(imgFolder, "gkatest_4.png"),
         [path.join(imgFolder, "gkatest_5.png")]: path.join(imgFolder, "gkatest_5.png"),
         [path.join(imgFolder, "gkatest_6.png")]: path.join(imgFolder, "gkatest_3.png"),
         [path.join(imgFolder, "gkatest_7.png")]: path.join(imgFolder, "gkatest_2.png"),
         [path.join(imgFolder, "gkatest_8.png")]: path.join(imgFolder, "gkatest_8.png") },
    srcs:
       [ path.join(imgFolder, "gkatest_1.png"),
         path.join(imgFolder, "gkatest_2.png"),
         path.join(imgFolder, "gkatest_3.png"),
         path.join(imgFolder, "gkatest_4.png"),
         path.join(imgFolder, "gkatest_5.png"),
         path.join(imgFolder, "gkatest_8.png") ] 
};

describe('single test', function () {

    it('getfiles.js return src2id is ok', function (next) {
        getfiles(imgFolder, (src2id) => {
            assert.deepEqual(src2id, expected_src2id, 'expect src2id == expected_src2id');
            next();
        });
    });

    it('ridding.js return src2id is ok', function (next) {
        ridding(expected_src2id, (src2id) => {
            assert.deepEqual(src2id, expected_src2id_after_ridding, 'expect src2id == expected_src2id_after_ridding');
            next();
        });
    });

    it('x2x.js return xx is ok', function () {
        var xx = x2x(expected_src2id_after_ridding);
        assert.deepEqual(xx, expected_xx, 'expect src2id == expected_src2id_after_ridding');
    });
});