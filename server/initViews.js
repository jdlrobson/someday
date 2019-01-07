import React from 'react';
import ReactDOMServer from 'react-dom/server';
import fetch from 'isomorphic-fetch';
import { compile } from 'path-to-regexp';
import cached from './cached-response';
import pages from './../pages';
import FourOhFour from './../pages/404';
import FiveOhhhhhhhOhhh from './../pages/500';

function handle404( res, dataUrl ) {
	res.status( 404 )
		.render( 'index.html', {
			page_title: '404',
			dataUrl,
			view: ReactDOMServer.renderToString(
				React.createElement( FourOhFour )
			)
		} );
}
function addRoute( app, route, View, apiTemplate, extractMeta ) {
	// redirects %20 to _ (standard for wikipedia titles)
	app.use( function ( req, res, next ) {
		if ( req.url.indexOf( '%20' ) > -1 ) {
			let newUrl = req.url.replace( /%20/g, '_' );
			res.redirect( 301, newUrl );
		} else {
			next();
		}
	} );
	app.get( route, ( req, res ) => {
		const host = req.protocol + '://' + req.get( 'host' );
		const api = compile( apiTemplate )( req.params );
		const dataUrl = `${host}${api}`;
		const username = req.user ? req.user.displayName : '';
		const cacheKey = req.url + ':' + username;
		cached.fetchText( cacheKey, true ).then( function ( html ) {
			res.status( 200 ).send( html ).end();
		}, function () {
			fetch( dataUrl ).then( ( resp ) => {
				let json;
				if ( resp.status === 404 ) {
					return resp.text().then( ( b ) => {
						var { code, title } = JSON.parse(
							b.replace( 'Error: ', '' )
						);
						// Handle redirects
						// https://github.com/jdlrobson/someday/issues/1
						if ( code === 302 ) {
							res.redirect( 302, `/destination/${title[ 0 ]}` );
						} else {
							handle404( res, dataUrl );
						}
					} ).catch( ( e ) => {
						handle404( res, dataUrl );
					} );
				}
				if ( resp.headers.get( 'content-type' ).indexOf( 'text/plain' ) > -1 ) {
					json = resp.text().then( ( text ) => ( { text } ) );
				} else {
					json = resp.json();
				}
				return json.then( ( props ) => {
					const lead = props.lead || {};
					const images = lead.images || [];
					const image = images.filter( ( image ) => {
						return !image.isBanner;
					} )[ 0 ];
					let meta = {
						dataUrl,
						params: req.params,
						username: req.user ? req.user.displayName : '',
						image: image ? image.src : `${host}/home-icon.png`,
						url: `${host}${req.url}`,
						description: ( props.lead && props.lead.paragraph_text ) || 'the pocket travel guide that follows you wherever you are in the world',
						page_title: req.params.title ? req.params.title.replace( /_/g, ' ' ) :
							'Someday'
					};
					const element = React.createElement( View,
						Object.assign( {}, props, { meta: meta } ),
						[]
					);
					const view = ReactDOMServer.renderToString( element );
					if ( extractMeta ) {
						meta = extractMeta( meta );
					}
					app.render(
						'index.html',
						Object.assign( {}, meta, { view, params: req.params } ),
						function ( err, html ) {
							// store it in cache for quick lookup next time
							cached.putText( cacheKey, html );
							res.status( 200 ).send( html ).end();
						}
					);
				} )
					.catch( ( err ) => {
						console.log( err, err.stack );
						res.status( 500 )
							.render( 'index.html', {
								page_title: '500',
								dataUrl,
								view: ReactDOMServer.renderToString(
									React.createElement( FiveOhhhhhhhOhhh )
								)
							} );
					} );
			} );
		} );
	} );
}

export default function ( app ) {
	pages.forEach( ( [ route, View, apiTemplate, extractMeta ] ) => {
		addRoute( app, route, View, apiTemplate, extractMeta );
	} );
}
