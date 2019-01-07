import addProps from './../prop-enricher';

export default function addNextCards( data, lang, project, pages, isRegion ) {
	var props = [ 'pageimages', 'pageterms' ];
	if ( !isRegion ) {
		props.push( 'coordinates' );
	}
	return addProps( pages, props,
		lang, project,
		{ codistancefrompage: data.lead.title || data.lead.displaytitle }
	).then( function ( pages ) {
		// create an index of all the pages
		const index = {};
		pages.forEach( ( page ) => {
			index[ page.title ] = page;
			// https://github.com/jdlrobson/someday/issues/33
			if ( page.redirects ) {
				page.redirects.forEach( ( title ) => {
					index[ title ] = page;
				} );
			}
		} );
		var destinations = [];
		data.remaining.sections.forEach( function ( section ) {
			if ( section.destinations && section.destinations.length ) {
				const newSection = Object.assign( {}, section );
				newSection.destinations = newSection.destinations.map(
					( destination ) =>
						Object.assign( {}, index[ destination.title ], destination )
				);
				destinations.push( newSection );
			}
			delete section.destinations;
		} );

		data.lead.destinations = destinations;
		return data;
	} );
}
