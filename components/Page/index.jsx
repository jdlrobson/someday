import React from 'react';
import './styles.less';

export default class Page extends React.Component {
	render() {
		return (
			<div className="page" data-title={this.props.title}>
				<div className="page__contents">{this.props.children}</div>
			</div>
		);
	}
}
