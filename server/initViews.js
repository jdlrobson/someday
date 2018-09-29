import React from 'react';
import ReactDOMServer from 'react-dom/server';
import fetch from 'isomorphic-fetch';
import { compile } from 'path-to-regexp';
import pages from './../pages';

export default function ( app ) {
	pages.forEach( ( [ route, View, apiTemplate, extractMeta ] ) => {
		app.get( route, ( req, res ) => {
			const host = req.protocol + '://' + req.get( 'host' );
			const api = compile( apiTemplate )( req.params );
			const dataUrl = `${host}${api}`;
			fetch( dataUrl ).then( ( res ) => res.json() )
				.then(
					( props ) => {
						let meta = {
							dataUrl,
							username: req.user ? req.user.displayName : false,
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
						res.status( 200 ).render( 'index.html', Object.assign( {}, meta, { view,
							params: req.params } ) );
					}
				)
				.catch( ( err ) => {
					res.status( 500 ).render( '500.html', { view: err } );
				} );
		} );
	} );

}
