import React from 'react';
import { Menu, CardGrid, Column, PageBanner, Page } from './../components';

export default class HomePage extends React.Component {
	render() {
		return (
			<Page>
				<Column>
					<Menu username={this.props.meta.username} key="menu" />
					<PageBanner title="Start somewhere" slogan="we will see the world"
						key="banner"
						api="/api/random/en"
					/>
					<CardGrid pages={this.props.pages} key="grid" />
				</Column>
			</Page>
		);
	}
}
