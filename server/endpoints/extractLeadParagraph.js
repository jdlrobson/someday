export default function extractLeadParagraph( doc ) {
	var p = '';
	var node = doc.querySelector( 'p' );
	if ( node ) {
		p = node.innerHTML;
		// delete it
		node.parentNode.removeChild( node );
	}
	return p;
}
