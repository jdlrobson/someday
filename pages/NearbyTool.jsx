import React from 'react';
import { Page, Menu, Column, Note } from './../components';

export default class ClimateTool extends React.Component {
	render() {
		const { meta, pages } = this.props;
		const title = meta.params.title;
		const text = pages.map(( page ) => {
			return `* [[${page.title}]] - ${page.description}`;
		}).join( '\n' );
		return (
			<Page>
				<Column key="col-2">
					<Menu username={this.props.meta.username} key="menu" />
					<Note>
						<h2 key="climate-tool-0">Nearby tool</h2>
						<h3>
							<a href={`https://en.wikivoyage.org/wiki/${title}`}>{title}</a>
						</h3>
						<p>You can copy and paste this into the Wikivoyage article to render a list of nearby places</p>
						<textarea key="nearby-tool-1"
							rows={100} defaultValue={text}></textarea>
						<a href={`/destination/${title}`}>on someday</a>
					</Note>
				</Column>
			</Page>
		);
	}
}
