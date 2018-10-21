import addProps from './../prop-enricher';

export default function addNextCards( data, lang, project, pages, isRegion ) {
	var props = [ 'pageimages', 'pageterms' ];
	if ( !isRegion ) {
		props.push( 'coordinates' );
	}
	return addProps( pages, props,
		lang, project,
		{ codistancefrompage: data.lead.normalizedtitle || data.lead.displaytitle }
	).then( function () {
		var destinations = [];
		data.remaining.sections.forEach( function ( section ) {
			if ( section.destinations && section.destinations.length ) {
				destinations.push( Object.assign( {}, section ) );
			}
			delete section.destinations;
		} );
		data.lead.destinations = destinations;
		return data;
	} );
}
