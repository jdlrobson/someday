import React from 'react';
import { showOverlay, hideOverlay } from './overlay';
import { Overlay } from 'wikipedia-react-components';
import fetch from 'isomorphic-fetch';
import WorldMap from './WorldMap';
import './maps.less';

function pagesWithLinks( pages ) {
	return pages.map( ( page ) =>
		Object.assign( {}, page, { url: `/destination/${page.title}` } )
	);
}

function collectionsWithLinks( collections ) {
	return collections.map( ( collection ) =>
		Object.assign( {}, collection,
			{ url: `/trips/${collection.owner}/${collection.id}` }
		)
	);
}

function onExplore( lat, lon, addMarkers ) {
	fetch( `/api/voyager/nearby/${lat},${lon}/exclude/_` )
		.then( ( resp )=>resp.json() )
		.then( ( data ) => {
			addMarkers( pagesWithLinks( data.pages ) );
		} );
}

export function showMapOverlayWithPages( ev, api, withPath ) {
	fetch( api ).then( ( resp )=>resp.json() )
		.then( ( data ) => {
			const pages = data.pages ? pagesWithLinks( data.pages ) :
				collectionsWithLinks( data.collections );

			showOverlay( ev, (
				<Overlay className="overlay--map">
					<WorldMap
						pages={pages}
						explorable={!withPath}
						markerUrl='/images/marker-icon.png'
						onExplore={onExplore}
					/>
					<a className='hide' onClick={hideOverlay}>hide map</a>
				</Overlay>
			) );
		} );
}
export function showMapOverlay( ev, lat, lon, title ) {
	showOverlay( ev, (
		<Overlay className="overlay--map">
			<WorldMap lat={lat} lon={lon} zoom={10} title={title}
				markerUrl='/images/marker-icon.png'
				onExplore={onExplore}
			/>
			<a className='hide' onClick={hideOverlay}>hide map</a>
		</Overlay>
	) );
}
