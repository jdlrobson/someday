import React from 'react';
import { Page, Menu, PageBanner, Column, Note, ImageSlideshow } from './../components';

export default class Sight extends React.Component {
	render() {
		const { lead, meta } = this.props;
		const { title, images, extract,
			displaytitle, coordinates, thumbnail } = lead;
		const { params } = meta;
		const dest = params.dest;
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
					<Note>
						<h2>{displaytitle}</h2>
						<strong><a href={'/destination/' + dest}>{dest}</a></strong>
						<p>{extract}</p>
					</Note>
					<Note>
						<p>More information available on <a
							href={`https://en.wikipedia.org/wiki/${title}`}>Wikipedia</a></p>
						{
							lat &&
								( <p><a href={`geo:${lat},${lon}`}>Load in maps</a></p> )
						}
					</Note>
				</Column>
				<Column col={3}>
					{thumbnail && <ImageSlideshow images={[ thumbnail ].concat( images )}
						key="img-slideshow" />}
				</Column>
			</Page>
		);
	}
}
