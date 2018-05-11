import React from 'react';
import './styles.less';

export default ( { children } ) => {
	return (
		<div className="note">
			{children}
		</div>
	);
};
