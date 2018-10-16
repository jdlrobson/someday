import domino from 'domino';
import flattenElements from './flatten-elements';

export default function flattenLinksInHtml( html ) {
	const window = domino.createWindow( html );
	flattenElements( window.document, 'a' );
	return window.document.body.innerHTML;
}
