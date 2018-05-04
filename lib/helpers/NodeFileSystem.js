/**
 * GKA (generate keyframes animation)
 * author: joeyguo
 * HomePage: https://github.com/joeyguo/gka
 * MIT Licensed.
 *
 */

const fs = require("fs");
const path = require("path");
const mkdirp = require("mkdirp");
const os = require('os');
const crypto = require('crypto');
const rmdir = require('rmdir');

class NodeFileSystem {
	constructor() {
		this.mkdirp = mkdirp;
		this.mkdirSync = fs.mkdirSync.bind(fs);
		this.mkdir = fs.mkdir.bind(fs);
		this.rmdir = fs.rmdir.bind(fs);
		this.unlink = fs.unlink.bind(fs);
		this.writeFile = fs.writeFile.bind(fs);
		this.writeFileSync = fs.writeFileSync.bind(fs);
		this.join = path.join.bind(path);
		this.extname = path.extname.bind(path);
		this.basename = path.basename.bind(path);
		this.rmdir = rmdir.bind(path);
		this.tmpdir = path.join(os.tmpdir(), 'gka-' + crypto.randomBytes(16).toString('hex').slice(0, 32));

		this.debugfolder = path.join(__dirname, '..', '..', 'debug');
		rmdir(this.debugfolder);
	}
	writeFileFromPathPromise(src, dest) {
		return new Promise((resolve, reject) => {
			mkdirp(path.dirname(dest), function (err) {
				if (err) return console.error(err)
				let writeStream = fs.createWriteStream(dest).on('finish', resolve);
				fs.createReadStream(src).pipe(writeStream);
			});
		})
	}
	writeFileFromContentPromise(dest, content) {
		return new Promise((resolve, reject) => {
			mkdirp(path.dirname(dest), function (err) {
				if (err) console.error(err);
				fs.writeFile(dest, content, err => {
					if (err) return console.error(err);
					resolve();
				})
			});
		})
	}

	debug(name, content) {
		// debug 模式下开启
		if (false) return Promise.resolve();

		let filepath = path.join(this.debugfolder, name);
		return new Promise((resolve, reject) => {
			mkdirp(path.dirname(filepath), function (err) {
				if (err) console.error(err);
				fs.writeFile(filepath, JSON.stringify(content, null, '    '), err => {
					if (err) return console.error(err);
					console.log('[+] DEBUG:', filepath)
					resolve();
				})
			});
		})
	}
}

module.exports = NodeFileSystem;

