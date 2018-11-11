import nearby from './nearby';
import cleanupUnwantedData from './cleanupUnwantedData';

export default function addNearbyPlacesIfMissing( data ) {
	const lead = data.lead;
	const coords = lead.coordinates;
	const title = lead.title;
	const dest = lead.destinations || [];
	if ( coords && dest.length === 0 ) {
		return nearby( coords.lat, coords.lon, title ).then( ( nearbyPages ) => {
			lead.destinations = [ {
				id: data.lead.section_ids.destinations,
				line: 'Nearby',
				destinations: nearbyPages.pages
			} ];
			return cleanupUnwantedData( data );
		} );
	} else {
		return cleanupUnwantedData( data );
	}
}
