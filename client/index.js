/* global document */
// Needed for stylesheet
import { Climate } from './../components';
import 'wikipedia-react-components/components/TruncatedText/styles.less';
import 'wikipedia-react-components/components/Icon/mediawiki-ui-icon.css';
import './index.less';

// Import helpers
import React from 'react';
import ReactDOM from 'react-dom';
import { router as overlayRouter } from './overlay';
import { showEditOverlay } from './edit.jsx';
import { showNoteOverlay } from './notes.jsx';
import { showSearchOverlay } from './search.jsx';
import { showCollectionOverlay, showCollectionEditor,
	getThumbFromPages,
	getTrips, getTrip, getCoordsFromPages } from './trips.jsx';
import { showMapOverlay, showMapOverlayWithPages } from './maps.jsx';
import offline from './offline';
import { loadCSS } from 'fg-loadcss';

const user = document.body.getAttribute( 'data-user' );
const title = document.querySelector( '.page' ).getAttribute( 'data-title' );

const router = overlayRouter();
// Load the associated stylesheet
loadCSS( '/main.css' );

router.on( '/editor/:title/:id/:hint?', ( options ) => {
	showEditOverlay( null, options.title, options.id, options.hint );
} ).on( '/map/:lat/:lng/:title', ( options ) => {
	showMapOverlay( null, parseFloat( options.lat ), parseFloat( options.lng ), options.title );
} ).on( '/markers/:api', ( options ) => {
	showMapOverlayWithPages( null, options.api, false );
} ).on( '/lines/:api', ( options ) => {
	showMapOverlayWithPages( null, options.api, true );
} ).on( '/search', () => {
	showSearchOverlay( null );
} ).on( '/note/:title', ( options ) => {
	showNoteOverlay( null, options.title );
} ).on( '/trip/add/:title', ( { title } ) => {
	getTrips( title ).then( function ( data ) {
		showCollectionOverlay( null, title, data, () => {
			router.navigate( '/trip/create' );
		} );
	} );
} ).on( '/trip/create', () => {
	showCollectionEditor();
} ).on( '/trip/edit/:owner/:id', ( { owner, id } ) => {
	getTrip( owner, id ).then( ( data ) => {
		const pages = data.pages || [];
		let coords = getCoordsFromPages( pages );
		const thumbnail = data.thumbnail || ( pages.length && getThumbFromPages( pages ) );
		showCollectionEditor( null, data.owner, data.title, data.description, data.id,
			thumbnail, coords.lat, coords.lon
		);
	} );
} );

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
		ev.stopPropagation();
		router.navigate( `/note/${title}` );
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
		const hint = target.getAttribute( 'data-hint' );
		if ( id ) {
			// Otherwise all clicks to open an overlay will trigger the hideOverlay listener above
			ev.stopPropagation();
			router.navigate( `/editor/${title}/${id}/${hint}` );
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
		ev.stopPropagation();
		router.navigate( `/trip/add/${title}` );
	}
);

const search = document.getElementById( 'search' );
if ( search ) {
	search.addEventListener( 'click', function ( ev ) {
		ev.stopPropagation();
		router.navigate( '/search' );
	} );
}

function launchMap( api, withPath, lat = '0', lng = '0' ) {
	if ( api ) {
		const prefix = withPath ? 'lines' : 'markers';
		router.navigate( `/${prefix}/${encodeURIComponent( api )}` );
	} else {
		router.navigate( `/map/${lat}/${lng}/${title}` );
	}
}

function getMapClickHandler() {
	const map = document.getElementById( 'map' );
	const mapWithPath = map.getAttribute( 'data-with-path' );
	const mapApi = map.getAttribute( 'data-api' );
	const lat = map.getAttribute( 'data-lat' );
	const lng = map.getAttribute( 'data-lon' );

	return ( ev ) => {
		ev.stopPropagation();
		launchMap( mapApi, mapWithPath, lat, lng );
	};
}

const map = document.getElementById( 'pagebanner__map-toolbar' );
if ( map ) {
	// render map icon
	ReactDOM.render(
		<button className="map-icon" onClick={getMapClickHandler()}>Launch map</button>,
		map
	);
}
addEventListener( 'h1', 'click', function ( ev ) {
	ev.stopPropagation();
} );

// allow editing of collections
addEventListener( '.action--collection-edit',
	'click',
	function ( ev ) {
		ev.stopPropagation();
		const id = window.location.pathname.split( '/' ).slice( -2 );
		router.navigate( `/trip/edit/${id[ 0 ]}/${id[ 1 ]}` );
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
