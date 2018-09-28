/* global __dirname */
import NodeCache from 'node-cache';

import respond from './respond.js';
import fs from 'fs';

const TTL = 60 * 60 * 500; // 500hrs

const shortLifeCache = new NodeCache( { stdTTL: TTL,
	checkperiod: TTL } );

let blacklist = [];

const OFFLINE_MODE = false;
const OFFLINE_MODE_SAVE_TO_FILE = true;

function cachedResponse( res, cacheKey, method, contentType = 'application/json' ) {
	if ( cacheKey && cacheKey.substr( -1 ) === '?' ) {
		cacheKey = cacheKey.substr( 0, cacheKey.length - 1 );
	}
	res.setHeader( 'Content-Type', contentType );
	if ( !cacheKey || blacklist.indexOf( cacheKey ) > -1 ) {
		// no caching requested
		respond( res, method );
	} else {
		shortLifeCache.get( cacheKey, function ( err, responseText ) {
			const filepath = `${__dirname}/__cache${cacheKey}.txt`;
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
			if ( err || !responseText ) {
				// const html = fs.readFileSync(`${__dirname}/__cache${cacheKey}.txt`);
				respond( res, method ).then( function ( newResponseText ) {
					shortLifeCache.set( cacheKey, newResponseText );
					if ( OFFLINE_MODE_SAVE_TO_FILE ) {
						fs.writeFile( filepath, newResponseText, 'utf-8', function () {} );
					}
				} );
			} else {
				res.status( 200 );
				res.send( responseText );
			}
		} );
	}
}

function invalidate( url ) {
	shortLifeCache.get( url, function ( err, responseText ) {
		if ( responseText ) {
			blacklist.push( url );
			shortLifeCache.del( url );
			// give 1s for cache to warm up
			setTimeout( function () {
				var i = blacklist.indexOf( url );
				if ( i > -1 ) {
					blacklist.splice( i, 1 );
				}
			}, 1000 );
		} else {
			console.log( 'failed to invalidate', url );
		}
	} );
}
export default {
	cachedResponse: cachedResponse,
	invalidate: invalidate
};
