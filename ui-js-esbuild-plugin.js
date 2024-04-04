// version 0.0.0

const { GlobSync } = require('glob');
const { minimatch } = require('minimatch');
const fs = require('fs').promises;

const { compile, VERSION } = require('@ui.js.org/ui');


const uiPlugin = async (opts) => {
    console.log('ui.js 0.7.x experimental bundler');
    console.log('ui.js version 🛠: ', VERSION);
    console.log('ui.js tags path: ', opts.path);
    const namespace = opts.namespace || 'ui.js-bundled-tags';

    const files = GlobSync(opts.path + '/**/*.tag', {
        ignore: opts.ignore ? opts.path + opts.ignore : undefined
    }).found;

    const tags = [];
    await Promise.all(files.map(async url => {
        const source = await fs.readFile(url, 'utf8');
        const path = url.substr(opts.path.length);
        tags.push({
            source,
            path,
            keepName: opts.keepName ? minimatch(path, opts.keepName) : false
        });
    }));

    var code = "const { customElement } = window['UIjs'];";

    try {
        for (const tag of tags) {
            const { name, compiled } = await compile({
                source: tag.source,
                path: tag.path,
                keepName: tag.keepName,
                nodePath: opts.path,
                BASE_URL: opts.path,
                nodeFetch: async (path) => {
                    if(path[0] === '/') {
                        try {
                            return await fs.readFile(opts.path + path, 'utf8');
                        } catch (e) {
                            const msg = `ui.js ❤️  ERROR loading "${opts.path + path}" for tag ${tag.path}`+"\n"+`${e.message}`;
                            console.log(e.message);
                            throw msg;
                        }
                    } else { // 2 rewrite!!!
                        try {
                            return await fs.readFile(opts.path + '/' + path, 'utf8');
                        } catch (e) {
                            const msg = `ui.js ❤️  ERROR loading "${opts.path + '/' + path}" for tag ${tag.path}`+"\n"+`${e.message}`;
                            console.log(e.message);
                            throw msg;
                        }
                    }

                    throw `nodeFetch: ${opts.path+' '+path} unknown issue!`;
                }
            });
            console.log(`ui.js compile: ${tag.path} | <${name}>`);
            code += compiled + "\n";
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
            build.onResolve({ filter: new RegExp(`^${namespace}:`) }, args => ({ path: args.path.substring(19, args.path.length) }));

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
