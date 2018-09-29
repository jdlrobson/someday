import React from 'react';
import { Menu, CardGrid, Column, PageBanner, Page } from './../components';

export default class HomePage extends React.Component {
	render() {
		return (
			<Page>
				<Column>
					<Menu username={this.props.meta.username} />
					<PageBanner title="Start somewhere" slogan="we will see the world"
						api="/api/random/en"
					/>
					<CardGrid pages={this.props.pages} />
				</Column>
			</Page>
		);
	}
}
