import React from 'react';
import { Page, Menu, PageBanner, Nav,
	OfflineBanner,
	Column, Note, Tab, Icon } from './../components';
import { placeToCard } from './../components/helpers';
import { getOwnerUrl, getTripUrl } from './Trips';

export default class Trip extends React.Component {
	render() {
		const props = this.props;
		const title = props.title;
		const owner = props.owner;
		const links = [
			<a href={getOwnerUrl( owner )} key="tab-owner">{owner}</a>,
			<a href={getTripUrl( owner )} key="tab-trip"
				className="active">{title}</a>
		];
		return (
			<Page data-title={`Trip:${owner}/${props.id}`}>
				<Column>
					<Menu username={props.meta.username} />
					<PageBanner title={title} slogan="we will travel"
						withPath={true}
						api={props.meta.dataUrl}
					/>
					<Nav>
						<Icon glyph="note"
							key="action-1"
							label="make a note"
							className="action--add-note" />
						<Tab>{links}</Tab>
						{props.owner === props.meta.username && <Icon glyph="edit"
							className="action--collection-edit" />}
					</Nav>
					<Note>
						{props.pages.map( ( collection, i ) =>
							placeToCard( collection, `trip-card-${i}` ) )}
					</Note>
					{owner && <OfflineBanner />}
				</Column>
			</Page>
		);
	}
}
