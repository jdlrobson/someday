import React from 'react';
import { showOverlay } from './overlay';
import { CollectionOverlay, Icon } from 'wikipedia-react-components';
import fetch from 'isomorphic-fetch';

export function getTrips( title ) {
	return fetch( `/api/private/collection/all/with/${title}` )
		.then( ( data )=>data.json() );
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
export function showCollectionOverlay( ev, title, data ) {
	showOverlay( ev,
		<CollectionOverlay>
			<ul>{data.collections.map(
				( collection, i ) => <CollectionItem key={i} {...collection} target={title} />
			)}</ul>
		</CollectionOverlay>
	);
}
