module.exports = {
    entry: {
        'index': './src/js/main.js', 
    },
    output: {
        path: __dirname,
        filename: './dist/[name].js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                query: {
                    presets: ['env']
                }
            },
            {
                test: /\.less$/,
                loader: 'style!css!less',
            },
            {
                test: /\.css$/,
                loader: 'style!css',
            },
            { 
                test:/.(png)|(jpg)$/, 
                loader: 'url?limit=50000' 
            },
            {
                test: /\.vue$/,
                loader: 'vue',
            }
        ]
    }
};
