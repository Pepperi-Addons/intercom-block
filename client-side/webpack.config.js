
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const mf = require("@angular-architects/module-federation/webpack");
const path = require("path");
const share = mf.share;
const singleSpaAngularWebpack = require('single-spa-angular-webpack5/lib/webpack').default;
const { merge } = require('webpack-merge');

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(
    path.join(__dirname, './tsconfig.json'),
    [
        /* mapped paths to share */
    ]);
    
const filename = 'chat'; // block_file_name

module.exports = (config, options, env) => {
    const mfConfig = {
        output: {
            uniqueName: `${filename}`,
            publicPath: "auto"
        },
        optimization: {
            // Only needed to bypass a temporary bug
            runtimeChunk: false
        },
        resolve: {
            alias: {
                ...sharedMappings.getAliases(),
            }
        },
        plugins: [
            new ModuleFederationPlugin({
                name: `${filename}`,
                filename: `${filename}.js`,
                exposes: {
                    './BlockModule': './src/app/block/index.ts',
                    './BlockEditorModule': './src/app/block-editor/index.ts'
                },
                shared: share({
                    "@angular/core": { eager: true, singleton: true, strictVersion: true, requiredVersion: 'auto' }, 
                    "@angular/common": { eager: true, singleton: true, strictVersion: true, requiredVersion: 'auto' }, 
                    "@angular/common/http": { eager: true, singleton: true, strictVersion: true, requiredVersion: 'auto' }, 
                    "@angular/router": { eager: true, singleton: true, strictVersion: true, requiredVersion: 'auto' },
                    
                    ...sharedMappings.getDescriptors()
                })
            }),
            sharedMappings.getPlugin()
        ]
    };

    const merged = merge(config, mfConfig);
    const singleSpaWebpackConfig = singleSpaAngularWebpack(merged, options);
    return singleSpaWebpackConfig;
    //Feel free to modify this webpack config however you'd like to
};
