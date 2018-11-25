import { DEFAULT_PROJECT } from './config';
import voyager from './endpoints/voyager';
import random from './endpoints/random';
import cachedResponses from './cached-response.js';
import manifest from './manifest';
const cachedResponse = cachedResponses.cachedResponse;
import cached from './cached-response';
import fetch from 'isomorphic-fetch';
import qs from 'query-string';
import { climateExtractionWikipedia, climateToWikiText } from './endpoints/voyager/extract-climate';

function initRoutes( app ) {
	app.get( '/manifest.json', ( req, res ) => {
		res.setHeader( 'Content-Type', 'application/json' );
		res.send( JSON.stringify( manifest ) );
	} );

	app.get( '/api/random/:lang/', ( req, res ) => {
		return cachedResponse( res, req.url, function () {
			var param,
				params = {};
			for ( param in [ 'picontinue', 'continue' ] ) {
				if ( req.query[ param ] ) {
					params[ param ] = req.query[ param ];
				}
			}

			return random( req.params.lang, 0, DEFAULT_PROJECT, params );
		} );
	} );

	app.post( '/api/voyager/invalidate/:url', ( req, res ) => {
		const username = req.user ? req.user.displayName : '';
		const cacheKey = decodeURI( req.params.url ) + ':' + username;
		cached.invalidate( cacheKey ).then( () => {
			res.status( 204 ).send();
		}, ( err ) => {
			res.status( 200 ).send( err );
		} );
	} );

	app.get( '/api/voyager/climate/:title', ( req, res ) => {
		const p = req.params;
		fetch( 'https://en.wikipedia.org/api/rest_v1/page/mobile-sections-remaining/' + encodeURIComponent( p.title ) )
			.then( ( resp ) => resp.json() )
			.then( ( json ) => {
				const climate = json.sections.filter( ( section ) => section.line === 'Climate' );
				if ( climate.length ) {
					const climateData = climateExtractionWikipedia( climate[ 0 ].text );
					if ( climateData.length ) {
						res.setHeader( 'Content-Type', 'text/plain' );
						res.send(
							climateToWikiText(
								climateData,
								p.title
							)
						);
					}
				}
				res.status( 404 );
				res.send( 'Cannot extract a climate table' );
			} );
	} );

	app.get( '/api/voyager/page/:lang.:project/:title/:revision?', ( req, res ) => {
		cachedResponse( res, req.url, function () {
			var p = req.params;
			return voyager.page( p.title, p.lang, p.project, p.revision ).then( ( data ) => {
				const protocol = req.secure ? 'https' : 'http';
				const newPath = '/api/voyager/page/' + p.lang + '.' + p.project + '/' + data.title;
				if ( data.code && [ 301, 302 ].indexOf( data.code ) > -1 ) {
					res.redirect( protocol + '://' + req.headers.host + newPath );
					return false;
				} else {
					return data;
				}
			} ).catch( ( err ) => {
				res.status( 404 );
				res.send( err && err.toString ? err.toString() : err );
			} );
		} );
	} );

	app.get( '/api/voyager/near/:title', ( req, res ) => {
		const title = req.params.title;
		const query = qs.stringify( {
			action: 'query',
			prop: 'coordinates',
			format: 'json',
			formatversion: 2,
			titles: title
		} );
		const host = req.protocol + '://' + req.get( 'host' );
		fetch( `${host}/api/wikimedia/en.wikivoyage.org/api.php?${query}` )
			.then( ( resp ) => resp.json() )
			.then( ( json ) => {
				const page = json.pages[ 0 ];
				if ( page ) {
					const coords = page.coordinates;
					return voyager.nearby( coords.lat, coords.lon, title )
						.then( ( json ) => {
							res.status( 200 );
							res.send(
								JSON.stringify( { pages: json.pages } )
							);
						} );
				} else {
					res.status( 404 );
				}
			} );
	} );

	app.get( '/api/voyager/nearby/:latitude,:longitude/exclude/:title', ( req, res ) => {
		cachedResponse( res, req.url, function () {
			var p = req.params;
			return voyager.nearby( p.latitude, p.longitude, p.title );
		} );
	} );
}

export default initRoutes;
