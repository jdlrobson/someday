import React from 'react';
import './styles.less';

export default function Note( { children } ) {
	return (
		<div className="note">
			{children}
		</div>
	);
}
