import React from 'react';
import { Card } from 'wikipedia-react-components';
import './styles.less';

export default function CardGrid( { pages } ) {
	return (
		<div className="card-grid">
			{
				pages.map( ( page, i ) => <Card title={page.title} thumbnail={page.thumbnail}
					className="card-grid__card"
					key={`card-grid-${i}`}
					url={'/destination/' + encodeURIComponent( page.title ) } /> )
			}
		</div>
	);
}
