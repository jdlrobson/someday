import React from 'react';
import { showOverlay } from './overlay';
import { Overlay } from 'wikipedia-react-components';
import fetch from 'isomorphic-fetch';
import WorldMap from './WorldMap';

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
	fetch( `/api/voyager/nearby/en.wikivoyage/${lat},${lon}/exclude/_` )
		.then( ( resp )=>resp.json() )
		.then( ( data ) => {
			addMarkers( pagesWithLinks( data.pages ) );
		} );
}

export function showMapOverlayWithPages( ev, api ) {
	fetch( api ).then( ( resp )=>resp.json() )
		.then( ( data ) => {
			const pages = data.pages ? pagesWithLinks( data.pages ) :
				collectionsWithLinks( data.collections );

			showOverlay( ev, (
				<Overlay>
					<WorldMap
						pages={pages}
						markerUrl='/images/marker-icon.png'
						onExplore={onExplore}
					/>
				</Overlay>
			) );
		} );
}
export function showMapOverlay( ev, lat, lon, title ) {
	showOverlay( ev, (
		<Overlay>
			<WorldMap lat={lat} lon={lon} zoom={10} title={title}
				markerUrl='/images/marker-icon.png'
				onExplore={onExplore}
			/>
		</Overlay>
	) );
}
