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

export function showOverlay( overlay ) {
	body.className = '--overlay-enabled';
	render( overlay, overlayArea );
}
