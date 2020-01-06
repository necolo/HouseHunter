const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');

const REPO_PATH = path.join(__dirname);
const DIST_PATH = path.join(REPO_PATH, 'build');

const PACEAGE_PATH = path.join(REPO_PATH, 'package.json');
const PACKAGEJSON = require(PACEAGE_PATH);
let version = PACKAGEJSON.version;

function commonConfig(devMode) {
    let entryFile = './src/view/ui.tsx';
    let tsconfigFile = 'frontend.tsconfig.json';

    return {
        entry: {
            app: entryFile,
            vendor: [
                'react',
                'react-dom',
                // 'react-router-dom',
            ],
        },
        output: {
            path: DIST_PATH,
            publicPath: '/',
            filename: devMode ? '[name].bundle.js' : `[name]${version}.bundle.min.js`,
            chunkFilename: devMode ? '[name].chunk.js' : `[name]${version}.chunk.min.js`,
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.json'],
            modules: ['node_modules'],
            alias: {},
        },
        module: {
            rules: [{
                    test: '/\.html$/',
                    use: [{
                        loader: 'html-loader',
                        options: {
                            attrs: ['img:src'],
                        },
                    }]
                },
                {
                    test: /\.tsx?$/,
                    use: [{
                            loader: 'babel-loader',
                            options: {
                                // exclude: 'node_modules',
                                plugins: [
                                    ['import', {
                                        libraryName: 'antd-mobile',
                                        style: true
                                    }],
                                ],
                            }
                        },
                        {
                            loader: 'ts-loader',
                            options: {
                                configFile: tsconfigFile,
                            }
                        },
                    ]
                },
                {
                    test: /\.scss$/,
                    use: [
                        devMode ? {
                            loader: 'style-loader',
                            options: {
                                injectType: 'singletonStyleTag',
                            },
                        } : MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: () => [require('precss'), require('autoprefixer')],
                            }
                        },
                        'sass-loader',
                    ]
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader'],
                },
                {
                    test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2|ico)$/,
                    use: [{
                        loader: 'url-loader',
                        options: {
                            name: "[name]-[hash:5].min.[ext]",
                            limit: 8192,
                            publicPath: "assets",
                            outputPath: "build/assets",
                        }
                    }, ]
                },
            ],
        },
        optimization: {
            runtimeChunk: 'single',
            splitChunks: {
                chunks: 'async',
                minSize: 30000,
                maxSize: 0,
                minChunks: 1,
                maxAsyncRequests: 5,
                maxInitialRequests: 3,
                automaticNameDelimiter: '~',
                name: true,
                cacheGroups: {
                    vendors: {
                        test: /\/node_modules\//,
                        priority: -10,
                        chunks: 'initial',
                    },
                    'react-vendor': {
                        test: /react/,
                        priority: 1,
                        chunks: 'initial',
                    },
                    default: {
                        minChunks: 2,
                        priority: -20,
                        reuseExistingChunk: true,
                    },
                },
            },
        },
        plugins: [
            new CopyPlugin([{
                from: 'assets',
                to: 'assets'
            }]),
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: 'index.html',
                minify: {
                    collapseWhitespace: true,
                    removeComments: true,
                },
            }),
        ],
    };
}

module.exports = (env, argv) => {
    const devMode = argv.mode === 'development' || env !== 'production';
    console.log('--- frontend:', devMode ? 'development' : 'production', '---');

    if (!devMode) {
        const fs = require('fs');
        const versionSplits = version.split('.');
        let v = +(versionSplits[2]);
        v++;
        versionSplits[2] = v;
        const newVersion = versionSplits.join('.');
        PACKAGEJSON.version = newVersion;
        fs.writeFileSync(PACEAGE_PATH, JSON.stringify(PACKAGEJSON));
        console.log(`upgrade version from ${version} to ${newVersion}`);
        version = newVersion
    }

    const devConfig = {
        mode: 'development',
        devtool: 'source-map',
        module: {
            rules: [{
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader'
            }, ],
        },
        devServer: {
            contentBase: path.join(__dirname, 'build'),
            compress: true,
            port: 2333,
            open: true,
            hot: true,
            noInfo: true,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
                "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
            },
            overlay: true,
            historyApiFallback: true,
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NamedModulesPlugin(), // also for hot updates
        ],
    };

    const prodConfig = {
        mode: 'production',
        plugins: [
            // new BundleAnalyzerPlugin(),
            new MiniCssExtractPlugin({
                filename: `[name]${version}.min.css`,
                chunkFilename: `[name]${version}.min.css`,
            }),
            new OptimizeCSSAssetsPlugin({}),
            new CleanWebpackPlugin(),
        ],
    };

    const config = devMode ? devConfig : prodConfig;
    return merge(commonConfig(devMode), config);
}