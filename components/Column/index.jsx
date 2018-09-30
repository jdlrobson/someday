import React from 'react';
import './styles.less';

export default function Column( { children, col = 2 } ) {
	return (
		<div className={'grid-column grid-column-' + col}>
			{children}
		</div>
	);
}
