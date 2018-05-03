/**
 * GKA (generate keyframes animation)
 * author: joeyguo
 * HomePage: https://github.com/joeyguo/gka
 * MIT Licensed.
 *
 */

const NodeFileSystem = require('../helpers/NodeFileSystem');

module.exports = class Context {
	constructor(options) {
		this.options = options;
		this.fileSystem = new NodeFileSystem();
		this.assets = {};
	}
}

