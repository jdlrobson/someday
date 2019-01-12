import { extractElements } from './domino-utils';
import getParentWithTag from './get-parent-with-tag';

// https://github.com/jdlrobson/someday/issues/38
// https://github.com/jdlrobson/someday/issues/36
export function removeDuplicates( sights ) {
	const mergedSights = [];
	sights.forEach(( sight, i ) => {
		const found = mergedSights.findIndex((s) => s.name === sight.name);
		const existingSight = mergedSights[found];
		if ( found === -1 ) {
			mergedSights.push( sight );
		} else {
			mergedSights[found] = Object.assign( {}, existingSight, sight );
		}
	} );
	return mergedSights;
}

function cleanSights( sights ) {
	return sights.filter( ( sight ) => {
		const name = sight.name.trim();
		const firstCharLowercase = name.length > 1 && name.charAt(0).toLowerCase() === name[0];
		const isTelephoneNumber = name.match(/\+[0-9]+ [0-9-]+/ );
		const isWebsite = name.match( /.*@*.\.(com|org)/ );
		const isUrl = name.match( /^\.\// );
		return !isWebsite && !isTelephoneNumber && !isUrl &&
			!firstCharLowercase &&
			// remove short string matches.. unlikely to find on wikipedia.
			name.length > 2;
	} );
}

export default function ( doc ) {
	let text = doc.body.innerHTML;
	let sights = [];
	// sister site links e.g. Panama City
	const sisterSiteLink = doc.querySelectorAll( '.listing-sister a' );
	if ( sisterSiteLink.length ) {
		sisterSiteLink.forEach( ( sister ) => {
			const listItem = getParentWithTag( sister, 'LI' );
			const summaryItems = listItem ? listItem.querySelectorAll( '.vcard .listing-content' ) : [];

			sights.push( {
				description: summaryItems.length ? summaryItems[ 0 ].textContent : '',
				name: sister.getAttribute( 'href' ).replace( './W:', '' ).replace( /_/g, ' ' )
			} );
			if ( listItem && listItem.parentNode ) {
				listItem.parentNode.removeChild( listItem );
			}
		} );
	}

	const nameToObjTrusted = ( name ) => {
		return {
			name,
			trusted: true
		};
	};
	const linksAndBolds = extractElements( text, 'a, b', true ).extracted;
	const parsedSights = Array.from( linksAndBolds )
		.map( ( node ) => {
			const title = node.getAttribute( 'title' );
			const url = node.getAttribute( 'href' );
			const rel = node.getAttribute( 'rel' );
			const listingName = node.querySelectorAll( '.listing-name' );
			if ( title && title.indexOf( 'w:' ) === 0 ) {
				// a wikipedia link
				return nameToObjTrusted( title && title.split( ':' )[ 1 ] );
			} else if ( url && rel === 'mw:ExtLink' && listingName.length ) {
				const name = listingName[ 0 ].textContent;
				return {
					name,
					title: name,
					url,
					external: true
				};
			} else {
				return {
					name: node.textContent
				};
			}
		} );
	text = doc.body.innerHTML;
	parsedSights.forEach( ( sight, i ) => {
		const j = parsedSights.findIndex( s => s.name === sight.name );
		if ( i !== j ) {
			// merge into 1st occurance
			parsedSights[ j ] = Object.assign( parsedSights[ j ], sight );
			// mark for removal
			parsedSights[ i ] = false;
		}
	} );
	return cleanSights( removeDuplicates( sights.concat( parsedSights.filter( sight => !!sight ) ) ) );
}
