import React from 'react';
import './styles.less';

export default ( { children, col = 2 } ) => {
	return (
		<div className={'grid-column grid-column-' + col}>
			{children}
		</div>
	);
};
