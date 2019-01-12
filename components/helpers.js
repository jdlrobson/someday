import React from 'react';
import { Card } from './../components';
import 'wikipedia-react-components/components/Card/styles.less';
import 'wikipedia-react-components/components/TruncatedText/styles.less';

const toFixedKm = ( km ) => km > 9 ? Math.round( km ) : km.toFixed( 2 );

const coordinatesToLabel = ( coordinates ) => coordinates && coordinates.dist !== undefined ?
	toFixedKm( coordinates.dist / 1000 ) + 'km' : null;

const EXTERNAL_LINK_THUMBNAIL = {
	width: 240,
	height: 240,
	source: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/External_Link_%2889628%29_-_The_Noun_Project.svg/240px-External_Link_%2889628%29_-_The_Noun_Project.svg.png'
};

export const selectThumbnail = ( { external, thumbnail } ) => {
	if ( !thumbnail && external ) {
		return EXTERNAL_LINK_THUMBNAIL;
	} else {
		return thumbnail;
	}
};

export const placeToCard = ( { title, url,
	thumbnail, external, description, missing, coordinates }, key ) => {
	return <Card title={title}
		thumbnail={selectThumbnail({thumbnail, external})}
		className={missing ? ' card-place--missing' : 'card-place' }
		key={`place-${key}`}
		url={url || '/destination/' + encodeURIComponent( title.replace(/ /g, '_' ) )}
		extracts={[ description, coordinatesToLabel( coordinates ) ]} />;
};
