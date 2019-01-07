import addProps from './../prop-enricher';
import calculateDistance from './calculate-distance';

function sightObjToCanoicalTitle( sightObj ) {
	return sightObj.name.replace( /_/g, ' ' );
}
export function getAliases( sights, country ) {
	const aliases = {};
	const sightTitles = sights.map( sightObjToCanoicalTitle );
	sightTitles.forEach( ( sight ) => {
		const segments = sight.split( / - / );
		const theLessSight = sight.replace( /[Tt]he /, '' );

		// e.g. The Eastern States Exposition - "The Big E"
		// on Springfield%20(Massachusetts)
		if ( segments.length === 2 && sights < 50 ) {
			aliases[ segments[ 0 ] ] = sight;
			aliases[ segments[ 1 ] ] = sight;
		}
		aliases[ `${sight}, ${country}` ] = sight;
		aliases[ `${sight} (${country})` ] = sight;
		if ( sight.indexOf( '(' ) > -1 ) {
			aliases[ sight.replace( /\(.*\)/, '' ).trim() ] = sight;
		}
		if ( theLessSight !== sight ) {
			aliases[ theLessSight ] = sight;
		}
	} );
	return aliases;
}

/**
 * @param {Object} data
 * @param {Integer} distance in km to filter by
 * @return {Object}
 */
function addSights( data, distance ) {
	var props = [ 'pageimages', 'pageterms', 'pageprops', 'coordinates' ];
	var landmark = data.lead.coordinates;
	if ( data.lead.sights && landmark ) {
		const lookup = {};
		const origSights = data.lead.sights;
		origSights.forEach( ( sight ) => {
			lookup[ sight.name ] = sight;
		} );
		const isExternal = ( sight ) => {
			return sight.external &&
				// https://github.com/jdlrobson/someday/issues/38
				( sight.name || sight.title );
		};
		const externalSights = origSights.filter( isExternal );

		let sights = data.lead.sights.filter( ( s ) => !isExternal( s ) );
		const aliases = getAliases(
			sights,
			data.lead.displaytitle
		);
		let sightTitles = sights.map( sightObjToCanoicalTitle ).concat( Object.keys( aliases ) );
		// dedupe
		const matches = {};
		sightTitles = sightTitles.filter( function ( item ) {
			const key = item.toLowerCase();
			const matched = matches[ key ];
			matches[ key ] = true;
			return !matched;
		} );

		return addProps( sightTitles, props, 'en', 'wikipedia', {
			ppprop: 'disambiguation'
		} )
			.then( ( sightPages ) => {
				const sightWarnings = {};

				data.lead.sights = sightPages.filter(
					( page ) => {
						const distFromLandmark = page.coordinates && calculateDistance( page.coordinates, landmark );
						const originalSight = aliases[ page.title ] || page.title;
						let warnings = sightWarnings[ originalSight ];
						var isDisambiguation = page.pageprops && page.pageprops.disambiguation !== undefined;
						if ( warnings === undefined ) {
							warnings = [];
						}

						if ( page.missing && warnings ) {
							warnings.push( `sight ${page.title} is missing` );
						} else if ( !distFromLandmark && warnings ) {
							warnings.push( `sight ${page.title} is missing coordinates` );
						} else if ( distFromLandmark > distance && warnings ) {
							warnings.push( `sight ${page.title} is ${distFromLandmark} away` );
						} else if ( isDisambiguation && warnings ) {
							warnings.push( `sight ${page.title} needs disambiguating` );
						} else {
							warnings = false;
						}
						sightWarnings[ originalSight ] = warnings;
						return !page.missing && !isDisambiguation && (
							( page.coordinates &&
							// possibily too generous.. but check how many km away the sight is
							distFromLandmark < distance ) ||
							// except wikipedia links. we can trust those.
							lookup[ page.title ] && lookup[ page.title ].trusted
						);
					}
				).map( ( page ) => {
					const item = lookup[ page.title ];
					if ( item && item.description ) {
						page.description = item.description;
					}
					return page;
				} ).concat( externalSights );
				// filter all the sights which we found something for
				data.warnings = Object.keys( sightWarnings ).filter( ( key ) => {
					return sightWarnings[ key ];
				} ).map( ( key ) => {
					return sightWarnings[ key ];
				} );
				return data;
			} );
	} else {
		return data;
	}
}

export default addSights;
