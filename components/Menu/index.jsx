import React from 'react';
import { HorizontalList } from 'wikipedia-react-components';

import './styles.less';

export default () => {
	return (
		<div className="menu">
			<HorizontalList>
				{
					[
						<a className="menu__link" href="/" key="menu-1">Home</a>
					]
				}
			</HorizontalList>
		</div>
	);
};
