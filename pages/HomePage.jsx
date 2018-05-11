import React from 'react';
import { Menu, CardGrid, Column, PageBanner, Page } from './../components';

export default class HomePage extends React.Component {
	render() {
		return (
			<Page>
				<Column>
					<Menu />
					<PageBanner title="Start somewhere" slogan="we will see the world" />
					<CardGrid pages={this.props.pages} />
				</Column>
			</Page>
		);
	}
}
