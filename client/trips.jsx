import React from 'react';
import { showOverlay, hideOverlay } from './overlay';
import { CollectionOverlay, Icon,
	Button, CollectionEditorOverlay } from 'wikipedia-react-components';
import fetch from 'isomorphic-fetch';

export function getTrips( title ) {
	return fetch( `/api/private/collection/all/with/${title}` )
		.then( ( data )=>data.json() );
}

export function getTrip( username, id ) {
	return fetch( `/api/collection/by/${encodeURIComponent( username )}/${encodeURIComponent( id )}` )
		.then( ( data )=> data.json() );
}

function addToCollection( id, title ) {
	return fetch( `/api/private/collection/${id}/add/${title}`, {
		method: 'POST',
		credentials: 'include'
	} ).then( ( data )=>data.json() );
}

function removeFromCollection( id, title ) {
	return fetch( `/api/private/collection/${id}/remove/${title}`, {
		method: 'POST',
		credentials: 'include'
	} ).then( ( data )=>data.json() );
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
		if ( member ) {
			removeFromCollection( id, title ).then( () => {
				this.setState( { member: false } );
			} );
		} else {
			addToCollection( id, title ).then( () => {
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

function getSaveCollectionHandler( id, image, lat, lon ) {
	const url = id ? `/api/private/collection/${id}/edit/` :
		'/api/private/collection/_/create/';

	return function ( title, description ) {
		return fetch( url, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify( { title, description, image, lat, lon } ),
			credentials: 'include'
		} ).then( ()=> {
			hideOverlay();
			window.location.reload();
		} );
	};
}

export function showCollectionEditor( ev, title, description, id, thumb, lat, lon ) {
	thumb = thumb || {};
	showOverlay( ev, <CollectionEditorOverlay
		title={title}
		thumbnail={thumb}
		description={description}
		onExit={hideOverlay}
		onSaveCollection={getSaveCollectionHandler( id, thumb.title, lat, lon )} /> );
}

export function showCollectionOverlay( ev, title, data ) {
	showOverlay( ev,
		<CollectionOverlay actions={<Button onClick={showCollectionEditor}
			label="Create new trip"></Button>
		}>
			<ul>{data.collections.map(
				( collection, i ) => <CollectionItem key={i} {...collection} target={title} />
			)}</ul>
		</CollectionOverlay>
	);
}
