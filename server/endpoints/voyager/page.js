import domino from 'domino';

import page from './../page';

import cleanVcards from './clean-vcards';
import extractSightsFromText from './extract-sights-from-text';
import { extractElements, extractText, cleanupEmptyNodes } from './domino-utils';
import extractDestinations from './extract-destinations';
import extractImages from './extract-images';
import climateExtraction from './extract-climate';
import addSights from './add-sights';
import undoLinkFlatten from './undo-link-flatten';
import extractAirports from './extract-airports';
import addImagesFromCommons from './add-images-from-commons';
import {
	SIGHT_HEADINGS, DESTINATION_BLACKLIST,
	EXPLORE_HEADINGS,
	TRANSIT_LINK_HEADINGS,
	COUNTRY_SECTION_HEADINGS,
	ISLAND_SECTION_HEADINGS,
	REGION_SECTION_HEADINGS,
	ITEMS_TO_DELETE,
	SECTION_BLACKLIST
} from './constants';

import flattenLinksInHtml from './flattenLinksInHtml';
import removeNodes from './removeNodes';
import addNearbyPlacesIfMissing from './addNearbyPlacesIfMissing';

import addBannerAndCoords from './add-banner-and-coords';

import addNextCards from './add-next-cards';

import extractWarningsAndInfobox, { extractWarnings } from './extract-warnings-and-infoboxes';

import isSectionEmpty from './isSectionEmpty';

import extractMaps from './extract-maps';

import isEmptySectionArray from './isEmptySectionArray';

import findSectionId from './find-section-id';

function cleanup( section ) {
	section.text = cleanVcards( removeNodes( section.text, ITEMS_TO_DELETE.join( ',' ) ) );
	return section;
}

/**
 * Strips any text in brackets
 * @param {string} str
 * @return {string}
 */
function stripParentheticals( str ) {
	return str.replace( /\([^\)]*\)/g, '' ).trim();
}

/**
 * Does str match one of the strings in test?
 * @param {string} str
 * @param {array} tests
 * @return {boolean}
 */
function matchesOne( str, tests ) {
	const lcStr = str.toLowerCase();
	return tests.filter( ( test ) => lcStr.indexOf( test.toLowerCase() ) > -1 ).length > 0;
}

