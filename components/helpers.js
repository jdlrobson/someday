import React from 'react';
import { Card } from './../components';

const toFixedKm = ( km ) => km > 9 ? Math.round( km ) : km.toFixed( 2 );

const coordinatesToLabel = ( coordinates ) => coordinates && coordinates.dist !== undefined ?
	toFixedKm( coordinates.dist / 1000 ) + 'km' : null;

export const placeToCard = ( { title, thumbnail, description, coordinates }, key ) => {
	return <Card title={title} thumbnail={thumbnail}
		key={`place-${key}`}
		url={'/destination/' + encodeURIComponent( title ) }
		extracts={[ description, coordinatesToLabel( coordinates ) ]} />;
};
