/* global document */
// Import all the styles:
import 'wikipedia-react-components/dist/styles.css';
// Needed for stylesheet
// eslint-disable-next-line no-unused-vars
import components from './../components';
import './index.less';

// Import helpers
import { showNoteOverlay } from './notes.jsx';

const title = document.querySelector( '.page' ).getAttribute( 'data-title' );

Array.from( document.querySelectorAll( '.action--add-note' ) ).forEach( ( icon ) => {
	icon.addEventListener( 'click', function ( ev ) {
		showNoteOverlay( ev, title );
	} );
} );