function voyager( title, lang, project, data ) {
	const warnings = [];
	return addBannerAndCoords( title, lang, project, data ).then( function ( data ) {
		var newSection;
		var isRegion = false;
		var isCountry = false;
		var description = data.lead.description || '';
		var isIsland = matchesOne( description, [
			'island country'
		] );
		var sections = [];
		var isSubPage = data.lead.displaytitle.indexOf( '/' ) > -1;
		var cardSectionTocLevel;
		var blacklist = [];
		var allImages = [];
		var logistics = [];
		var sights = [];
		var allDestinations = [];
		var allMaps = [];
		var curSectionLine;
		var lcCurSectionLine;
		var curSectionSubheadingLine;
		var orientation = [];
		var itineraries = [];
		const transitLinks = [];
		const seen = {};
		const climate = {};
		let airports = [];

		var p = { text: data.lead.paragraph };
		cleanup( p );
		data.lead = Object.assign( {}, data.lead, {
			section_ids: {},
			paragraph: p.text,
			paragraph_text: extractText( p.text )
		} );
		newSection = cleanup( data.lead.sections[ 0 ] );
		newSection = extractImages( newSection );
		newSection = extractMaps( newSection );
		newSection = extractWarningsAndInfobox( newSection );
		allImages = allImages.concat( newSection.images );
		allMaps = allMaps.concat( newSection.maps );
		// promote infobox upwards
		data.lead.warnings = newSection.warnings;
		if ( !data.lead.infobox ) {
			data.lead.infobox = newSection.infobox;
		}
		delete newSection.infobox;
		delete newSection.warnings;
		delete newSection.images;
		delete newSection.maps;

		data.lead.sections[ 0 ].text = cleanupEmptyNodes( data.lead.sections[ 0 ].text );
		data.remaining.sections.forEach( function ( section ) {
			section = extractWarnings( section );
			// reset Go next section
			if ( cardSectionTocLevel !== undefined && section.toclevel <= cardSectionTocLevel ) {
				cardSectionTocLevel = undefined;
			}
			if ( section.toclevel === 1 ) {
				curSectionLine = section.line;
				lcCurSectionLine = curSectionLine.toLowerCase();
				curSectionSubheadingLine = undefined;
			}
			if ( section.toclevel === 2 ) {
				curSectionSubheadingLine = section.line;
			}

			if ( [ 'Itineraries' ].indexOf( section.line ) > -1 ) {
				itineraries = section;
				return;
			}

			var lcLine = section.line.toLowerCase();
			if ( lcCurSectionLine === 'get in' ) {
				airports = airports.concat( extractAirports( section.text ) );
			}
			if ( SIGHT_HEADINGS.indexOf( curSectionLine ) > -1 ) {
				const doc = domino.createDocument( section.text );
				sights = sights.concat( extractSightsFromText( doc ) );
				section.text = doc.body.innerHTML;
				if ( SIGHT_HEADINGS.indexOf( section.line ) === -1 ) {
					// Maybe the heading itself is a place. e.g. Dali
					sights.push( { name: section.line } );
				}
				if ( !data.lead.section_ids.sights ) {
					data.lead.section_ids.sights = section.id;
				}
			}

			if ( TRANSIT_LINK_HEADINGS.indexOf( lcLine ) > -1 ) {
				extractElements( section.text, 'a.external', true ).extracted.forEach( ( a ) => {
					const href = a.getAttribute( 'href' );
					// only list URLs
					if ( href.indexOf( 'http' ) > -1 && !seen[ href ] ) {
						seen[ href ] = true;
						transitLinks.push( {
							href: href,
							text: a.textContent || href.replace( 'www.', '' ).replace( /https?:\/\/([^\.]*).*/, '$1' )
						} );
					}
				} );
			}

			if ( ISLAND_SECTION_HEADINGS.indexOf( lcLine ) > -1 ) {
				isIsland = true;
			}
			if ( REGION_SECTION_HEADINGS.indexOf( lcLine ) > -1 ) {
				isRegion = true;
			}
			if ( COUNTRY_SECTION_HEADINGS.indexOf( lcLine ) > -1 ) {
				isCountry = true;
			}
			if (
				( isRegion || lcLine === 'go next' ) &&
				( section.toclevel === 1 || section.toclevel === 2 )
			) {
				data.lead.section_ids.destinations = section.id;
				cardSectionTocLevel = section.toclevel;
			}

			if ( blacklist.indexOf( section.line ) === -1 ) {
				section = cleanup( section );

				// Images are vital in these sections so do not pull them out
				if ( [ 'Regions', 'Districts' ].indexOf( section.line ) === -1 ) {
					section = extractImages( section );
					allImages = allImages.concat( section.images );
					section = extractMaps( section );
					allMaps = allMaps.concat( section.maps );
					delete section.images;
					delete section.maps;
				}

				if ( lcLine === 'get in' ) {
					airports = airports.concat( extractAirports( section.text ) );
				}

				section = climateExtraction( section );
				if ( section.climate ) {
					climate.data = section.climate;
					delete section.climate;
					// Climate table may be buried in another section
					climate.id = section.id;
				}
				// What if there is a climate section but no table?
				if ( lcLine === 'climate' ) {
					climate.id = section.id;
					if ( !climate.data ) {
						climate.text = extractText( section.text );
					}
				}

				if ( cardSectionTocLevel !== undefined && !isSubPage ) {
					if ( DESTINATION_BLACKLIST.indexOf( curSectionLine ) === -1 ) {
						section.text = undoLinkFlatten( section.text );
						section = extractDestinations( section, title );

						if ( section.destinations ) {
							if ( section.line !== curSectionLine && curSectionLine === 'Go next' ) {
								// On pages like Wellington, go next has subheadings
								section.line = `${curSectionLine} (${section.line})`;
							}
							allDestinations = allDestinations.concat( section.destinations );
						}
					}
				}

				section.text = cleanupEmptyNodes( section.text );
				if ( [ 'Sleep', 'Get in', 'Go next' ].indexOf( curSectionLine ) > -1 ) {
					// Don't list things here.
					// We will list them in a separate widget
					// Keep it for do & see as we need a fallback for where we fail to parse.
					section.text = removeNodes( section.text, 'ul,ol' );
				}

				if ( EXPLORE_HEADINGS.indexOf( curSectionLine ) > -1 ) {
					// Don't list things here. You're not Tripadvisor/Foursquare/Yelp
					if ( [ 'Eat', 'Drink', 'Buy' ].indexOf( curSectionLine ) > -1 ) {
						section.text = removeNodes( section.text, 'ul,ol' );
					}
					orientation.push( section );
				} else if ( [
					'Get in', 'Sleep', 'Talk' ].indexOf( curSectionLine ) > -1
				) {
					logistics.push( section );
				} else if ( SECTION_BLACKLIST.indexOf( curSectionLine ) === -1 &&
					SECTION_BLACKLIST.indexOf( curSectionSubheadingLine ) === -1
				) {
					sections.push( section );
				}
			}
			section.line = flattenLinksInHtml( section.line );
			section.isEmpty = isSectionEmpty( section );
			if ( section.isEmpty ) {
				section.text = '';
			}
		} );
		// if we think it's a country it's not a region.
		// Pages like Panama may have false positives.
		if ( isCountry ) {
			isRegion = false;
		}
		data.remaining.sections = sections;
		airports = airports.filter( ( code, i, self ) => self.indexOf( code ) === i );
		if ( !climate.id ) {
			climate.id = findSectionId( sections, 'understand' );
		}
		data.lead = Object.assign( {}, data.lead, {
			// Scarborough_(Trinidad_and_Tobago) becomes Scarborough
			displaytitle: stripParentheticals( data.lead.displaytitle ),
			images: data.lead.images.concat( allImages ),
			maps: allMaps,
			climate,
			isRegion,
			isIsland,
			isCountry,
			airports,
			transitLinks,
			itineraries,
			isSubPage,
			warnings
		} );
		if ( !isRegion ) {
			data.lead.sights = sights;
		}
		if ( !isEmptySectionArray( logistics ) ) {
			data.logistics = logistics;
		}
		if ( !isEmptySectionArray( orientation ) ) {
			data.orientation = orientation;
		}

		if ( allDestinations.length || sights.length ) {
			return addNextCards( data, lang, project, allDestinations, isRegion )
				.then( ( data ) => {
					// Values for country based on China.
					// Note this will give false positives for countries.
					// e.g. Kaliningrad will not show up for Russia
					// Cathedral of Notre Dame will show up for Luxembourg
					// Ideally we'd be able to verify the parent country
					return addSights( data, isCountry ? 8000 : 140 );
				} );
		} else {
			// Make sure destinations gets set
			data.lead.destinations = [];
			return data;
		}
	} ).then( addNearbyPlacesIfMissing );
}

function transform( title, lang, project, json ) {
	if ( json.code ) {
		return json;
	} else if ( json.lead && json.lead.ns > 0 ) {
		return json;
	} else {
		return voyager( title, lang, project, json );
	}
}

export default function ( title, lang, project, revision ) {
	project = 'wikivoyage';

	return page( title, lang, project, revision )
		.then( ( data ) => {
			return transform( title, lang, project, data );
		} )
		.then( ( page ) => {
			if ( !page.code ) {
				const coords = page.lead.coordinates || {};
				if ( page.lead.images.length < 10 && coords ) {
					return addImagesFromCommons( page );
				}
			}
			return page;
		} )
		.catch( function ( err ) {
			console.log( `Error thrown on ${title}: ${err}, ${err.stack}` );
			var msg = err && err.msg && err.msg;
			if ( !msg ) {
				msg = err.toString();
			}

			if ( msg && msg.indexOf( '404EXCLUDE' ) > -1 ) {
				throw new Error( '404' );
			// Any other 404s we'll route via wikipedia.org
			} else if ( msg && msg.indexOf( '404' ) === -1 ) {
				throw err;
			}
		} );
}
