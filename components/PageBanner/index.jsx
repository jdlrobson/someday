import React from 'react';
import { Icon, Content } from 'wikipedia-react-components';

import './styles.less';

function zoomo( lat, lon, isCountry ) {
	let zoom = lat === 0 && lon === 0 ? 1 : 10;
	if ( isCountry ) {
		if ( lon > 99 && lon < 104 && lat > 34 && lat < 63 ) {
			// China, Russia
			zoom = 3;
		} else if ( lon > -8 && lon < 79 && lat > 20 && lat < 34 ) {
			// Northern Africa, India, Pakistan, Iran, Iraq
			zoom = 5;
		} else if ( lat > -30 && lat < -20 && lon > 20 && lon < 25 ) {
			// South Africa
			zoom = 5;
		} else if ( lat > 23 && lat < 68 && lon < -90 ) {
			// USA, Canada, Mexico
			zoom = 3;
		} else if ( lat > -15 && lat < -13 && lon > -54 && lon < -52 ) {
			// Brazil
			zoom = 4;
		} else if ( lat > -35 && lat < -8 && lon > -77 && lon < -50 ) {
			// Chile, Argentina, Uruguay, Peru
			zoom = 5;
		} else {
			zoom = 8;
		}
	}
	return zoom;
}
function mapo( lat, lon, isCountry ) {
	const zoom = zoomo( lat, lon, isCountry );
	return `https://maps.wikimedia.org/img/osm-intl,${zoom},${lat},${lon},1000x500.png?lang=en`;
}

export default class PageBanner extends React.Component {
	render() {
		var props = this.props;
		var url = mapo( props.lat || 0, props.lon || 0, props.isCountry );
		var description = props.description;
		var title = props.title && props.title.replace( /_/g, ' ' );
		var leadBannerStyles = {
			backgroundImage: url ? 'url("' + url + '")' : 'none'
		};

		const bannerClassName = props.inSearchMode ? ' banner-search-enabled' : '';
		return (
			<div id="map"
				data-api={props.api}
				data-lat={props.lat || 0}
				data-lon={props.lon || 0}
				data-with-path={props.withPath}
				className={'component-page-banner' + bannerClassName} onClick={this.navigateTo}>
				<div style={leadBannerStyles} className="component-page-banner__banner">
					<Content>
						<h1 className="component-page-banner__site-image">
							<img src="/images/someday-map.png" alt='Someday' height="146" width="400" />
						</h1>
						<div className="component-page-banner__subtitle">{props.slogan}</div>
						<div>
							<h2 key="article-title" className={'component-page-banner__title ' + bannerClassName}
								id="section_0">{title}</h2>
							<p>{description}</p>
						</div>
					</Content>
				</div>
				<div className="component-page-banner__search" id="search">
					Somewhere else
					<Icon glyph="search" />
				</div>
			</div>
		);
	}
}
