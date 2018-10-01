/* global document */
import { render } from 'react-dom';

const overlayArea = document.createElement( 'div' );
overlayArea.setAttribute( 'id', 'overlay' );
const body = document.body;
body.appendChild( overlayArea );

export function hideOverlay() {
	body.className = '';
	render( null, overlayArea );
}

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

export function showOverlay( ev, overlay ) {
	// Otherwise all clicks to open an overlay will trigger the hideOverlay listener above
	ev.stopPropagation();
	body.className = '--overlay-enabled';
	render( overlay, overlayArea );
}
