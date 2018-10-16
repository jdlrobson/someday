import React from 'react';
import ReactDOMServer from 'react-dom/server';
import fetch from 'isomorphic-fetch';
import { compile } from 'path-to-regexp';
import cached from './cached-response';
import pages from './../pages';

function addRoute( app, route, View, apiTemplate, extractMeta ) {
	app.get( route, ( req, res ) => {
		const host = req.protocol + '://' + req.get( 'host' );
		const api = compile( apiTemplate )( req.params );
		const dataUrl = `${host}${api}`;
		const cacheKey = req.url;
		cached.fetchText( cacheKey ).then( function ( html ) {
			res.status( 200 ).send( html ).end();
		}, function () {
			fetch( dataUrl ).then( ( resp ) => {
				if ( resp.status === 404 ) {
					res.status( 404 )
						.render( '404.html' );
					return;
				}
				return resp.json().then( ( props ) => {
					let meta = {
						dataUrl,
						params: req.params,
						username: req.user ? req.user.displayName : '',
						image: `${host}/home-icon.png`,
						description: 'the pocket travel guide that follows you wherever you are in the world',
						page_title: 'Someday'
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
						res.status( 500 ).render( '500.html', { view: err } );
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