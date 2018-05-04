/**
 * GKA (generate keyframes animation)
 * author: joeyguo
 * HomePage: https://github.com/joeyguo/gka
 * MIT Licensed.
 *
 */

const validateOptions = require("../helpers/validateOptions");
const OptionsDefaulter = require("../helpers/OptionsDefaulter");
const Compiler = require("./Compiler");
const Parser = require("./Parser");
const Generator = require('./Generator');
const PluginApply = require('./PluginApply');

const defaultCallback = (err, context) => {}

const gka = (options, callback=defaultCallback) => {

    /**
	 * validate options.
	 */
	validateOptions(options);
    
    options = new OptionsDefaulter().process(options);
    
    /**
	 * Initialize a new `Compiler`.
	 */
    let compiler = new Compiler(options);
    
    /**
	 * add parser
	 */
    new Parser().apply(compiler);
    
    /**
	 * add generator
	 */
    new Generator().apply(compiler);

    /**
     * add built-in plugins
     * by options
     */
    new PluginApply().process(options, compiler);

    /**
	 * add plugins
     * by options.plugins
	 */
    if (options.plugins && Array.isArray(options.plugins)) {
        for (const plugin of options.plugins) {
            plugin.apply(compiler);
        }
    }

    /**
	 * just fire~
	 */
    compiler.run(callback)

	return compiler;
};

exports = module.exports = gka;