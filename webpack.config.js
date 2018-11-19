/* global process, __dirname */
const offlineVersion = process.env.OFFLINE_VERSION;
const WORDMARK = process.env.SITE_WORDMARK_PATH;
const NODE_ENV = process.env.NODE_ENV;
const OFFLINE_STRATEGY = process.env.OFFLINE_STRATEGY || 'none';
const API_PATH = process.env.API_PATH || '/api/';
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const OptimizeCSSAssetsPlugin = require( 'optimize-css-assets-webpack-plugin' );
var webpack = require( 'webpack' );
const UglifyJsPlugin = require( 'uglifyjs-webpack-plugin' );

module.exports = {
	mode: NODE_ENV || 'development',
	optimization: {
		minimizer: [
			new UglifyJsPlugin( {
				cache: true,
				parallel: true,
				sourceMap: true // set to true if you want JS source maps
			} ),
			new OptimizeCSSAssetsPlugin( { } )
		]
	},
	entry: {
		sw: './client/worker.js',
		main: './client/index.js'
	},
	output: {
		path: __dirname + '/public/',
		filename: '[name]-bundle.js',
		publicPath: '/'
	},
	plugins: [
		new MiniCssExtractPlugin( {
			filename: 'style.css'
		} ),
		new webpack.DefinePlugin( {
			'process.env': {
				OFFLINE_STRATEGY: `"${OFFLINE_STRATEGY}"`,
				API_PATH: `"${API_PATH}"`,
				NODE_ENV: `"${NODE_ENV}"`
			},
			'global.__VERSION__': JSON.stringify( {
				number: offlineVersion,
				wordmark: WORDMARK
			} )
		} )
	],
	resolve: {
		extensions: [ 'index.js', '.js', '.jsx' ]
	},
	module: {
		rules: [
			{
				test: /\.jsx$/,
				exclude: /node_modules/,
				use: [ {
					loader: 'babel-loader',
					query: {
						presets: [ 'es2015', 'react' ]
					}
				} ]
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [ {
					loader: 'babel-loader',
					query: {
						presets: [ 'es2015' ]
					}
				} ]
			},
			{
				test: /\.(svg)$/,
				use: 'svg-url-loader'
			},
			{
				test: /\.(gif|png|jpg)$/,
				use: [
					{
						loader: 'url-loader',
						query: {
							limit: '25000'
						}
					}
				]
			},
			{
				test: /\.(le|c)ss$/,
				use: [
					NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
					'css-loader',
					'less-loader'
				]
			}
		]
	}
};
