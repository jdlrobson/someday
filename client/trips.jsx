import React from 'react';
import { showOverlay, hideOverlay } from './overlay';
import { CollectionOverlay, Icon,
	Button, CollectionEditorOverlay } from 'wikipedia-react-components';
import fetch from 'isomorphic-fetch';
import 'wikipedia-react-components/components/CollectionOverlay/styles.less';
import 'wikipedia-react-components/components/Button/mediawiki-ui-button.css';
import calc from './WorldMap/calculate-bounds-from-pages';
import { invalidate } from './edit.jsx';
import './trips.less';

export function getThumbFromPages( pages ) {
	return pages.filter( page => page.thumbnail )[ 0 ].thumbnail;
}

export function getCoordsFromPages( pages ) {
	const data = calc( pages );
	return {
		lat: data.lat,
		lon: data.lon
	};
}

export function getTrips( title ) {
	return fetch( `/api/private/collection/all/with/${title}` )
		.then( ( data )=>data.json() );
}

export function getTrip( username, id ) {
	return fetch( `/api/collection/by/${encodeURIComponent( username )}/${encodeURIComponent( id )}` )
		.then( ( data )=> data.json() );
}

export function invalidateTrip( username, id ) {
	return invalidate( `/trips/${username}/${id}` ).then( () => {
		return invalidate( `/trips/${username}` );
	} );
}
function addToCollection( id, username, title ) {
	return fetch( `/api/private/collection/${id}/add/${title}`, {
		method: 'POST',
		credentials: 'include'
	} ).then( ( data ) => {
		return invalidateTrip( username, id ).then( () => {
			return data.json();
		} );
	} );
}

function removeFromCollection( id, username, title ) {
	return fetch( `/api/private/collection/${id}/remove/${title}`, {
		method: 'POST',
		credentials: 'include'
	} ).then( ( data ) => {
		return invalidateTrip( username, id ).then( () => {
			return data.json();
		} );
	} );
}

class CollectionItem extends React.Component {
	constructor( props ) {
		super( props );
		this.state = {
			member: props.member
		};
	}
	onClick() {
		const member = this.state.member;
		const id = this.props.id;
		const title = this.props.target;
		const owner = this.props.owner;
		if ( member ) {
			removeFromCollection( id, owner, title ).then( () => {
				this.setState( { member: false } );
			} );
		} else {
			addToCollection( id, owner, title ).then( () => {
				this.setState( { member: true } );
			} );
		}
	}
	render() {
		const collection = this.props;
		const member = this.state ? this.state.member : collection.member;
		return (
			<li>
				{collection.title}
				<Icon
					onClick={this.onClick.bind( this )}
					glyph={member ? 'tick' : 'blank-tick'}
				/>
			</li>
		);
	}
}

function getSaveCollectionHandler( owner, id, image, lat, lon ) {
	const url = id ? `/api/private/collection/${id}/edit/` :
		'/api/private/collection/_/create/';
	const coordinates = { lat, lon };

	return function ( title, description ) {
		return fetch( url, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify( { title, description, image, coordinates } ),
			credentials: 'include'
		} ).then( ()=> {
			invalidateTrip( owner, id ).then( () => {
				hideOverlay();
				window.location.reload();
			} );
		} );
	};
}

export function showCollectionEditor( ev, owner, title, description, id, thumb, lat, lon ) {
	thumb = thumb || {};
	showOverlay( ev, <CollectionEditorOverlay
		title={title}
		thumbnail={thumb}
		description={description}
		onExit={hideOverlay}
		onSaveCollection={getSaveCollectionHandler( owner, id, thumb.title, lat, lon )} /> );
}

export function showCollectionOverlay( ev, title, data, onClickCreateTrip ) {
	showOverlay( ev,
		<CollectionOverlay actions={<Button onClick={onClickCreateTrip}
			label="Create new trip"></Button>
		}>
			<ul>{data.collections.map(
				( collection, i ) => <CollectionItem key={i} {...collection} target={title} />
			)}</ul>
		</CollectionOverlay>
	);
}
