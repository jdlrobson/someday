import { extractElements } from './domino-utils';
import getParentWithTag from './get-parent-with-tag';

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
	return sights.concat( parsedSights.filter( sight => !!sight ) );
}
