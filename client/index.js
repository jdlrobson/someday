/* global document */
// Import all the styles:
import 'wikipedia-react-components/dist/styles.css';
// Needed for stylesheet
// eslint-disable-next-line no-unused-vars
import components from './../components';
import './index.less';

// Import helpers
import { showNoteOverlay } from './notes.jsx';
import { showCollectionOverlay, showCollectionEditor,
	getTrips, getTrip } from './trips.jsx';
import { showMapOverlay, showMapOverlayWithPages } from './maps.jsx';

document.documentElement.className += ' client-js';
const title = document.querySelector( '.page' ).getAttribute( 'data-title' );

Array.from( document.querySelectorAll( '.action--add-note' ) ).forEach( ( icon ) => {
	icon.addEventListener( 'click', function ( ev ) {
		showNoteOverlay( ev, title );
	} );
} );

function addEventListener( selector, event, handler ) {
	Array.from( document.querySelectorAll( selector ) ).forEach( ( el ) => {
		el.addEventListener( event, handler );
	} );
}

// image overlay
addEventListener(
	'.component-image-slideshow .arrow-left, .component-image-slideshow .arrow-right',
	'click',
	function () {
		const active = this.closest( '.active' );
		let newActive;
		if ( this.className.indexOf( 'arrow-left' ) > -1 ) {
			// going left
			newActive = active.previousSibling;
			if ( newActive === null ) {
				newActive = active.parentNode.lastElementChild;
			}
		} else {
			// going right
			newActive = active.nextSibling;
			if ( newActive === null ) {
				newActive = active.parentNode.firstChild;
			}
		}
		active.className = active.className.replace( 'active', '' );
		newActive.className += 'active';
	}
);

// set up collections
addEventListener( '.action--add-trip',
	'click',
	function ( ev ) {
		getTrips( title ).then( function ( data ) {
			showCollectionOverlay( ev, title, data );
		} );
	}
);

// banner
addEventListener( '#map', 'click', function ( ev ) {
	const api = this.getAttribute( 'data-api' );
	if ( api ) {
		showMapOverlayWithPages( ev, api );
	} else {
		showMapOverlay( ev, this.getAttribute( 'data-lat' ),
			this.getAttribute( 'data-lon' ),
			title
		);
	}
} );

// allow editing of collections
addEventListener( '.action--collection-edit',
	'click',
	function ( ev ) {
		const id = window.location.pathname.split( '/' ).slice( -2 );
		getTrip( id[ 0 ], id[ 1 ] ).then( function ( data ) {
			const coords = data.coordinates || {};
			const thumbnail = data.thumbnail || {};
			showCollectionEditor( ev, data.title, data.description, data.id,
				thumbnail, coords.lat, coords.lon
			);
		} );
	}
);
