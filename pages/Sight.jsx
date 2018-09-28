import React from 'react';
import { Page, Menu, PageBanner, Column, Note } from './../components';

export default class Sight extends React.Component {
	render() {
		const lead = this.props.lead;
		const { paragraph, coordinates } = lead;
		return (
			<Page>
				<Column>
					<Menu />
					<PageBanner title={lead.displaytitle} slogan="we will visit" />
					<Note><p dangerouslySetInnerHTML={{ __html: paragraph }}></p></Note>
					<Note>
						<p>More information available on <a
							href={'https://wikipedia.org/wiki/' + lead.normalizedtitle}>Wikipedia</a></p>
						{
							coordinates.lat &&
                ( <p><a href={`geo:${coordinates.lat},${coordinates.lon}`}>Load in maps</a></p> )
						}
					</Note>
				</Column>
			</Page>
		);
	}
}
