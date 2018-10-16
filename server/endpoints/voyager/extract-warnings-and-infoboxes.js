import { extractElements } from './domino-utils';
import flattenLinksInHtml from './flattenLinksInHtml';

export function extractWarnings( section ) {
	var ext = extractElements( section.text, '.pp_warningbox' );
	if ( ext.extracted.length ) {
		section.warnings = '<table> ' + ext.extracted[ 0 ].innerHTML + '</table>';
	}
	section.text = ext.html;
	return section;
}

export default function extractWarningsAndInfobox( section ) {
	extractWarnings( section );
	var ext = extractElements( section.text, 'table' );
	if ( ext.extracted.length ) {
		section.infobox = flattenLinksInHtml( `<table>${ext.extracted[ 0 ].innerHTML}</table>` );
	}
	section.text = ext.html;
	return section;
}
