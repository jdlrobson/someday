import fetch from 'isomorphic-fetch';
import domino from 'domino';
function parsoidHTMLToJSON( html ) {
	var doc = domino.createDocument( html );
	const disambig = doc.querySelector( 'meta[property="mw:PageProp/disambiguation"]' );
	const sections = Array.from( doc.querySelectorAll( 'section' ) ).map( ( sec ) => {
		// Clone so you can make modifications
		const secEl = sec.cloneNode( true );
		let toclevel;
		const h2 = secEl.querySelectorAll( 'h2,h3,h4,h5,h6' )[ 0 ];
		const line = h2 ? h2.textContent : undefined;
		const id = secEl.getAttribute( 'data-mw-section-id' );
		const anchor = h2 ? h2.getAttribute( 'id' ) : 0;
		// drop h2
		if ( h2 ) {
			h2.parentNode.removeChild( h2 );
			// @todo 2 is not correct
			switch ( h2.tagName ) {
				case 'H6':
					toclevel = 5;
					break;
				case 'H5':
					toclevel = 4;
					break;
				case 'H4':
					toclevel = 3;
					break;
				case 'H3':
					toclevel = 2;
					break;
				default:
					toclevel = 1;
					break;
			}
		}
		// Remove subsections
		Array.from( secEl.querySelectorAll( 'section' ) ).forEach( ( node ) => node.parentNode.removeChild( node ) );
		return {
			toclevel,
			anchor,
			id,
			line,
			text: secEl.innerHTML
		};
	} );

	const title = doc.querySelector( 'head title' ).textContent;
	return {
		lead: {
			disambiguation: disambig ? true : false,
			title,
			displaytitle: title,
			sections: sections.slice( 0, 1 )
		},
		remaining: {
			sections: sections.slice( 1 )
		}
	};
}

export default function ( url ) {
	return fetch( url, { redirect: 'manual' } )
		.then( ( resp ) => {
			const code = resp.status;
			if ( [ 301, 302 ].indexOf( code ) > -1 ) {
				return {
					code,
					title: resp.headers.get( 'Location' ).split( '/' ).slice( -1 )
				};
			} else {
				return resp.text()
					.then( ( html ) => parsoidHTMLToJSON( html ) );
			}
		} );
}
