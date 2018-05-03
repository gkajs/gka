/**
 * GKA (generate keyframes animation)
 * author: joeyguo
 * HomePage: https://github.com/joeyguo/gka
 * MIT Licensed.
 *
 */

/**
 * validate options
 * 
 * @return error arrays
 */
const validateOptions = options => {
    const errors = [];

    if (typeof options === "object") {
        // TODO
		return errors;
	} else {
		throw new Error("Invalid argument: options");
	}
}

module.exports = validateOptions;
