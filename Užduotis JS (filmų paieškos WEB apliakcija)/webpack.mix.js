// webpack.mix.js
let mix = require('laravel-mix');
const webpack = require('webpack'); 

require('dotenv').config();

mix.js('src/app.js', 'public/js')
    .sass('src/scss/style.scss', 'css')
    .setPublicPath('public');

mix.webpackConfig({
    plugins: [
        new webpack.DefinePlugin({
            'process.env.FILM_SEARCH_API_KEY': JSON.stringify(process.env.FILM_SEARCH_API_KEY),
        }),
    ],
});
