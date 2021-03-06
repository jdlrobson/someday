import { cleanupScrubbedLists, extractElements, isNodeEmpty } from './domino-utils';

import extractDescFromText from './extract-description-from-text';
import getParentWithTag from './get-parent-with-tag';
import cleanDescription from './clean-description';

function has( array, title ) {
	var needle = false;
	array.forEach( function ( p ) {
		if ( p.title === title ) {
			needle = true;
		}
	} );
	return needle;
}

function looksLikeCommaList( html ) {
	return html.match( /,.*( and|or )/ ) && html.indexOf( ':' ) > 0;
}

function extractFromList( html ) {
	var titles = [];
	var dict = {};
	var discarded = 0;
	// scrub
	var ext = extractElements( html, '.listing-coordinates, .mw-kartographer-maplink' );

	ext = extractElements( ext.html, 'ul ul', true );
	Array.prototype.forEach.call( ext.extracted, function ( list ) {
		var res = extractFromList( list.innerHTML );
		list.innerHTML = '<ul>' + res.text + '</ul>';
		if ( isNodeEmpty( list ) ) {
			list.parentNode.removeChild( list );
		}
		titles = titles.concat( res.destinations );
	} );
	html = ext.document.body.innerHTML.trim();

	// vcard method
	ext = extractElements( html, '.vcard .listing-name > b > a', true );
	Array.prototype.forEach.call( ext.extracted, function ( node ) {
		let title = node.getAttribute( 'title' );
		let url;
		const external = node.getAttribute( 'class' ) ?
			node.getAttribute( 'class' ).indexOf( 'external' ) > -1 : undefined;
		const listItem = getParentWithTag( node, 'LI' );
		if ( !title && external ) {
			url = node.getAttribute( 'href' );
			title = node.textContent;
		}
		node.parentNode.removeChild( node );
		if ( listItem && listItem.textContent ) {
			const text = listItem.textContent.trim();
			const description = cleanDescription( text );
			// A title is not a given. If not found. Not a destination (#31).
			if ( title ) {
				titles.push( { title, description, url, external } );
			}
		} else {
			// no description
			titles.push( { title } );
		}
		// cleanup
		if ( listItem.parentNode ) {
			listItem.parentNode.removeChild( listItem );
		}
	} );
	html = ext.document.body.innerHTML.trim();

	ext = extractElements( html, 'li > a:first-child, li > b:first-child, li > i:first-child', true );
	Array.prototype.forEach.call( ext.extracted, function ( node ) {
		var attr, text, listItem, siblingLinks, listItemTextContent,
			isExternalLink = false,
			link = node,
			doNotScrub = false;

		// This node was already removed from the dom. I'm not sure how you got it..
		if ( !node.parentNode ) {
			return;
		}

		listItem = getParentWithTag( link, 'LI' );
		listItemTextContent = listItem.textContent;
		siblingLinks = listItem ? listItem.querySelectorAll( 'a' ) : 0;

		if ( link.tagName !== 'A' ) {
			link = node.querySelector( 'a' );
			if ( !link ) {
				doNotScrub = true;
				while ( node.nextSibling && node.nextSibling.tagName !== 'A' ) {
					node = node.nextSibling;
				}
				if ( node && node.nextSibling ) {
					link = node.nextSibling;
				}
			}
		}

		function isLastChild( node ) {
			var parentNode = node.parentNode;
			var lc = parentNode.lastChild;
			if ( lc === node ) {
				return true;
			} else if ( lc.textContent.trim() === '.' ) {
				lc = lc.previousSibling;
				return lc === node;
			} else {
				return false;
			}
		}

		if ( siblingLinks.length > 3 && looksLikeCommaList( listItemTextContent ) ) {
			titles = titles.concat(
				Array.from( siblingLinks ).map( ( link ) => {
					return {
						title: link.getAttribute( 'title' ) || link.textContent
					};
				} )
			);
		} else if ( listItem && link && ( !isLastChild( link ) || link.parentNode.childNodes.length < 3 ) ) {
			var textContent = link ? link.textContent : node.textContent;
			attr = link ? link.getAttribute( 'title' ) : textContent;
			isExternalLink = link.getAttribute( 'href' ).indexOf( '://' ) > -1;

			var textWithoutParenthesises = listItem.textContent.replace( link.textContent, '' )
				.replace( /^ *\([^\)]*\)\./, '.' );
			if ( !doNotScrub ) {
				text = extractDescFromText( textWithoutParenthesises );
			}

			// Only allow capitalised
			if ( attr && !dict[ attr ] && textContent.match( /^[A-Z]/ ) ) {
				dict[ attr ] = true;
				titles.push( { title: attr,
					description: text } );
			}

			var scrubbedCompletely = false;
			if ( attr ) {
				var scrubbedText = textWithoutParenthesises
					.replace( text || '', '' ).replace( /[-—–,\.]/g, '' )
					// remove any content in brackets
					.replace( /\([^\)]*\)/gi, '' )
					.replace( link ? link.textContent : node.textContent, '' )
					.replace( /^ (in|on) .*/, '' )
					.trim();

				scrubbedCompletely = scrubbedText.length === 0;
			}

			// remove it if it just just had a link.
			if ( isExternalLink ||
				scrubbedCompletely || textWithoutParenthesises.trim() === node.textContent.trim()
			) {
				if ( listItem.parentNode ) {
					listItem.parentNode.removeChild( listItem );
				}
			}
		} else {
			discarded += 1;
		}
	} );

	if ( discarded === 0 && titles.length === 0 ) {
		// This approach is error prone.
		// For example on http://localhost:8142/en/wiki/Phnom%20Penh
		// it returns the country Vietnam as a place to go next. Use cityFilter.

		// now parse any remaining links but don't remove from DOM
		ext = extractElements( ext.document.body.innerHTML, 'a', true );
		html = ext.html;
		Array.prototype.forEach.call( ext.extracted, function ( link ) {
			var attr = link.getAttribute( 'title' );

			if ( attr && !dict[ attr ] ) {
				dict[ attr ] = true;
				if ( attr.indexOf( 'w:' ) !== 0 && link.textContent.match( /^[A-Z]/ ) ) {
					titles.push( { title: attr } );
				}
			}
		} );
	} else {
		// after all our shenanigans let's also check if we emptied the content of any lists.
		html = cleanupScrubbedLists( ext.document.body.innerHTML );
	}

	return {
		text: html,
		destinations: titles || []
	};
}

