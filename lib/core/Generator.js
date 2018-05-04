/**
 * GKA (generate keyframes animation)
 * author: joeyguo
 * HomePage: https://github.com/joeyguo/gka
 * MIT Licensed.
 *
 */

module.exports = class Generator {
    apply(compiler) {
        compiler.hooks.on('generate', (context, next) => {
            const {
                options,
                assets,
                fileSystem,
            } = context;
            
            let {
                data,
            } = context;
    
            const dir = options.output,
                frames = data.frames;
    
            let pr = [];
    
            data = Array.isArray(data)? data: [data];
    
            data.map(item => {
                let p = item.frames.map(item => {
                    let {src, dest} = item;
                    return fileSystem.writeFileFromPathPromise(src, dest);
                })
                pr = pr.concat(...p);
            })
    
            for (let name in assets) {
                let filePath = fileSystem.join(dir, name);
                let p = fileSystem.writeFileFromContentPromise(filePath, assets[name]);
                pr.push(p);
            }
            
            Promise.all(pr).then( _ =>{
                console.log('[+] generate');
                next(context);
            });
        })
    }
}