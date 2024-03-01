
const esbuild = require('esbuild');
const UIPlugin = require('@ui.js.org/ui-js-stage-1-esbuild-plugin');

(async () => {
    await esbuild.build({
        supported: {
            "dynamic-import": true
        },
        // application entry point
        entryPoints: ['src/index.js'],
        format: 'esm',
        bundle: true,
        minify: true,
        treeShaking: true,
        target: ['chrome60','firefox60','safari12'],
        // bundled application
        outfile: 'public/bundle.js',

        plugins: [await UIPlugin({

            // scan 'src/ui' folder for all *.tag files
            path: 'src/ui',

            // all tags in 'src/ui/keepName' folder, including subfolders, will have the same name in the DOM
            // as the file name. File names must contain dashes. "my-component.tag" will be <my-component/>
            keepName: '/keepName/**/*-*.tag', // optional

            // ignore adding *.tag files from 'src/ui/my-dev' folder to the package
            ignore: '/my-dev/**' // optional
        })],
    })
})();
