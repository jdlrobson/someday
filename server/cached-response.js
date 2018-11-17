/* global __dirname */
import NodeCache from 'node-cache';

import respond from './respond.js';
import fs from 'fs';

const TTL = 60 * 60 * 1; // 1hr

const shortLifeCache = new NodeCache( { stdTTL: TTL,
	checkperiod: TTL } );

const CACHE_WAIT_TIME = 1000;
// When a page is invalidated, it appears in this list
// and will not be cached again until 1s has passed
let blacklist = [];

const OFFLINE_MODE = false;
const OFFLINE_MODE_SAVE_TO_FILE = true;

function fetchText( cacheKey ) {
	return new Promise( ( resolve, reject ) => {
		shortLifeCache.get( cacheKey, function ( err, responseText ) {
			if ( err || !responseText ) {
				reject();
			} else {
				resolve( responseText );
			}
		} );
	} );
}

function putText( cacheKey, text ) {
	shortLifeCache.set( cacheKey, text );
}

function cachedResponse( res, cacheKey, method, contentType = 'application/json' ) {
	if ( cacheKey && cacheKey.substr( -1 ) === '?' ) {
		cacheKey = cacheKey.substr( 0, cacheKey.length - 1 );
	}
	res.setHeader( 'Content-Type', contentType );
	if ( !cacheKey || blacklist.indexOf( cacheKey ) > -1 ) {
		// no caching requested
		respond( res, method );
	} else {
		const filepath = `${__dirname}/__cache${cacheKey}.txt`;
		fetchText( cacheKey ).then( function ( responseText ) {
			if ( OFFLINE_MODE ) {
				try {
					const filecontents = fs.readFileSync( filepath, 'utf-8' ).toString();
					res.status( 200 );
					res.setHeader( 'Content-Type', 'application/json' );
					res.send( filecontents );
					return;
				} catch ( e ) {
					// continue..
					console.log( e );
				}
			}
			res.status( 200 );
			res.send( `${responseText}<!-- CACHEKEY: ${cacheKey} -->` );
		}, function () {
			respond( res, method ).then( function ( newResponseText ) {
				putText( cacheKey, newResponseText );
				if ( OFFLINE_MODE_SAVE_TO_FILE ) {
					fs.writeFile( filepath, newResponseText, 'utf-8', function () {} );
				}
			} );
		} );
	}
}

function invalidate( url ) {
	return new Promise( ( resolve, reject ) => {
		const keys = [
			url,
			// global key (not user specific)
			url.split( ':' )[ 0 ]
		];
		shortLifeCache.mget( keys, function ( err, responseText ) {
			if ( responseText ) {
				blacklist.push( url );
				keys.forEach( ( url ) => {
					shortLifeCache.del( url );
				} );
				// give 1s for cache to warm up
				setTimeout( function () {
					var i = blacklist.indexOf( url );
					if ( i > -1 ) {
						blacklist.splice( i, 1 );
					}
					resolve();
				}, CACHE_WAIT_TIME );
			} else {
				reject( `failed to invalidate ${url}` );
			}
		} );
	} );
}
export default {
	putText,
	fetchText,
	cachedResponse: cachedResponse,
	invalidate: invalidate
};
