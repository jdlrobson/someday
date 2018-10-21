import React from 'react';
import './styles.less';

export default function Row( { children } ) {
	return (
		<div className="grid-row">
			{children}
		</div>
	);
}
