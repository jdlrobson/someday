import { extractElements } from './domino-utils';

export default function extractMaps( section ) {
	var map;
	var ext = extractElements( section.text, '.mw-kartographer-map' );
	if ( ext.extracted[ 0 ] ) {
		map = ext.extracted[ 0 ];
		section.text = ext.html;
		section.map = {
			lat: map.getAttribute( 'data-lat' ),
			lon: map.getAttribute( 'data-lon' ),
			overlays: map.getAttribute( 'data-overlays' )
		};
	}

	return section;
}
