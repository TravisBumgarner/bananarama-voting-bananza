const path = require('path')
const webpack = require('webpack')

const HtmlWebpackPlugin = require('html-webpack-plugin')

const PLUGIN_VARS = {
    local: {
        __API_ENDPOINT__: "'http://localhost:8080'",
        __FIREBASE_CONFIG__: "'staging'",
        __LOGGING_LEVEL__: "'local'",
        __FEEDBACK_FORM_URL__: "'https://forms.gle/qQLtbhgJP1QMKxSZ6'"
    },
    production: {
        __API_ENDPOINT__: "' https://backend-26zg2vwovq-uc.a.run.app'",
        __FIREBASE_CONFIG__: "'production'",
        __LOGGING_LEVEL__: "'sentry'",
        __FEEDBACK_FORM_URL__: "'https://forms.gle/qQLtbhgJP1QMKxSZ6'"
    }
}

const getEnvVariables = () => {
    if (!process.env.NODE_ENV) {
        throw new Error('NODE_ENV is not defined.')
    }
    return PLUGIN_VARS[process.env.NODE_ENV]
}

const envVariables = getEnvVariables()

const webpackConfig = {
    entry: './src/index.tsx',
    output: {
        filename: 'app.bundle.js',
        path: path.resolve(__dirname, 'build'),
        publicPath: '/',
        pathinfo: false
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                            experimentalWatchApi: true,
                        },
                    },
                ],
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ],
            },
        ],
    },

    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            sharedComponents: path.resolve(__dirname, 'src/sharedComponents/'),
            theme: path.resolve(__dirname, 'src/theme.tsx'),
            utilities: path.resolve(__dirname, 'src/utilities.ts'),
            types: path.resolve(__dirname, 'src/types.ts'),
            context: path.resolve(__dirname, 'src/Context/'),
            modals: path.resolve(__dirname, 'src/modals/')
        },
    },
    devServer: {
        compress: true,
        port: 3000,
        host: '0.0.0.0',
        hot: true,
        historyApiFallback: true,
    },
    plugins: [
        new webpack.DefinePlugin(envVariables),
        new HtmlWebpackPlugin({
            template: './src/static/index.template.ejs',
            favicon: './src/static/favicon.png',
            inject: 'body',
        }),
    ],
    devtool: 'inline-source-map'
}

module.exports = webpackConfig
