import React from 'react';
import { Icon, Content } from 'wikipedia-react-components';

import './styles.less';

function mapo( coords, zoom, w, h ) {
	var lat = coords.lat,
		lon = coords.lon,
		src = 'https://maps.wikimedia.org/img/osm-intl,' + zoom + ',' + lat + ',' + lon + ',' + w + 'x' + h + '.png';

	return src;
}

export default class PageBanner extends React.Component {
	render() {
		var url = 'https://maps.wikimedia.org/img/osm-intl,1,0,0,1000x500.png';
		var props = this.props;
		var title = props.title && props.title.replace( /_/g, ' ' );
		if ( props.coordinates ) {
			const coords = props.coordinates;

			if ( coords.lat !== undefined && coords.lon !== undefined ) {
				url = mapo( coords, 1, 1000, 500 );
			}
		}
		var leadBannerStyles = {
			backgroundImage: url ? 'url("' + url + '")' : 'none'
		};

		const bannerClassName = props.inSearchMode ? ' banner-search-enabled' : '';
		return (
			<div className={'component-page-banner' + bannerClassName} onClick={this.navigateTo}>
				<div style={leadBannerStyles}>
					<img src="/marker-icon.png" className="map-marker" />
					<Content>
						<h1 className="component-page-banner__site-image">
							<img src="/images/someday-map.png" alt='Someday' height="138" width="270" />
						</h1>
						<div className="component-page-banner__subtitle">{props.slogan}</div>
						<div>
							<h2 key="article-title" className={'component-page-banner__title ' + bannerClassName}
								id="section_0"><a href="#/search/">{title}</a></h2>
							<Icon glyph="search" href="#/search/" className="g" label="search" />
						</div>
					</Content>
				</div>
			</div>
		);
	}
}
