import mwApi from './../mwApi';
/**
 * Adds to the exiting lead.images property of a page with images
 * from commons
 * @param {Object} page
 * @return {Promise}
 */
export default function addImagesFromCommons( page ) {
	const coords = page.lead.coordinates || {};
	const images = page.lead.images || [];
	var params = {
		prop: 'pageimages',
		generator: 'geosearch',
		ggsradius: '10000',
		ggsnamespace: 6,
		pithumbsize: 400,
		ggslimit: 50,
		ggscoord: `${coords.lat}|${coords.lon}`
	};
	return mwApi( 'en', params, 'commons' ).then( ( query ) => {
		page.lead.images = images.concat(
			query.pages.map( ( page ) => {
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
