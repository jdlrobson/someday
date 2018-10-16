import { isNodeEmpty } from './voyager/domino-utils';

export default function extractLeadParagraph( doc ) {
	var p = '';
	var nodes = doc.querySelectorAll( 'p' );
	var i = 0;
	var node = nodes[ 0 ];
	// fast forward to first empty node.
	while ( isNodeEmpty( node ) ) {
		i++;
		// delete the empty node
		node.parentNode.removeChild( node );
		node = nodes[ i ];
	}
	p = node.innerHTML;
	// delete it
	node.parentNode.removeChild( node );

	return p;
}
