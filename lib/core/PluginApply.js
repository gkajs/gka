/**
 * GKA (generate keyframes animation)
 * author: joeyguo
 * HomePage: https://github.com/joeyguo/gka
 * MIT Licensed.
 *
 */

const _ = require('lodash');
const fs = require('fs');
const ImageRatioPlugin = require("../plugins/ImageRatioPlugin");
const ImageFlattenPlugin = require("../plugins/ImageFlattenPlugin");
const ImageSplitPlugin = require("../plugins/ImageSplitPlugin");
const ImageBgColorPlugin = require("../plugins/ImageBgColorPlugin");
const ImageDiffPlugin = require("../plugins/ImageDiffPlugin");
const ImageCropPlugin = require("../plugins/ImageCropPlugin");
const ImageUniquePlugin = require("../plugins/ImageUniquePlugin");
const ImageSpritesPlugin = require("../plugins/ImageSpritesPlugin");
const ImageNamePlugin = require("../plugins/ImageNamePlugin");

const CssTemplatePlugin = require("../templates/CssTemplatePlugin");
const SvgTemplatePlugin = require("../templates/SvgTemplatePlugin");
const CanvasTemplatePlugin = require("../templates/CanvasTemplatePlugin");

const ImageMinifyPlugin = require("../plugins/ImageMinifyPlugin");
const BeautifyFilePlugin = require("../plugins/BeautifyFilePlugin");
const DataInfoPlugin = require("../plugins/DataInfoPlugin");
const LogOptionsPlugin = require("../plugins/LogOptionsPlugin");

class PluginApply {
    
    process(options, compiler) {
        
        new LogOptionsPlugin().apply(compiler);

        new ImageRatioPlugin().apply(compiler);
        new ImageFlattenPlugin().apply(compiler);

        new BeautifyFilePlugin().apply(compiler);

        let template = options.template;

        if (template === 'css')
            new CssTemplatePlugin().apply(compiler);
        else if (template === 'canvas')
            new CanvasTemplatePlugin().apply(compiler);
        else if (template === 'svg')
            new SvgTemplatePlugin().apply(compiler);
        else if(_.isFunction(template))  // function template
            template(compiler);
        else if(fs.existsSync(template)) {
            /**
             * path template
             * 
             * local \ node_modules \ global node_modules
             */
            let PathTemplatePlugin = require(template);
            new PathTemplatePlugin().apply(compiler);
        }
        else
            console.warn('[warn]can not find template: ' + template);

        // context
        compiler.hooks.templateOptions(compiler.context);

        if (options.split)
            new ImageSplitPlugin().apply(compiler);
        if (options.bgcolor)
            new ImageBgColorPlugin(options.bgcolor).apply(compiler);
        if (options.diff)
            new ImageDiffPlugin().apply(compiler);
        if (options.crop)
            new ImageCropPlugin().apply(compiler);
        if (options.unique)
            new ImageUniquePlugin().apply(compiler);
        if (options.sprites)
            new ImageSpritesPlugin({
                algorithm: options.algorithm,
                spritesCount: options.spritesCount
            }).apply(compiler);
        if (options.mini)
            new ImageMinifyPlugin().apply(compiler);
        if (options.info)
            new DataInfoPlugin().apply(compiler);
            
        new ImageNamePlugin({
            prefix: options.prefix,
            dest: options.output,
        }).apply(compiler);

        return options;
    }
}
module.exports = PluginApply;