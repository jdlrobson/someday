import React from 'react';
import { Page, Menu, Column, Note } from './../components';

export default class ClimateTool extends React.Component {
	render() {
		const { text, meta } = this.props;
		const title = meta.params.title;
		return (
			<Page>
				<Column key="col-2">
					<Menu username={this.props.meta.username} key="menu" />
					<Note>
						<h2 key="climate-tool-0">Climate data</h2>
						<h3>
							<a href={`https://en.wikivoyage.org/wiki/${title}`}>{title}</a>
						</h3>
						<p>You can copy and paste this into the Wikivoyage article to render a climate table.</p>
						<textarea key="climate-tool-1"
							rows={100} defaultValue={text}></textarea>
						<a href={`/destination/${title}`}>on someday</a>
					</Note>
				</Column>
			</Page>
		);
	}
}
