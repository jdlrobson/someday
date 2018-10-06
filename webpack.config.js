/* global process, __dirname */
const offlineVersion = process.env.OFFLINE_VERSION;
const WORDMARK = process.env.SITE_WORDMARK_PATH;
const NODE_ENV = process.env.NODE_ENV;
const OFFLINE_STRATEGY = process.env.OFFLINE_STRATEGY || 'none';
const API_PATH = process.env.API_PATH || '/api/';

var webpack = require( 'webpack' );
var ExtractTextPlugin = require( 'extract-text-webpack-plugin' );

module.exports = {
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
		new ExtractTextPlugin( { filename: 'style.css', allChunks: true } ),
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
		loaders: [
			{
				test: /\.jsx$/,
				loader: 'babel-loader',
				query: {
					presets: [ 'es2015', 'react' ]
				},
				exclude: /node_modules/
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				query: {
					presets: [ 'es2015' ]
				},
				exclude: /node_modules/
			},
			{
				test: /\.(svg)$/,
				loader: 'svg-url-loader'
			},
			{
				test: /\.(gif|png|jpg)$/,
				loader: 'url-loader',
				query: {
					limit: '25000'
				}
			},
			{ test: /\.css$/, loader: ExtractTextPlugin.extract( { fallback: 'style-loader', use: [ 'css-loader' ] } ) },
			{ test: /\.less$/, loader: ExtractTextPlugin.extract( { fallback: 'style-loader',
				use: [ 'css-loader', 'less-loader' ] } ) }
		]
	}
};
