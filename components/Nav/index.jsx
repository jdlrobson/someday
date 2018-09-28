import React from 'react';
import './styles.less';

export default function Nav( { children } ) {
	return (
		<div className="nav">{children}</div>
	);
}
