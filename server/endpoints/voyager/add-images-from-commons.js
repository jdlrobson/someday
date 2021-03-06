import mwApi from './../mwApi';

// List of phrases we do not want to see in categories
const CATEGORY_BLACKLIST = [
	'cars',
	'insects on ',
	'airport',
	// a favorite activity but not interesting
	'footprints on sand',
	'aircraft',
	'aviation',
	'airbus'
];

export function hasForbiddenCategory( categories ) {
	return categories.filter( ( title ) => {
		// Filter list of categories to ones that we like
		const lc = title.toLowerCase();
		return CATEGORY_BLACKLIST.filter( bad => lc.indexOf( bad ) > -1 ).length;
	} ).length > 0;
}

/**
 * @typedef {Object} Coordinate
 * @property {number} lat
 * @property {number} lon
 */

/**
 * @typedef {object} Page
 * @property {Object} lead
 * @property {Coordinate} lead.coordinates
 * @property {Array} lead.images
 * @property {Array} lead.images
 */
/**
 * Adds to the exiting lead.images property of a page with images
 * from commons
 * @param {Page} page
 * @param {string} [radius] defaults to '10000'
 * @return {Promise}
 */
export default function addImagesFromCommons( page, radius ) {
	const coords = page.lead.coordinates;
	if ( !coords ) {
		return Promise.resolve( page );
	}
	const images = page.lead.images || [];
	var params = {
		prop: 'pageimages|categories',
		generator: 'geosearch',
		ggsradius: radius || '10000',
		cllimit: 'max',
		ggsnamespace: 6,
		pithumbsize: 400,
		ggslimit: 50,
		ggscoord: `${coords.lat}|${coords.lon}`
	};
	return mwApi( 'en', params, 'commons' ).then( ( query ) => {
		const imagePages = query.pages || [];
		page.lead.images = images.concat(
			imagePages.filter( ( page ) =>
				!hasForbiddenCategory(
					( page.categories || [] ).map( cat => cat.title )
				)
			).map( ( page ) => {
				const thumb = page.thumbnail;
				return {
					caption: '',
					href: `./${page.title.replace( / /g, '_' )}`,
					src: thumb.source,
					width: thumb.width,
					height: thumb.height
				};
			} )
		);
		return page;
	} ).catch( ( e )=> {
		console.log( e );
		return page;
	} );
}
