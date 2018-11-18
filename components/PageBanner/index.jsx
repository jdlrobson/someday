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
function mapo( lat, lon, zoom, isCountry ) {
	zoom = zoom || zoomo( lat, lon, isCountry );
	return `https://maps.wikimedia.org/img/osm-intl,${zoom},${lat},${lon},1000x500.png?lang=en`;
}

function className( name, modifier ) {
	return modifier ? `${name} ${name}--${modifier}` : name;
}

function headingClassName( len ) {
	return len > 20 ? 'component-page-banner__title--long' : '';
}

export default class PageBanner extends React.Component {
	render() {
		var props = this.props;
		var url = mapo( props.lat || 0, props.lon || 0, props.zoom, props.isCountry );
		var description = props.description;
		var title = props.title && props.title.replace( /_/g, ' ' );
		var leadBannerStyles = {
			backgroundImage: url ? 'url("' + url + '")' : 'none'
		};
		const modifier = props.modifier;

		return (
			<div id="map"
				data-api={props.api}
				data-lat={props.lat || 0}
				data-lon={props.lon || 0}
				data-with-path={props.withPath}
				className={ className( 'component-page-banner', modifier )} onClick={this.navigateTo}>
				<div style={leadBannerStyles} className="component-page-banner__banner">
					<Content>
						<h1 className={ className( 'component-page-banner__site-image', modifier )}>
							<a href="/">
								<img src="/images/someday-map.png" alt='Someday' height="146" width="400" />
							</a>
						</h1>
						<div className={className( 'component-page-banner__subtitle', modifier )}>{props.slogan}</div>
						<div>
							<h2 key="article-title" className={'component-page-banner__title ' + headingClassName( title.length )}
								id="section_0">{title}</h2>
							<p>{description}</p>
						</div>
					</Content>
					<div id="pagebanner__map-toolbar"></div>
				</div>
				<div className="component-page-banner__search" id="search">
					Somewhere else
					<Icon glyph="search" />
				</div>
			</div>
		);
	}
}
