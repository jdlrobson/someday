// Undo the work in mobile-content-service (https://phabricator.wikimedia.org/T147043)
export default function undoLinkRewrite( doc ) {
	var idx = 0;
	var sp;
	var ps = doc.querySelectorAll( 'a' ) || [],
		value;
	for ( idx = 0; idx < ps.length; idx++ ) {
		var node = ps[ idx ];
		value = node.getAttribute( 'href' );
		if ( value ) {
			// replace all subpages with encoded '/'
			value = value.replace( /^\/wiki\//, './' );
			if ( value.substr( 0, 2 ) === './' ) {
				sp = value.substr( 2 );
				sp = sp.replace( /\//g, '%2F' );
				value = './' + sp;
			}
			node.setAttribute( 'href', value );
		}
	}
}
