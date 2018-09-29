import React from 'react';
import { Page, Menu, PageBanner, Nav,
	Column, Note, Card, Tab } from './../components';

export const getOwnerUrl = ( owner ) => {
	const ownerEnc = encodeURIComponent( owner );
	return `/trips/${ownerEnc}`;
};
export const getTripUrl = ( owner, id ) => `${getOwnerUrl( owner )}/${id}`;

const collectionToCard = ( { title, thumbnail, description, owner, id }, key ) => {
	const ownerEl = <span>by <a href={getOwnerUrl( owner )}>{owner}</a></span>;
	return <Card title={title} thumbnail={thumbnail}
		url={getTripUrl( owner, id )} key={key}
		extracts={[ description, ownerEl ]} />;
};

export default class Trips extends React.Component {
	render() {
		const props = this.props;
		const owner = props.owner;
		let links;
		if ( owner ) {
			links = [
				<a href="/trips/">All</a>,
				<a href={getOwnerUrl( props.owner )}
					className="active">{props.owner}</a>
			];
		} else {
			links = [
				<a href="/trips/" className="active">All</a>,
				<span>&nbsp;</span>
			];
		}

		return (
			<Page>
				<Column>
					<Menu username={props.meta.username} />
					<PageBanner title="someday" slogan="we will go on a trip"
						api={props.meta.dataUrl}
					/>
					<Nav>
						<Tab>{links}</Tab>
					</Nav>
					<Note>
						{props.collections.map( ( collection, i ) =>
							collectionToCard( collection, `card-${i}` ) )}
					</Note>
				</Column>
			</Page>
		);
	}
}
