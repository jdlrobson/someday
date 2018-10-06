import React from 'react';
import { Page, Menu, PageBanner, Column, Note, ImageSlideshow } from './../components';

export default class Sight extends React.Component {
	render() {
		const { extract, titles, displaytitle, coordinates, thumbnail } = this.props;
		const lat = coordinates && coordinates.lat;
		const lon = coordinates && coordinates.lon;
		return (
			<Page>
				<Column>
					<Menu username={this.props.meta.username} />
					<PageBanner title={displaytitle} slogan="we will visit"
						lat={lat}
						lon={lon}
					/>
					<Note><p>{extract}</p></Note>
					<Note>
						<p>More information available on <a
							href={`https://en.wikipedia.org/wiki/${titles.canonical}`}>Wikipedia</a></p>
						{
							lat &&
								( <p><a href={`geo:${lat},${lon}`}>Load in maps</a></p> )
						}
					</Note>
				</Column>
				<Column col={3}>
					<ImageSlideshow images={[ thumbnail ]} key="img-slideshow" />
				</Column>
			</Page>
		);
	}
}