function isAirport( link ) {
	return link.textContent.toLowerCase().indexOf( ' airport' ) > -1;
}

function extractDestinations( section, originalTitle ) {
	var destinations = [];
	var seeAlso = [];
	// scrape route routeBoxes. I haven't worked out what to do with them yet.
	var ext = extractElements( section.text, '.routeBox' );

	var res = extractFromList( ext.html );
	destinations = res.destinations;

	if ( ext.extracted.length && destinations.length < 3 ) {
		Array.prototype.forEach.call( ext.extracted, function ( routeBox ) {
			// there should only be one route box
			Array.prototype.forEach.call( routeBox.querySelectorAll( 'a' ), function ( link ) {
				var title = link.hasAttribute( 'title' ) ? link.getAttribute( 'title' ) : link.textContent;
				if ( title && !has( destinations, title ) && !isAirport( link ) ) {
					destinations.push( { title: title } );
				}
			} );
		} );
	}
	ext = extractElements( res.text, 'p, dd', true );
	Array.prototype.forEach.call( ext.extracted, function ( p ) {
		if ( p.textContent.indexOf( 'See also' ) > -1 ) {
			seeAlso = seeAlso.concat(
				Array.prototype.map.call(
					extractElements( res.text, 'a' ).extracted,
					function ( link ) {
						return {
							title: link.textContent,
							url: link.getAttribute( 'href' )
						};
					} )
			);
			p.parentNode.removeChild( p );
		}
	} );
	// exclude the original title
	destinations = destinations.filter( ( a )=> {
		return a.title !== originalTitle;
	} );
	section.destinations = destinations;
	section.text = cleanupScrubbedLists( ext.document.body.innerHTML );
	section.seeAlso = seeAlso;
	return section;
}

export default extractDestinations;
