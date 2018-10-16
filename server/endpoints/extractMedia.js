import domino from 'domino';

export default function extractMedia( sections ) {
	var html = '';
	sections.forEach( function ( section ) {
		if ( section.text ) {
			html += section.text;
		}
	} );
	var doc = domino.createDocument( html );
	var imageNodes = doc.querySelectorAll( '.mw-default-size a > img, figure a > img' );
	var images = [];
	Array.prototype.forEach.call( imageNodes, function ( imageNode ) {
		var href = imageNode.parentNode.getAttribute( 'href' ).split( '/' );
		images.push( href[ href.length - 1 ] );
	} );
	return images;
}
