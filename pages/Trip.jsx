import React from 'react';
import { Page, Menu, PageBanner, Nav,
	Column, Note, Tab, Icon } from './../components';
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
					<PageBanner title={title} slogan="we will travel"
						api={props.meta.dataUrl}
					/>
					<Nav>
						<Tab>{links}</Tab>
						{props.owner === props.meta.username && <Icon glyph="edit"
							className="action--collection-edit" />}
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
