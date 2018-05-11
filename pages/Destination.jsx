import React from 'react';
import { Page, Menu, CardGrid, PageBanner, Column, Box, Climate,
    Card, Note, ImageSlideshow } from './../components';

const toFixedKm = (km) => km > 9 ? Math.round(km) : km.toFixed(2);

const coordinatesToLabel = (coordinates) => coordinates && coordinates.dist !== undefined ?
    toFixedKm( coordinates.dist / 1000 ) + 'km' : null;

const sightToCard = (destTitle) => {
    return ( { title, thumbnail, description } ) => <Card title={title} thumbnail={thumbnail}
        url={encodeURIComponent(destTitle) + '/sight/' + encodeURIComponent( title ) } extracts={[description]}     />;
};

const placeToCard = ( { title, thumbnail, description, coordinates } ) => <Card title={title} thumbnail={thumbnail}
        url={'/destination/' + encodeURIComponent( title ) } extracts={[description, coordinatesToLabel(coordinates)]} />;

        const placeToCardWithoutDestination = (data) =>
        placeToCard(Object.assign({}, data, { coordinates: undefined } ));

        const sectionToBoxData = ( { line,  destinations } ) => [
    line, destinations.map( placeToCard )
]

const sectionToBoxDataNoDistance = ( { line,  destinations } ) => [
    line, destinations.map( placeToCardWithoutDestination )
]

function leftBoxes( lead ) {
    const { isRegion, isCountry, destinations, sights } = lead;
    let boxes = [];
    if ( isCountry ) {
        boxes = boxes.concat(
            destinations.map( sectionToBoxDataNoDistance )
        );
    } else {
        if ( sights && sights.length ) {
            boxes.push( [ 'Sights', sights.map( sightToCard(lead.normalizedtitle) ) ] );
        }
        if ( destinations ) {
            boxes = boxes.concat(
                destinations.map( sectionToBoxData )
            );
        }
    }
    return boxes.map(([ title, children ]) => {
        return <Box title={title} scrollable={true}>{children}</Box>;
    });
}

function rightBoxes(lead) {
    const { transitLinks, airports, isRegion, isCountry } = lead;
    let boxes = [];

    if ( !isCountry && !isRegion ) {
        boxes = boxes.concat(
            <Box title="Climate">
                <Climate climate={lead.climate} />
            </Box>
        );
    }
    if ( airports.length ) {
        boxes = boxes.concat(
            <Box title="Airports" scrollable={true}><ul>{
                airports.map((code) =>
                    <li><a target="_blank"
                        href={`https://www.rome2rio.com/map/${code}`}>{code}</a></li>
                )
            }</ul></Box>
            
        );
    }
    if ( transitLinks.length ) {
        boxes = boxes.concat(
            <Box title="Get around" scrollable={true}><ul>{
                transitLinks.map(({href, text}) =>
                    <li><a href={href}>{text}</a></li>
                )
            }</ul></Box>
        );
    }
    return [
        <ImageSlideshow images={lead.images} />
    ].concat( boxes );
}
export default class HomePage extends React.Component {
  render() {
    const lead = this.props.lead;
    const { paragraph } = lead;
    return (
      <Page>
        <Column col={1}>{leftBoxes( lead )}</Column>
        <Column>
          <Menu />
          <PageBanner title={lead.displaytitle} slogan="we will see" />
          <Note><p dangerouslySetInnerHTML={{ __html: paragraph }}></p></Note>
          <Note>
        <p>More information available on <a
            href={'https://wikivoyage.org/wiki/' + lead.normalizedtitle}>Wikivoyage</a></p>
        </Note>
        </Column>
        <Column col={3}>{rightBoxes(lead)}</Column>
      </Page>
    );
  }
}
