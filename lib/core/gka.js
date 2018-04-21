/**
 * GKA (generate keyframes animation)
 * author: joeyguo
 * HomePage: https://github.com/joeyguo/gka
 * MIT Licensed.
 */

const _ = require('lodash')
const pkg    = require("../../package.json")
const imagex = require("../imagex")
const getTpl = require("./tpl")
const info   = require("./info")
const {
    checkOptions,
    checkTplConfig,
} = require("./optionsHelper")

class GKA {
    constructor(options = {}) {
        // super();
        
        let defaultOptions = {
            template: 'css',
            frameduration: 0.04,
            gkaVersion: pkg.version,
        }

        options = _.merge(defaultOptions, options)

        // 获得当前的模板函数
        let tpl = getTpl(options.template);

        // 针对tpl的参数支持情况，需要检查的opts
        let checkListOptsDefault = {
            'crop': false,
            'sprites': false,
            'diff': false,
            'split': false
        };

        // 检查模板对参数的支持情况，必要时进行重置 options
        options = checkTplConfig(tpl, checkListOptsDefault, options);
        
        // 设置参数
        options = checkOptions(options);

        // log 参数信息
        info(options);

        this.options = options
        this.tpl = tpl
    }

    run(callback) {
        let {
            options,
            tpl,
        } = this

        imagex(options, (data) => {
            tpl(data, options, () => {
                // console.log('gka finished!');
                callback && callback(data, options);
            })
        })
    }
}

let main = (options = {}, callback) => {
    let gka = new GKA(options)
    gka.run(callback)
}

module.exports = main;