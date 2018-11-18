import React from 'react';
import Row from './../Row';
import Column from './../Column';
import './styles.less';

export default class Page extends React.Component {
	render() {
		return (
			<div className="page" data-title={this.props.title}>
				<Row className="page__contents">{this.props.children}</Row>
				<footer className="grid-row">
					<Column col={2}>
						Someday guide is a <a href="https://jdlrobson.com">Jon Robson</a> and Linz Lim production.
					</Column>
					<Column col={3}>
						<a href="https://github.com/jdlrobson/someday">
							<img width="24" height="24" src="/github.png" />
						</a>
					</Column>
				</footer>
			</div>
		);
	}
}
