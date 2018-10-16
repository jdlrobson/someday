import { extractElements, cleanupScrubbedLists,
	cleanupEmptyNodes } from './domino-utils';

export default function removeNodes( html, selector ) {
	html = cleanupEmptyNodes( html );
	var ext = extractElements( html, selector );
	return cleanupScrubbedLists( ext.html );
}
