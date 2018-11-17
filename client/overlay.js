/* global document */
import { render } from 'react-dom';
import Navigo from 'navigo';
const ROUTE_PREFIX = '#!';
import ReactDOM from 'react-dom';

const overlayArea = document.createElement( 'div' );
overlayArea.setAttribute( 'id', 'overlay' );
const body = document.body;
const navigoRouter = new Navigo( '/', true, ROUTE_PREFIX );

body.appendChild( overlayArea );

export function router() {
	window.location.hash = `${ROUTE_PREFIX}/`;
	return navigoRouter;
}

export function destroyOverlay() {
	body.className = '';
	ReactDOM.unmountComponentAtNode( overlayArea );
}

export function hideOverlay() {
	if ( window.location.hash === ROUTE_PREFIX + '/' ) {
		destroyOverlay();
	} else {
		navigoRouter.navigate( '/' );
	}
}

navigoRouter.on( '/', () => {
	destroyOverlay();
} );

function isOverlayChild( node ) {
	if ( overlayArea === node ) {
		return true;
	} else if ( node.parentNode ) {
		return isOverlayChild( node.parentNode );
	} else {
		return false;
	}
}

body.addEventListener( 'click', function ( ev ) {
	if ( !isOverlayChild( ev.target ) ) {
		hideOverlay();
	}
} );

export function refreshOverlay( overlay ) {
	render( overlay, overlayArea );
}

export function showOverlay( _ev, overlay ) {
	body.className = '--overlay-enabled';
	render( overlay, overlayArea );
}
