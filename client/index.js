/* global document */
// Import all the styles:
import 'wikipedia-react-components/dist/styles.css';
// Needed for stylesheet
// eslint-disable-next-line no-unused-vars
import components, { Climate } from './../components';
import './index.less';

// Import helpers
import React from 'react';
import ReactDOM from 'react-dom';
import { showEditOverlay } from './edit.jsx';
import { showNoteOverlay } from './notes.jsx';
import { showSearchOverlay } from './search.jsx';
import { showCollectionOverlay, showCollectionEditor,
	getTrips, getTrip, getCoordsFromPages } from './trips.jsx';
import { showMapOverlay, showMapOverlayWithPages } from './maps.jsx';
import offline from './offline';

const user = document.body.getAttribute( 'data-user' );
const title = document.querySelector( '.page' ).getAttribute( 'data-title' );
let bodyClasses = user ? ' client-js client-auth' : ' client-js';
if ( !navigator.onLine ) {
	bodyClasses += ' client-no-connection';
}
document.documentElement.className += bodyClasses;

function getNodes( selector ) {
	return Array.from( document.querySelectorAll( selector ) );
}

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

// edit icons
addEventListener(
	'.edit-link',
	'click',
	function ( ev ) {
		const target = ev.target;
		const id = target.getAttribute( 'data-id' );
		if ( id ) {
			showEditOverlay( ev, title, id );
		} else {
			target.setAttribute( 'disabled' );
		}
	}
);

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

document.getElementById( 'search' ).addEventListener( 'click', function ( ev ) {
	showSearchOverlay( ev );
} );

// banner
addEventListener( '#map', 'click', function ( ev ) {
	const api = this.getAttribute( 'data-api' );
	const withPath = this.getAttribute( 'data-with-path' );
	if ( api ) {
		showMapOverlayWithPages( ev, api, withPath );
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
			let coords = getCoordsFromPages( data.pages );
			const thumbnail = data.thumbnail || {};
			showCollectionEditor( ev, data.title, data.description, data.id,
				thumbnail, coords.lat, coords.lon
			);
		} );
	}
);

// hydrate certain components
// Crazy right?! Why do I need to progressively enhance all the others.
getNodes( '.hydratable' ).forEach( ( node ) => {
	const newChild = document.createElement( 'div' );
	const componentName = node.getAttribute( 'data-component' );
	const dataStr = node.getAttribute( 'data-props' );
	const props = dataStr ? JSON.parse( dataStr ) : {};
	let component;
	switch ( componentName ) {
		case 'climate':
			component = Climate;
			break;
		default:
			break;
	}
	if ( component ) {
		ReactDOM.render(
			React.createElement( Climate, props ),
			newChild
		);
		node.parentNode.replaceChild( newChild, node );
	}
} );

// register sw
offline( '/sw-bundle.js', function () {
	document.documentElement.className += ' client-offline';
} );
