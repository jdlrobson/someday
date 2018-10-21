import React from 'react';
import './styles.less';

export default function Row( { children, row = 1 } ) {
	return (
		<div className={'grid-row grid-row--' + row }>
			{children}
		</div>
	);
}
