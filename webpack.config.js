const { resolve } = require('path');
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const webpack = require('webpack');
const ip = require('ip').address();
const CleanPlugin = require('clean-webpack-plugin'); //
const HtmlwebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin'); // 压缩文件
const CopyWebpackPlugin = require('copy-webpack-plugin');

const package = require('./package.json');
const appName = package.name.split('.').join('');

const ENV = process.env.NODE_ENV;
//定义了一些文件夹的路径
const ROOT_PATH = resolve(__dirname);
const APP_PATH = resolve(ROOT_PATH, 'app');
const BUILD_PATH = resolve(ROOT_PATH, 'dist');

const isProduction = function() {
    return process.env.NODE_ENV === 'production';
};

// 判断开发环境
const isHot = function() {
    return process.env.NODE_ENV === 'dev';
};

// 判断开发环境
const isTest = function() {
    return process.env.NODE_ENV === 'test';
};

const ENV_DIR = './env.json';

const config = {
    devtool: 'cheap-module-eval-source-map', // 调试模式，开发的时候使用，打包的时候不要开！！！
    //项目的文件夹 可以直接用文件夹名称 默认会找index.js 也可以确定是哪个文件名字
    entry: {
        // 空是因为要根据规则动态找到入口文件
    },
    //输出的文件名 合并以后的js会命名为bundle.js
    output: {
        path: BUILD_PATH,
        publicPath: '',
        filename: '[name].[hash:6].js',
        chunkFilename: '[id].chunk.js',
    },
    resolve: {
        alias: {
            env: resolve(__dirname, ENV_DIR),
            api: resolve(__dirname, './src/api/index.js'),
            util: resolve(__dirname, './src/common/util/index.js'),
            component: resolve(__dirname, './src/common/component/component.js'),
        },
        //设置require或import的时候可以不需要带后缀
        extensions: ['ejs', '.js', '.css'],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ['babel-loader'],
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
            {
                test: /\.(ejs|tpl)$/,
                loaders: ['ejs'],
            },
            {
                test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 100,
                            name: '[name].[ext]',
                        },
                    },
                ],
            },
        ],
    },
    devServer: {
        // 开启服务器的模块热替换(HMR)
        // hot: true,
        host: '0.0.0.0',
        inline: true,
        disableHostCheck: true,
        // 输出文件的路径
        // contentBase: resolve(__dirname, 'web'),
        // 和上文 output 的“publicPath”值保持一致
        publicPath: '/',
    },

    plugins: [
        new CleanPlugin(['dist']), // 清空dist文件夹
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common', // 将公共模块提取,生成名为`common`的chunk
            minChunks: 2, // 提取至少2个模块共有的部分
        }),
        new ExtractTextPlugin('[name].[hash:6].css'),
    ],
};

module.exports = config;

if (isProduction()) {
    config.devtool = 'source-map';
    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
        }),
    );
}

const files = glob.sync('./src/*/index.html');
const newEntries = {};

function getEntry(globPath) {
    var files = glob.sync(globPath);
    var entries = {},
        entry,
        dirname,
        basename,
        pathname,
        extname;
    for (var i = 0; i < files.length; i++) {
        entry = files[i];

        dirname = path.dirname(entry);
        extname = path.extname(entry);
        basename = path.basename(entry, extname);
        pathname = path.join(dirname, basename);
        //console.log('----?',entry,'--',dirname,'--',extname,'--',basename)

        entries[pathname] = './' + entry;
        // console.log(`${dirname},${extname},${basename},${pathname}`)
    }
    return entries;
}

const pages = Object.keys(getEntry('./src/*/index.html'));
const pageConfig = require('./env.json');
const page_common_header = fs.readFileSync('./src/common/tpl/header.ejs', 'utf-8');
const page_common_footer = fs.readFileSync('./src/common/tpl/footer.ejs', 'utf-8');
const page_common_statisticsHeader = fs.readFileSync('./src/common/tpl/statisticsHeader.ejs', 'utf-8');
const page_common_statisticsFooter = fs.readFileSync('./src/common/tpl/statisticsFooter.ejs', 'utf-8');

pages.forEach(function(pathname) {
    console.log(`pathname=========>${pathname}`);

    var itemName = pathname.split('/'); //根据系统路径来取文件名,win==>\\,mac==>\/
    var name = itemName[1];
    var newName = '';
    if (isTest()) {
        newName = name + '_test';
    } else {
        newName = name;
    }
    var conf = {
        filename: `${newName}.html`, //生成的html存放路径,相对于path
        template: `${pathname}.html`, //html模板路径
        inject: false, //允许插件修改哪些内容,包括head与body
        hash: false, //是否添加hash值
        minify: {
            //压缩HTML文件
            removeComments: true, //移除HTML中的注释
            collapseWhitespace: false, //删除空白符与换行符
        },
    };
    conf.chunks = ['common', itemName[1]];
    conf.title = '吉林民众托老所';
    conf.statisticsHeader = page_common_statisticsHeader;
    conf.statisticsFooter = page_common_statisticsFooter;
    conf.header = page_common_header;
    conf.footer = page_common_footer;
    config.plugins.push(new HtmlwebpackPlugin(conf));

    // var name = /.*\/src\/(.*)\/index\.html/.exec(pathname)[1];
    // console.log(`name============>${name}`)
    //得到apps/question/index这样的文件名
    newEntries[name] = `./src/${name}/js/index.js`;
});

config.entry = Object.assign({}, config.entry, newEntries);

if (ENV == 'production' || ENV == 'test') {
    config.devtool = 'source-map';
    config.output.publicPath = '//p0.ifengimg.com/fe/zl/test/live/' + appName + '/';
    // config.output.publicPath = '/';
    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
        }),
    );
    config.plugins.push(
        new CopyWebpackPlugin([
            { from: 'lib/images', to: '' },
            { from: 'lib/js', to: '' },
            { from: 'lib/css', to: '' },
            { from: 'lib/font', to: '' },
            { from: 'lib/font-awesome/css', to: '' },
            { from: 'lib/font-awesome/fonts', to: '' },
        ]),
    );
    config.plugins.push(
        new ZipPlugin({
            // OPTIONAL: defaults to the Webpack output path (above)
            // can be relative (to Webpack output path) or absolute
            // path: '',

            // OPTIONAL: defaults to the Webpack output filename (above) or,
            // if not present, the basename of the path
            filename: ENV == 'production' ? 'p2p.zip' : 'p2p_test.zip',

            // OPTIONAL: defaults an empty string
            // the prefix for the files included in the zip file
            // pathPrefix: 'dist',

            // OPTIONAL: defaults to including everything
            // can be a string, a RegExp, or an array of strings and RegExps
            include: [/\.html$/],

            // OPTIONAL: defaults to excluding nothing
            // can be a string, a RegExp, or an array of strings and RegExps
            // if a file matches both include and exclude, exclude takes precedence
            // exclude: [/\.png$/, /\.html$/],

            // yazl Options

            // OPTIONAL: see https://github.com/thejoshwolfe/yazl#addfilerealpath-metadatapath-options
            fileOptions: {
                mtime: new Date(),
                mode: 0o100664,
                compress: true,
                forceZip64Format: false,
            },

            // OPTIONAL: see https://github.com/thejoshwolfe/yazl#endoptions-finalsizecallback
            zipOptions: {
                forceZip64Format: false,
            },
        }),
    );
}
