// version 0.0.0

const _PATH_ = require('path');
const { GlobSync } = require('glob');
const { minimatch } = require('minimatch');
const fs = require('fs').promises;

const { compile, VERSION } = require('@ui.js.org/ui');



const uiPlugin = async (opts) => {

    const namespace = opts.namespace || 'ui.js-bundled-tags';


    const PATH = _PATH_.resolve(opts.path);

    const files = GlobSync(PATH + '/**/*.tag', {
        ignore: opts.ignore ? PATH + opts.ignore : undefined
    }).found;

    console.log('ui.js 0.7.x experimental bundler');
    console.log('ui.js version 🛠: ', VERSION);
    console.log('ui.js tags path: ', PATH);

//    console.log(PATH, __dirname + '/' + PATH, _PATH_.resolve(__dirname + '/' + PATH))

    const tags = [];
    await Promise.all(files.map(async url => {
        const source = await fs.readFile(url, 'utf8');
        const path = url.substr(PATH.length);
        tags.push({
            source,
            path,
            returnName: opts.returnName ? minimatch(path, opts.returnName.name) : false,
            keepName: opts.keepName ? minimatch(path, opts.keepName) : false
        });
    }));

    var code = "const { customElement } = window['UIjs'];";


    const tagList = [];

    try {
        for (const tag of tags) {

            const { name, compiled } = await compile({
                source: tag.source,
                path: tag.path,
                keepName: tag.keepName,
                nodePath: PATH,
                BASE_URL: PATH,
                nodeFetch: async (path) => {
                    if(path[0] === '/') {
                        try {
                            return await fs.readFile(PATH + path, 'utf8');
                        } catch (e) {
                            const msg = `🛑🛑🛑🛑🛑 ui.js ❤️  ERROR loading "${PATH + path}" for tag ${tag.path}`+"\n"+`${e.message} 🛑🛑🛑🛑🛑`;
                            console.log(e.message);
                            throw msg;
                        }
                    } else { // 2 rewrite!!!
                        try {
                            return await fs.readFile(PATH + '/' + path, 'utf8');
                        } catch (e) {
                            const msg = `🛑🛑🛑🛑🛑 ui.js ❤️  ERROR loading "${PATH + '/' + path}" for tag ${tag.path}`+"\n"+`${e.message} 🛑🛑🛑🛑🛑`;
                            console.log(e.message);
                            throw msg;
                        }
                    }

                    throw `nodeFetch: ${PATH+' '+path} unknown issue!`;
                }
            }, tagList);
            console.log(`ui.js compile: ${tag.path} | <${name}>`);
            //console.log('-------------------------------------------------------');

            if(!tagList.includes(name)) {
                code += compiled + "\n";
                tagList.push(name);
            } else {
            //    console.log('Skip', name)
            }

            if(tag.returnName) opts.returnName.name = name;

        }

        console.log('ui.js compile done.');
        console.log('👌👌👌👌👌👌👌');
        console.log('☝️ ☝️ ☝️ ☝️ ☝️ ☝️ ☝️ ☝️ ☝️ ☝️ ☝️');
    } catch (e) {
        console.log('⬇️ ⬇️ ⬇️ ⬇️ ⬇️ ⬇️ ⬇️ ⬇️ ⬇️ ⬇️ ⬇️ ⬇️ ⬇️ ⬇️ ⬇️ ⬇️ ⬇️ ⬇️ ⬇️ ⬇️ ⬇️ ⬇️ ⬇️ ⬇️ ⬇️ ⬇️ ⬇️ ⬇️ ⬇️ ⬇️ ⬇️ ⬇️ ⬇️ ⬇️');
        console.log(e);
        console.log('🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑');
    }


    //console.log('---------------------------------------------------------')
    //console.log(code)
    //console.log('---------------------------------------------------------')



    return {
        name: namespace,
        setup(build) {
            build.onResolve({ filter: new RegExp(`^${namespace}:`) }, args => {
                return ({ path: args.path.substring(19, args.path.length) })
            });

            build.onResolve({ filter: new RegExp(`^${namespace}$`) }, args => ({ path: args.path, namespace: `${namespace}-ns` }));

            build.onLoad({ filter: /.*/, namespace: `${namespace}-ns` },
                () => ({
                    contents: code,
                    loader: 'js',
                })
            );
        },
    }
};

module.exports = uiPlugin;
