import session from 'express-session';
import sessionStore from 'memorystore'
import { OAuthStrategy } from 'passport-mediawiki-oauth';
import passport from 'passport';
import respond from './respond';
const MemoryStore = sessionStore( session );

import {
	CONSUMER_HOST,
	CONSUMER_KEY,
	CONSUMER_SECRET
} from './config';

export default function ( app ) {
	console.log( `Registering oauth with ${CONSUMER_KEY}, ${CONSUMER_SECRET}, ${CONSUMER_HOST}` );

	passport.serializeUser( function ( user, done ) {
		done( null, user );
	} );

	passport.deserializeUser( function ( obj, done ) {
		done( null, obj );
	} );

	app.use( session( {
		resave: false,
		saveUninitialized: true,
		cookie: {
			maxAge: 1000 * 60 * 60 * 24 * 30
		},
		store: new MemoryStore( {
			checkPeriod: 1000 * 60 * 60 * 4
		} ),
		secret: CONSUMER_SECRET
	} ) );
	app.use( passport.initialize() );
	app.use( passport.session() );
	passport.use(
		new OAuthStrategy( {
			baseURL: CONSUMER_HOST,
			consumerKey: CONSUMER_KEY,
			consumerSecret: CONSUMER_SECRET
		},
		function ( token, tokenSecret, profile, done ) {
			// [ADDED] Twitter extended API calls using 'request' and 'querystring'
			profile.oauth = {
				consumer_key: CONSUMER_KEY,
				consumer_secret: CONSUMER_SECRET,
				token: token,
				token_secret: tokenSecret
			};
			return done( null, profile );
		} )
	);

	function getUserSession( req ) {
		return req.user && req.user.displayName !== '0' ? {
			username: req.user.displayName
		} : null;
	}

	app.get( '/auth/whoamithistime', function ( req, res ) {
		var user = getUserSession( req );
		respond( res, function () {
			return new Promise( function ( resolve ) {
				if ( user ) {
					resolve( user );
				} else {
					throw new Error( 'Not logged in' );
				}
			} );
		} );
	} );

	app.get( '/auth/logout', function ( req, res ) {
		if ( req.isAuthenticated() ) {
			req.logout();
		}
		res.redirect( '/' );
	} );

	function authCallback( req, res ) {
		// Successful authentication, do redirect.
		res.redirect( req.session.returnto || '/' );
		delete req.session.returnTo;
	}

	app.get( '/auth/mediawiki',
		function ( req, res, next ) {
			if ( !req.isAuthenticated() && !req.query.oauth_verifier ) {
				if ( req.query.returnto && req.query.project ) {
					req.session.returnto = '/' + req.query.project + '/' + req.query.returnto;
				} else {
					req.session.returnto = req.get( 'Referrer' );
				}
			}
			next();
		}, passport.authenticate( 'mediawiki' ) );

	// The default auth callback if configured in MediaWiki as '/'
	// This one only works if the user has logged in already
	app.get( '/auth/mediawiki',
		function ( req, res ) {
			authCallback( req, res );
		} );

	app.get( '/auth/mediawiki/callback',
		passport.authenticate( 'mediawiki', { failureRedirect: '/login' } ), authCallback );
}
