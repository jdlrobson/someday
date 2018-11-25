import React from 'react';
import { Page, Menu, PageBanner, Column, Box, Climate,
	Icon, Nav, OfflineBanner, ArrivalInformation,
	Card, Note, ImageSlideshow } from './../components';
import { placeToCard } from './../components/helpers';

const EXTERNAL_LINK_THUMBNAIL = {
	width: 240,
	height: 240,
	source: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/External_Link_%2889628%29_-_The_Noun_Project.svg/240px-External_Link_%2889628%29_-_The_Noun_Project.svg.png'
};
const sightToCard = ( destTitle, i ) => {
	return ( { title, thumbnail, description, external, url } ) => {
		url = url || `/destination/${encodeURIComponent( destTitle )}/sight/${encodeURIComponent( title )}`;
		if ( !thumbnail && external ) {
			thumbnail = EXTERNAL_LINK_THUMBNAIL;
		}
		return <Card title={title} thumbnail={thumbnail}
			key={`sight-${i}`}
			url={url}
			extracts={[ description ]} />;
	};
};

const placeToCardWithoutDestination = ( data, i ) =>
	placeToCard( Object.assign( {}, data, { coordinates: undefined } ), i );

const editButton = ( id ) =>
	<button data-id={id} className="edit-link" key={'edit-' + id}>edit</button>;

const sectionToBoxData = ( { line, destinations, id } ) => {
	let links;
	if ( destinations.length ) {
		links = destinations.map( placeToCard );
	} else {
		links = [ <div key={'tumbleweed-' + id}>Tumbleweed</div> ];
	}
	return [
		line,
		links.concat( editButton( id ) )
	];
};

const sectionToBoxDataNoDistance = ( { line, destinations }, i ) => [
	line, destinations.map( placeToCardWithoutDestination, i )
];

function leftBoxes( lead ) {
	const { isCountry, destinations, sights, disambiguation, section_ids } = lead;
	let boxes = [];

	if ( isCountry ) {
		boxes = boxes.concat(
			destinations.map( sectionToBoxDataNoDistance )
		);
	} else {
		boxes = boxes.concat(
			destinations.map( sectionToBoxData )
		);
	}
	if ( !disambiguation && sights ) {
		boxes.push( [
			'Sights',
			sights.map(
				sightToCard( lead.title )
			).concat(
				editButton( section_ids.sights )
			)
		] );
	}
	return boxes.map( ( [ title, children ], i ) => {
		return <Box key={`box-${i}`} title={title} scrollable={true}>{children}</Box>;
	} );
}

function rightBoxes( lead ) {
	const { transitLinks, airports, climate, disambiguation, isCountry, isRegion } = lead;
	let boxes = [];

	if ( climate && climate.id && !isCountry && !isRegion ) {
		boxes = boxes.concat(
			<Box title="Climate" key="climate-box">
				<Climate key="climate-child" {...climate}/>
				{editButton( climate.id )}
			</Box>
		);
	}
	if ( airports.length ) {
		boxes = boxes.concat(
			<Box title="Airports" scrollable={true} key="airport-box"><ul>{
				airports.map( ( code, i ) =>
					<li key={`airport-${i}`}><a target="_blank"
						href={`https://www.rome2rio.com/map/${code}`}>{code}</a></li>
				)
			}</ul></Box>

		);
	}
	if ( transitLinks.length ) {
		boxes = boxes.concat(
			<Box title="Get around" scrollable={true} key="get-around-box"><ul>{
				transitLinks.map( ( { href, text }, i ) =>
					<li key={`transit-link-${i}`}><a href={href}>{text}</a></li>
				)
			}</ul></Box>
		);
	}
	if ( disambiguation ) {
		return [];
	} else {
		return [
			<ImageSlideshow images={lead.images} key="img-slideshow" />
		].concat( boxes );
	}
}
export default class DestinationPage extends React.Component {
	render() {
		const lead = this.props.lead;
		const { paragraph, coordinates, arrival, tipping } = lead;
		return (
			<Page title={lead.title}>
				<Column key="col-1" col={1}>{leftBoxes( lead )}</Column>
				<Column key="col-2">
					<Menu username={this.props.meta.username} key="menu" />
					<PageBanner title={lead.displaytitle} slogan="guide to"
						key="banner"
						description={lead.description}
						isCountry={lead.isCountry}
						lat={coordinates && coordinates.lat}
						lon={coordinates && coordinates.lon}
					/>
					<Nav key="nav">
						<Icon glyph="note"
							key="action-1"
							label="make a note"
							className="action--add-note" />
						<Icon glyph="add-trip"
							label="add to trip"
							key="action-2"
							className="action--add-trip" />
					</Nav>
					<Note key="note-2">
						<p key="note-2-1" dangerouslySetInnerHTML={{ __html: paragraph }}></p>
					</Note>
					<ArrivalInformation key="arrival" sections={arrival}></ArrivalInformation>
					{
						tipping && ( <div>
							<h2 className="section__heading">Tipping</h2>
							<Note>
								<p>{tipping.text}</p>
							</Note>
						</div> )
					}
					<Note key="note-3">
						<p key="note-3-1">More information available on <a
							href={'https://wikivoyage.org/wiki/' + lead.title}>Wikivoyage</a></p>
					</Note>
					<OfflineBanner />
				</Column>
				<Column col={3} key="col-3">{rightBoxes( lead )}</Column>
			</Page>
		);
	}
}
