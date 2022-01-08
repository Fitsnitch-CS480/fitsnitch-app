const path = require('path');
const fs = require('fs');

const SRC_DIR = path.resolve(__dirname, 'src/handlers');
const OUT_DIR = path.resolve(__dirname, 'dist');

/**
 * Gathers the handler functions files and returns an object for
 * config.entry property
 * 
 * @returns object with pattern {...<name>:<path>}
 */
const handlers = () => {
    let handlers = {};
    fs.readdirSync(SRC_DIR).forEach(f => {
        if (path.extname(f) == ".ts")
            handlers[path.parse(f).name] = path.resolve(SRC_DIR, f);
    });
    return handlers;
}

const config = {
    mode: "production",
    entry: {
        ...handlers()
    },
    // aws-sdk is already available in the Node.js Lambda environment
    //  so it should not be included in function bundles
    externals: [
        'aws-sdk'
    ],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        path: OUT_DIR,
        filename: '[name].js',
        library: '[name]',
        libraryTarget: 'umd'
    },
    target: 'node'
};

module.exports = config;
