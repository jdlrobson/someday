import React from 'react';
import { Card } from './../components';

const toFixedKm = ( km ) => km > 9 ? Math.round( km ) : km.toFixed( 2 );

const coordinatesToLabel = ( coordinates ) => coordinates && coordinates.dist !== undefined ?
	toFixedKm( coordinates.dist / 1000 ) + 'km' : null;

export const placeToCard = ( { title, thumbnail, description, missing, coordinates }, key ) => {
	return <Card title={title} thumbnail={thumbnail}
		className={missing ? ' card-place--missing' : 'card-place' }
		key={`place-${key}`}
		url={'/destination/' + encodeURIComponent( title.replace(/ /g, '_' ) )}
		extracts={[ description, coordinatesToLabel( coordinates ) ]} />;
};
