import fetch from 'isomorphic-fetch';
import domino from 'domino';

import { SPECIAL_PROJECTS, HOST_SUFFIX, SITE_HOME } from './../config';
import extractLeadParagraph from './extractLeadParagraph';
import undoLinkRewrite from './undoLinkRewrite';
import extractHatnote from './extractHatnote';
import extractInfobox from './extractInfobox';
import getMedia from './extractMedia';

function getBaseHost( lang, project ) {
	if ( SPECIAL_PROJECTS.indexOf( project ) > -1 ) {
		return project + '.wikimedia';
	} else {
		return lang + '.' + project;
	}
}

export default function ( title, lang, project, revision ) {
	const host = getBaseHost( lang, project ) + HOST_SUFFIX;
	const path = '/api/rest_v1/page/mobile-sections/';
	const suffix = revision ? '/' + revision : '';
	if ( title.substr( 0, 6 ) === 'Media:' ) {
		title = title.replace( 'Media:', 'File:' );
	}
	// FIXME: Handle this better please. Use better API.
	var url = 'https://' + host + path +
    encodeURIComponent( title ) + suffix;

	return fetch( url, { redirect: 'manual' } )
		.then( function ( resp ) {
			if ( [ 301, 302 ].indexOf( resp.status ) > -1 ) {
				var redirectUrl = resp.headers.get( 'Location' );
				if ( redirectUrl.indexOf( host ) > -1 ) {
					return {
						code: 301,
						title: redirectUrl.replace( host, '' )
							.replace( 'commons.wikimedia.org', '' )
							.replace( path, '' ).replace( /https?\:\/\//, '' )
					};
				} else if ( redirectUrl.indexOf( 'commons.wikimedia.org' ) > -1 ) {
					// Workaround for https://github.com/jdlrobson/weekipedia/issues/139
					return {
						code: 301,
						project: 'en.commons',
						title: redirectUrl
							.replace( 'commons.wikimedia.org', '' )
							.replace( path, '' ).replace( /https?\:\/\//, '' )
					};
				}
			} else if ( resp.status === 200 ) {
				return resp.json();
			}
		} ).then( function ( json ) {
			if ( !json ) {
				throw '404: Bad title given';
			}
			if ( json.code ) {
				return json;
			}

			json.remaining.sections.forEach( function ( section ) {
				if ( section.text ) {
					var doc = domino.createDocument( section.text );
					undoLinkRewrite( doc );
					section.text = doc.body.innerHTML;
				}
			} );

			// Workaround for https://phabricator.wikimedia.org/T145034
			var doc = domino.createDocument( json.lead.sections.length && json.lead.sections[ 0 ] && json.lead.sections[ 0 ].text );
			json.lead.media = getMedia( json.lead.sections.concat( json.remaining.sections ) );
			if ( doc ) {
				// See https://github.com/jdlrobson/weekipedia/issues/99 - preserve links in main page
				if ( SITE_HOME.replace( /_/g, ' ' ) !== title.replace( /_/g, ' ' ) ) {
					undoLinkRewrite( doc );
				}
				var infobox = extractInfobox( doc );
				if ( !json.lead.mainpage ) {
					var leadParagraph = extractLeadParagraph( doc );
					json.lead.paragraph = leadParagraph;
				}
				json.lead.infobox = infobox;
				json.lead.hatnote = extractHatnote( doc );
				json.lead.sections[ 0 ].text = doc.body.innerHTML;
			}
			return json;
		} );
}
