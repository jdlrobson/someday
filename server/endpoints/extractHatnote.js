export default function extractHatnote( doc ) {
	// Workaround for https://phabricator.wikimedia.org/T143739
	// Do not remove it from the DOM has a reminder this is not fixed.
	var hatnoteNodes = doc.querySelectorAll( '.hatnote,.noexcerpt' );
	var hatnote;
	if ( hatnoteNodes.length ) {
		hatnote = '';
		Array.prototype.forEach.call( hatnoteNodes, function ( hatnoteNode ) {
			hatnote += hatnoteNode.innerHTML + '<br/>';
			hatnoteNode.parentNode.removeChild( hatnoteNode );
		} );
	}
	return hatnote;
}
