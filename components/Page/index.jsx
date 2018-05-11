import React from 'react';
import './styles.less';

export default class Page extends React.Component {
	render() {
		return (
			<div className="page">
				<div className="page__contents">{this.props.children}</div>
			</div>
		);
	}
}
