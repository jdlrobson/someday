import React from 'react';
import { Card } from 'wikipedia-react-components';
import './styles.less';

export default ( { pages } ) => {
	return (
		<div className="card-grid">
			{
				pages.map( ( page ) => <Card title={page.title} thumbnail={page.thumbnail}
					className="card-grid__card"
					url={'/destination/' + encodeURIComponent( page.title ) } /> )
			}
		</div>
	);
};
