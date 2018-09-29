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

// allow editing of collections
document.querySelectorAll( '.action--collection-edit' ).forEach( ( icon ) => {
	icon.addEventListener( 'click', function ( ev ) {
		const id = window.location.pathname.split( '/' ).slice( -2 );
		getTrip( id[ 0 ], id[ 1 ] ).then( function ( data ) {
			showCollectionEditor( ev, data.title, data.description, data.id );
		} );
	} );
} );
