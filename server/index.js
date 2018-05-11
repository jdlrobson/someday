/* global __dirname */
require( 'babel-core/register' );

import express from 'express';
import hogan from 'hogan-express';
import bodyParser from 'body-parser';

import initAuth from './express-auth';
import initApiRoutes from './express-api-routes';
import initVoyagerRoutes from './express-voyager-routes';
import initViews from './initViews';
import initApiProxy from 'express-wikimedia-api-proxy';

import { USE_HTTPS, APP_PORT, SIGN_IN_SUPPORTED } from './config';

// Express
const app = express();
app.use( '/', express.static( __dirname + '/../public/' ) );
app.use( bodyParser.json() ); // support json encoded bodies
app.use( bodyParser.urlencoded( {     // to support URL-encoded bodies
	extended: true
} ) );

app.set( 'port', ( APP_PORT ) );
app.engine( 'html', hogan );
app.set( 'views', __dirname + '/views' );

if ( USE_HTTPS ) {
	app.enable( 'trust proxy' );
	app.use( function ( req, res, next ) {
		if ( USE_HTTPS && !req.secure ) {
			res.redirect( 'https://' + req.headers.host + req.url );
		} else {
			next();
		}
	} );
}

// Setup
initViews( app );
initApiProxy( app, '/api/' );
initVoyagerRoutes( app );

app.listen( app.get( 'port' ) );
console.info( '==> Go to http://localhost:%s', app.get( 'port' ) );
