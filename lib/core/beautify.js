const js_beautify = require('js-beautify')
const fs = require('fs')
const path = require('path')

const beautifyCSS = (filepath) => {
	let content = fs.readFileSync(filepath, 'utf8')
	content = js_beautify.css(content)
	fs.writeFileSync(filepath, content)
}

function beautify(dir) {
	let cssPath = path.join(dir, 'gka.css')
	if (fs.existsSync(cssPath)) {
		beautifyCSS(cssPath)
	}
}

module.exports = beautify;
