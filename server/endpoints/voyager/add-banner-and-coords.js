import {
	TITLE_BLACKLIST
} from './constants';
import mwApi from './../mwApi';
import thumbnailFromTitle from './../thumbnail-from-title';

// FIXME: This can be done in mobile content service
/**
 *
 * @param {string} title of page
 * @param {string} lang of page
 * @param {string} project of page
 * @param {object} data of page
 * @throws {Error} if page is in the TITLE_BLACKLIST or is marked as a topic or phrasebook
 * @return {Promise}
 */
export default function addBannerAndCoords( title, lang, project, data ) {
	var width;
	var params = {
		redirects: '',
		prop: 'coordinates|pageprops|pageassessments',
		pageprops: 'wpb_banner',
		titles: title
	};
	return mwApi( lang, params, data.lead.project_source || project ).then( function ( propData ) {
		var page = propData.pages[ 0 ];
		var title;
		var url = `https://en.wikivoyage.org/wiki/${page.title}`;

		if ( page && page.coordinates ) {
			data.lead.coordinates = page.coordinates.length ? page.coordinates[ 0 ] : page.coordinates;
		} else if ( page && page.pageassessments && ( page.pageassessments.topic || page.pageassessments.phrasebook ) ) {
			throw new Error( JSON.stringify( { code: 302, url } ) );
		} else if ( TITLE_BLACKLIST.indexOf( page.title ) > -1 ) {
			throw new Error( JSON.stringify( { code: 302, url } ) );
		}

		data.lead.images = [];
		if ( page && page.pageprops ) {
			title = page.pageprops.wpb_banner;
			const lcBannerTitle = title && title.toLowerCase();
			width = 800;
			if ( title && lcBannerTitle.indexOf( ' default banner' ) === -1 &&
				lcBannerTitle.indexOf( 'pagebanner default.jpg' ) === -1
			) {
				data.lead.images.push( {
					caption: '',
					isBanner: true,
					href: './File:' + title,
					width: width.toString(),
					height: ( width / 7 ).toString(),
					src: thumbnailFromTitle( title, width )
				} );
			}
		}
		return data;
	} );
}
