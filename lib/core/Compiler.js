/**
 * GKA (generate keyframes animation)
 * author: joeyguo
 * HomePage: https://github.com/joeyguo/gka
 * MIT Licensed.
 *
 */

const debug = require('debug')('gka:core');
const Hook = require('./Hook');
const Context = require('./Context');
const HOOK_NAMES = require('../constants/HOOK_NAMES');
const _ = require('lodash');
const pkg = require("../../package.json")
const chalk = require('chalk');

/**
 * Expose `Compiler` class.
 */
module.exports = class Compiler {
	/**
	 * Initialize a new `Compiler`.
	 * 
	 * @api public
	 */
	constructor(options = {}) {
        this.options = options;
        this.hooks = new Hook(HOOK_NAMES);
        this.context = new Context(options);
        // this.env = process.env.NODE_ENV || 'development';
	}

    run() {
        const {
            run,
            beforeGenerate,
            generate,
            done,
        } = this.hooks;

        const onCompiled = (context) => {
            return Promise.resolve(context)
                    .then(beforeGenerate)
                    .then(generate)
                    .then(context => {
                        context.endTime = Date.now();
                        return context;
                    })
                    .then(done)
                    .then(context => {
                        let {
                            fileSystem,
                        } = context;

                        console.log('\nFinished! ' + chalk.magenta((context.endTime - context.startTime) + 'ms\n'));

                        // TODO delete the last empty folder
                        fileSystem.rmdir(fileSystem.tmpdir);
                    })
		};
        let context = this.context;
        context.startTime = Date.now();
        
        return Promise.resolve(context)
            .then(run)
            .then(context => {
                console.log('gka@' + pkg.version + ' building...\n');
                return this.compile(context)
            })
            .then(onCompiled)
            .catch(err => {
                console.error(err)
            })
    }

    compile(context) {
        const {
            parse,
            transform,
            template,
        } = this.hooks;
        
        const MultiDataCompiler = context => {
            const {
                options,
                data,
                fileSystem,
            } = context;

            // TODO 
            // 当前只对css模板支持多倍图的代码生成
            if(options.template !== 'css') {
                let newContext = _.merge({}, context);
                newContext['data'] = data[0];
                return Promise.resolve(newContext).then(transform);
            }

            let pr = context.data.map(item => {
                let newContext = _.merge({}, context);
                newContext['data'] = item;
                return Promise.resolve(newContext).then(context=>{
                    return context;
                }).then(transform);
            })
            return Promise.all(pr).then(contextArrays => {
                let data = contextArrays.map(context => {
                    return context.data;
                }).sort((a, b) => a.ratio - b.ratio);
                return _.merge({}, contextArrays[0], {data})
            })
        }

        return Promise.resolve(context).then(parse).then(context => {
            return MultiDataCompiler(context)
        }).then(template);
    }
}