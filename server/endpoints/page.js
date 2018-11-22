import domino from 'domino';

import { SPECIAL_PROJECTS, HOST_SUFFIX } from './../config';
import extractLeadParagraph from './extractLeadParagraph';
import extractHatnote from './extractHatnote';
import extractInfobox from './extractInfobox';
import getMedia from './extractMedia';
import htmlToJson from './htmlToJson';

function getBaseHost( lang, project ) {
	if ( SPECIAL_PROJECTS.indexOf( project ) > -1 ) {
		return project + '.wikimedia';
	} else {
		return lang + '.' + project;
	}
}

export default function ( title, lang, project, revision ) {
	const host = getBaseHost( lang, project ) + HOST_SUFFIX;
	const path = '/api/rest_v1/page/html/';
	const suffix = revision ? '/' + revision : '';
	if ( title.substr( 0, 6 ) === 'Media:' ) {
		title = title.replace( 'Media:', 'File:' );
	}
	// FIXME: Handle this better please. Use better API.
	var url = 'https://' + host + path +
    encodeURIComponent( title ) + suffix;

	return htmlToJson( url ).then( function ( json ) {
		if ( json.code ) {
			throw new Error( JSON.stringify( json ) );
		}
		const leadSectionText = json.lead.sections.length && json.lead.sections[ 0 ] && json.lead.sections[ 0 ].text;
		if ( json.lead.disambiguation ) {
			json.lead.paragraph = leadSectionText + json.remaining.sections.map( ( section ) => {
				return section.text;
			} ).join( '' );
		} else {
			json.remaining.sections.forEach( function ( section ) {
				if ( section.text ) {
					var doc = domino.createDocument( section.text );
					section.text = doc.body.innerHTML;
				}
			} );
			json.lead.media = getMedia( json.lead.sections.concat( json.remaining.sections ) );
			// Workaround for https://phabricator.wikimedia.org/T145034
			const doc = domino.createDocument( leadSectionText );

			if ( doc ) {
				var infobox = extractInfobox( doc );
				if ( !json.lead.mainpage ) {
					var leadParagraph = extractLeadParagraph( doc );
					json.lead.paragraph = leadParagraph;
				}
				json.lead.infobox = infobox;
				json.lead.hatnote = extractHatnote( doc );
				json.lead.sections[ 0 ].text = doc.body.innerHTML;
			}
		}

		return json;
	} );
}
