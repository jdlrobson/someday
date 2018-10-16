import domino from 'domino';
import { isNodeEmpty } from './domino-utils';

export default function isSectionEmpty( section ) {
	var window = domino.createWindow( '<div>' + section.text + '</div>' ),
		document = window.document;

	return isNodeEmpty( document.body );
}
