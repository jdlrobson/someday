export default function extractInfobox( doc ) {
	var infobox;
	var node = doc.querySelector( '.infobox' );
	if ( node ) {
		infobox = '<table class="' + node.getAttribute( 'class' ) + '">' + node.innerHTML + '</table>';
		// delete it
		node.parentNode.removeChild( node );
	}
	return infobox;
}
