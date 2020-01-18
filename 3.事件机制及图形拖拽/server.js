var express = require('express')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')

var port = 5000
var app = express()
var compiler = webpack({
    mode: 'development',
    entry: {
        'app': ['webpack-hot-middleware/client?noInfo=true&reload=true', './index.ts']
    },
    output: {
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ]
    },
    plugins: [
        // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        // https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: true
        })
    ]
})

var devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: '/',
    quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: false,
    heartbeat: 2000
})

// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
        hotMiddleware.publish({ action: 'reload' })
        cb()
    })
})

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

var uri = 'http://localhost:' + port

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
    console.log('> Listening at ' + uri + '\n')
})

app.listen(port)