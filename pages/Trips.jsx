import React from 'react';
import { Page, Menu, PageBanner, Nav,
	OfflineBanner,
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
				<a href="/trips/" key="tab-all">All</a>,
				<a href={getOwnerUrl( props.owner )}
					key="tab-owner"
					className="active">{props.owner}</a>
			];
		} else {
			links = [
				<a href="/trips/" className="active" key="tab-all">All</a>,
				<span key="tab-owner">&nbsp;</span>
			];
		}

		return (
			<Page>
				<Column>
					<Menu username={props.meta.username} />
					<PageBanner title={owner || 'everyone'} slogan="trips from"
						modifier={'faded'}
						api={props.meta.dataUrl}
					/>
					<Nav>
						<Tab>{links}</Tab>
					</Nav>
					<Note>
						{props.collections.map( ( collection, i ) =>
							collectionToCard( collection, `card-${i}` ) )}
					</Note>
					{owner && <OfflineBanner />}
				</Column>
			</Page>
		);
	}
}
