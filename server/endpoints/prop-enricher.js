import mwApi from './mwApi';

function unique( pages ) {
	return pages.filter( ( page, i ) => {
		return pages.findIndex( ( anotherPage ) => {
			return anotherPage.title === page.title;
		} ) === i;
	} );
}

/**
 * @typedef Redirect
 * @property {string} from
 * @property {string} to
 */

/**
 * @param {Object} pages
 * @param {Object} pagesToMerge
 * @param {Redirect[]} redirects
 * @return {Object} pages
 */
export function mergePages( pages, pagesToMerge, redirects ) {
	var index = {};
	var redirectMap = {};
	if ( redirects ) {
		redirects.forEach( ( redirect ) => {
			redirectMap[ redirect.from ] = redirect.to;
		} );
	}

	pages.forEach( function ( page ) {
		const title = page.title;
		if ( page.thumbnail && page.pageimage ) {
			page.thumbnail.title = 'File:' + page.pageimage;
		}
		index[ title ] = Object.assign( {}, index[ title ], page );
	} );
	return unique(
		pagesToMerge.map( function ( page ) {
			let title = page.title.replace( /_/gi, ' ' );
			// rewrite title if necessary
			if ( redirectMap[ title ] ) {
				title = redirectMap[ title ];
			}
			var obj = index[ title ] || {};
			return Object.assign( {}, page, obj, { title } );
		} )
	);
}

function propEnricher( arr, props, lang, project, params ) {
	lang = lang || 'en';
	project = project || 'wikipedia';
	params = params || {};

	if ( arr.length > 50 ) {
		const promises = [];
		for ( let i = 0; i < 200; i = i + 50 ) {
			promises.push(
				propEnricher( arr.slice( i, i + 50 ), props, lang, project, params )
			);
		}
		return Promise.all( promises ).then( ( pagesArr ) => {
			const emptyArr = [];
			const combinedPages = emptyArr.concat.apply( emptyArr, pagesArr );
			return unique( combinedPages );
		} );
	}

	var titles = [];
	if ( typeof arr[ 0 ] === 'string' ) {
		arr = arr.map( function ( title ) {
			return {
				title: title
			};
		} );
	}
	arr.forEach( function ( page ) {
		titles.push( page.title );
	} );
	params = Object.assign( params, {
		redirects: '',
		prop: props.join( '|' ),
		titles: titles.join( '|' )
	} );
	if ( props.indexOf( 'pageimages' ) > -1 ) {
		params.pilimit = 50;
		params.pithumbsize = 120;
	}
	if ( props.indexOf( 'coordinates' ) > -1 ) {
		params.colimit = 'max';
	}
	if ( props.indexOf( 'pageterms' ) > -1 ) {
		params.wbptterms = 'description';
	}

	return mwApi( lang, params, project ).then( function ( data ) {
		return mergePages( data.pages, arr, data.redirects );
	} ).catch( function () {
		// Looks like the endpoint is down or no internet connection - so return original array
		return arr;
	} );
}

export default propEnricher;
