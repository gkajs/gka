// gka < 2.6.0
function adapt_lt_2_6_0(argv, template) {

    if (template === 'c' || template === 'crop' ) {
        argv.crop = true;
        template = 'css';
    }
    if (template === 's' || template === 'sprites' ) {
        argv.sprites = true;
        template = 'css';
    }
    if (template === 'n' || template === 'template' ) {
        template = 'css';
    }
    if (template === 'cs') {
        argv.crop = true;
        argv.sprites = true;
        template = 'css';
    }
    return {
        template,
        argv
    }
}

module.exports = {
    adapt_lt_2_6_0
};