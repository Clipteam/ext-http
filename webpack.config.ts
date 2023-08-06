import path from 'path';
import webpack from 'webpack';

import CopyWebpackPlugin from 'copy-webpack-plugin';
// @ts-expect-error
import ZipWebpackPlugin from 'zip-webpack-plugin';

import info from './info.json';

const config: webpack.Configuration = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    entry: './index.ts',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'build'),
        module: true,
        library: {
            type: 'commonjs2',
            export: 'default'
        }
    },
    experiments: {
        outputModule: true
    },
    externals: {
        'clipcc-extension': 'ClipCCExtension'
    },
    externalsType: 'global',
    module: {
        rules: [{
            test: /\.tsx?$/,
            loader: 'ts-loader'
        }]
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            'clipcc-extension$': path.resolve(__dirname, 'node_modules/clipcc-extension/dist/web/development.js'),
        },
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [{
                from: path.join(__dirname, 'locales'),
                to: path.join(__dirname, 'build/locales')
            }, {
                from: path.join(__dirname, 'assets'),
                to: path.join(__dirname, 'build/assets')
            }, {
                from: path.join(__dirname, 'info.json'),
                to: path.join(__dirname, 'build/info.json')
            }]
        }),
        new ZipWebpackPlugin({
            path: path.join(__dirname, 'dist'),
            filename: `${info.id}@${info.version}`,
            extension: 'ccx'
        })
    ]
};

export default config;
