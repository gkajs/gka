/**
 * GKA (generate keyframes animation)
 * author: joeyguo
 * HomePage: https://github.com/joeyguo/gka
 * MIT Licensed.
 *
 */

module.exports = class Hook {
	constructor (names) {
		this.hooks = {};
		names.forEach(name => {
			this.hooks[name] = [];
			Object.defineProperty(this, name, {
                get: () => {
                	return compose(this.hooks[name])
                }
            })
		})
	}
	on(name, listener) {
		if (!this.hooks[name]) return console.warn('unsupported hook: %j', name)
		this.hooks[name].push(listener);
	}
}

function compose(fns) {
	return (context, next) => {
		if (!fns) return Promise.resolve(context);

		return new Promise((resolve, reject)=> {
			let i = 0;
			return _next(context);
			function _next(context) {
				try {
					let fn = fns[i];
					  if (i++ === fns.length) fn = next
					  if (!fn) return resolve(context)
					return fn(context, _next)
				} catch(err) {
					reject(err)
				}
			}
		});
	}
}