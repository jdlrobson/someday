import React from 'react';
import { Page, Menu, PageBanner, Nav,
	Column, Note, Tab } from './../components';
import { placeToCard } from './Destination';
import { getOwnerUrl, getTripUrl } from './Trips';

export default class Trip extends React.Component {
	render() {
		const props = this.props;
		const title = props.title;
		const owner = props.owner;
		const links = [
			<a href={getOwnerUrl( owner )}>{owner}</a>,
			<a href={getTripUrl( owner )}
				className="active">{title}</a>
		];
		return (
			<Page>
				<Column>
					<Menu username={props.meta.username} />
					<PageBanner title={title} slogan="we will travel" />
					<Nav>
						<Tab>{links}</Tab>
					</Nav>
					<Note>
						{props.pages.map( ( collection, i ) =>
							placeToCard( collection, `trip-card-${i}` ) )}
					</Note>
				</Column>
			</Page>
		);
	}
}
