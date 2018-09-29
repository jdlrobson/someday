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

const title = document.querySelector( '.page' ).getAttribute( 'data-title' );

Array.from( document.querySelectorAll( '.action--add-note' ) ).forEach( ( icon ) => {
	icon.addEventListener( 'click', function ( ev ) {
		showNoteOverlay( ev, title );
	} );
} );

// set up collections
Array.from( document.querySelectorAll( '.action--add-trip' ) ).forEach( ( icon ) => {
	icon.addEventListener( 'click', function ( ev ) {
		getTrips( title ).then( function ( data ) {
			showCollectionOverlay( ev, title, data );
		} );
	} );
} );

// banner
const map = document.querySelector( '#map' );
map.addEventListener( 'click', function ( ev ) {
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
document.querySelectorAll( '.action--collection-edit' ).forEach( ( icon ) => {
	icon.addEventListener( 'click', function ( ev ) {
		const id = window.location.pathname.split( '/' ).slice( -2 );
		getTrip( id[ 0 ], id[ 1 ] ).then( function ( data ) {
			const coords = data.coordinates || {};
			const thumbnail = data.thumbnail || {};
			showCollectionEditor( ev, data.title, data.description, data.id,
				thumbnail, coords.lat, coords.lon
			);
		} );
	} );
} );
