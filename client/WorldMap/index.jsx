import React from 'react';
import { divIcon, icon } from 'leaflet';
import { Map, Marker, Popup, TileLayer, Polyline } from 'react-leaflet';
import { IntermediateState, Card } from 'wikipedia-react-components';

import calculateBoundsFromPages from './calculate-bounds-from-pages';

import './styles.less';
import 'leaflet/dist/leaflet.css';

function calculateDistance( from, to ) {
	const toRadians = Math.PI / 180,
		radius = 6378.1; // radius of Earth in km
	let distance, a,
		deltaLat, deltaLng,
		startLat, endLat,
		haversinLat, haversinLng;

	if ( from[ 0 ] === to[ 0 ] && from[ 1 ] === to[ 1 ] ) {
		distance = 0;
	} else {
		deltaLat = ( to[ 1 ] - from[ 1 ] ) * toRadians;
		deltaLng = ( to[ 0 ] - from[ 0 ] ) * toRadians;
		startLat = from[ 0 ] * toRadians;
		endLat = to[ 0 ] * toRadians;

		haversinLat = Math.sin( deltaLat / 2 ) * Math.sin( deltaLat / 2 );
		haversinLng = Math.sin( deltaLng / 2 ) * Math.sin( deltaLng / 2 );

		a = haversinLat + Math.cos( startLat ) * Math.cos( endLat ) * haversinLng;
		return 2 * radius * Math.asin( Math.sqrt( a ) );
	}
	return distance;
}

class WorldMap extends React.Component {
	constructor( props ) {
		super( props );
		this.state = {
			markers: [],
			titles: {}
		};
	}
	loadMarkers( pages ) {
		const self = this;
		const props = this.props;
		const markers = this.state.markers || [];
		const titles = this.state.titles || {};
		const bounds = calculateBoundsFromPages( pages );

		pages.forEach( function ( page ) {
			let marker, size, iconSize;
			const c = page.coordinates;
			if ( c && !titles[ page.title ] ) {
				marker = {
					page: page,
					lat: c.lat,
					lng: c.lng || c.lon,
					label: <Card title={page.title} extracts={[ page.description ]}
						url={`/destination/${page.title}`}
					/>
				};
				if ( page.category ) {
					marker.icon = divIcon( {
						className: 'mw-ui-icon mw-ui-icon-element mw-ui-icon-' + page.category
					} );
				} else {
					size = page.pageassessments && page.pageassessments.city && page.pageassessments.city.class || 'usable';
					if ( size === 'usable' ) {
						iconSize = [ 25, 41 ];
					} else if ( size === 'outline' ) {
						iconSize = [ 12, 20 ];
					} else {
						iconSize = [ 19, 30 ];
					}
					marker.icon = icon( {
						iconUrl: props.markerUrl,
						iconSize: iconSize
					} );
				}
				titles[ page.title ] = true;
				markers.push( marker );
			}
		} );
		if ( pages.length > 1 ) {
			self.setState( {
				bounds: bounds
			} );
		}
		self.setState( {
			titles: titles,
			markers: markers
		} );
	}
	componentDidMount() {
		const props = this.props;
		const lat = props.lat;
		const lng = props.lon;
		const pages = props.pages || [];
		const title = props.title;
		const page = title ? { title, coordinates: { lat: lat, lng: lng } } : null;

		this.setState( {
			markers: [],
			lat: lat || 0,
			lon: lng || 0,
			zoom: this.props.zoom
		} );
		this.loadMarkers( pages );
		if ( page ) {
			this.loadMarkers( [ page ] );
		}
	}
	doDrag() {
		if ( this.props.explorable ) {
			this.setState( { initialised: true } );
			const center = this.L.getCenter();
			this.props.onExplore(
				center.lat, center.lng,
				this.loadMarkers.bind( this )
			);
		}
	}
	render() {
		let position, mapOptions;
		const zoom = this.state.zoom || 1;
		const state = this.state || {};
		const markers = state.markers || [];
		const lat = this.state.lat;
		const lng = this.state.lon;
		const bounds = this.state.bounds;

		if ( lat !== undefined && lng !== undefined ) {
			position = [ lat, lng ];
			mapOptions = {
				center: position,
				zoom: zoom,
				ref: ( ref ) => {
					this.L = ref && ref.leafletElement;
				},
				onDragend: this.doDrag.bind( this ),
				boundOptions: { padding: [ 50, 50 ] }
			};
			if ( bounds && markers.length && !this.state.initialised ) {
				mapOptions.bounds = [ bounds.southWest, bounds.northEast ];
			}

			const polyLines = [];

			let last, lastPage;
			if ( !this.props.explorable ) {
				markers.forEach( function ( marker, i ) {
					const cur = [ marker.lat, marker.lon || marker.lng ];
					if ( last ) {
						polyLines.push(
							<Polyline positions={[ last, cur ]} color='#00ab9f' weight={( i * 0.2 ) + 1}
								key={'polyline-' + i}>
								<Popup key={'polyline-popup-' + i}>
									<Card title={`${lastPage.title} to ${marker.page.title}`}
										extracts={[ Math.floor( calculateDistance( last, cur ) ) + 'km' ]} url={'#'} />
								</Popup>
							</Polyline>
						);
					}
					lastPage = marker.page;
					last = cur;
				} );
			}

			return (
				<Map {...mapOptions}>
					<TileLayer
						url='https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png?lang=en'
						attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
					/>
					{
						markers.map( function ( marker, i ) {
							let popup;
							const markerProps = {
								key: 'marker-' + i,
								position: [ marker.lat, marker.lon || marker.lng ],
								options: {}
							};
							if ( marker.icon ) {
								markerProps.icon = marker.icon;
							}
							if ( marker.label ) {
								popup = <Popup>{marker.label}</Popup>;
							}
							return (
								<Marker {...markerProps}>{popup}</Marker>
							);
						} )
					}
					{polyLines}
				</Map>
			);
		} else {
			return <IntermediateState />;
		}
	}
}

WorldMap.defaultProps = {
	title: undefined, // if added will add a marker to the given lat+lon
	pages: undefined, // array of pages to be loaded as markers
	'continue': false,
	initialised: false,
	explorable: true,
	zoom: 1
};

export default WorldMap;
