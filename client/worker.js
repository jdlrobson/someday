/* global workbox, importScripts */
import routes from './../pages/routes';
import pathToRegexp from 'path-to-regexp';

importScripts( 'https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js' );

workbox.routing.registerRoute(
	/\.(?:js|css|jpg|png)$/,
	workbox.strategies.staleWhileRevalidate()
);

[
	routes.HOME,
	routes.TRIP,
	routes.TRIPS_BY_OWNER,
	routes.DESTINATION,
	routes.SIGHT
].forEach( ( path ) => {
	const re = pathToRegexp( path, [], { start: false } );

	workbox.routing.registerRoute(
		re,
		workbox.strategies.staleWhileRevalidate( {
			fetchOptions: {
				credentials: 'include',
			}
		} )
	);
} );
