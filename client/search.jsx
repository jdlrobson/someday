import React from 'react';
import { showOverlay, refreshOverlay } from './overlay';
import { Input, Overlay } from 'wikipedia-react-components';
import fetch from 'isomorphic-fetch';
import qs from 'query-string';
import { placeToCard } from './../components/helpers';
import './search.less';

let timeout;

function filterNonPages( { title, categories } ) {
	// filter district articles
	if ( title.indexOf( '/' ) > -1 ) {
		return false;
	} else if ( !categories || categories.length === 0 ) {
		return true;
	}
	// keep only if it doesn't match one of the banned categories
	const categoryNames = categories.map( ( cat ) => cat.title );
	const matches = [
		'Category:Title articles',
		'Category:Concerns',
		'Category:Outline topics',
		'Category:Topic articles'
	].filter( ( banned ) => categoryNames.indexOf( banned ) > -1 );
	return matches.length === 0;
}

function doSearch( ev ) {
	const self = doSearch;
	const value = ev.target.value;
	const query = qs.stringify( {
		action: 'query',
		prop: 'pageprops|pageimages|description|categories',
		piprop: 'thumbnail',
		pithumbsize: 80,
		pilimit: 15,
		// stupid mediawiki api
		cllimit: 'max',
		redirects: 1,
		format: 'json',
		formatversion: 2,
		generator: 'prefixsearch',
		gpssearch: value,
		gpsnamespace: 0,
		gpslimit: 15
	} );
	clearTimeout( timeout );
	timeout = setTimeout( () => {
		fetch( `/api/wikimedia/en.wikivoyage.org/api.php?${query}` )
			.then( ( resp ) => resp.json() ).then( ( data ) => {
				refreshOverlay(
					// eslint-disable-next-line no-use-before-define
					getSearchOverlay(
						data.pages
							.filter( filterNonPages )
							.map( ( page, i ) => placeToCard( page, `search-${i}` ) ),
						self
					)
				);
			} );
	}, 400 );
}

function getSearchOverlay( children, onChange ) {
	return (
		<Overlay className="search-overlay">
			<Input autoFocus onChange={onChange}
				key="search" />
			<div className="search-overlay__results">{children}</div>
		</Overlay>
	);
}

export function showSearchOverlay( ev ) {
	showOverlay( ev,
		getSearchOverlay( [], doSearch.bind( doSearch ) )
	);
}
