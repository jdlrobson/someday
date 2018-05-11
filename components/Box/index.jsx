import React from 'react';
import './styles.less';

export default ( { title, children, scrollable } ) => {
	const modifierClass = scrollable ? 'box__content--scrollable' : '';
	return (
		<div className="box">
			<h2 className="box__title">{title}</h2>
			<div className={"box__content " + modifierClass}>{children}</div>
		</div>
	);
};
