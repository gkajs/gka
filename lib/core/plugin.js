const Event = require('./event')

class Plugin extends Event {
	constructor(...args) {
        super(...args);
    }
}

module.exports = Plugin;
