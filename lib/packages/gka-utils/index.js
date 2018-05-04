/**
 * GKA (generate keyframes animation)
 * author: joeyguo
 * HomePage: https://github.com/gkajs/gka-utils
 * 
 * gka template utils.
 */

var css = require('./core/css/');
var file = require('./core/file/');
var data = require('./core/data/');
var html = require('./core/html/');
var _ = require('./core/_/');

module.exports = {
    html: html,
    css: css,
    file: file,
    data: data,
    _: _,
}