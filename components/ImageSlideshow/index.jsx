import React from 'react';
import { Icon } from 'wikipedia-react-components';

import './styles.less';

class ImageSlideshow extends React.Component {
	constructor( props ) {
		super( props );
		this.state = {
			numImages: 0,
			activeImage: 0
		};
	}
	onClick( ev ) {
		ev.preventDefault();
		this.props.router.navigateTo( '#/media/' +
			ev.currentTarget.getAttribute( 'href' ).replace( './File:', '' ) );
	}
	_normalize( active ) {
		if ( active < 0 ) {
			active = this.state.numImages - 1;
		} else if ( active > this.state.numImages - 1 ) {
			active = 0;
		}
		this.setState( { activeImage: active } );
	}
	next() {
		this._normalize( this.state.activeImage + 1 );
	}
	prev() {
		this._normalize( this.state.activeImage - 1 );
	}
	componentDidMount() {
		this.setState( { numImages: this.props.images.length } );
	}
	render() {
		var props = this.props;
		var self = this;
		var active = this.state.activeImage;
		var hasMultipleImages = props.images.length > 1;
		var prev = hasMultipleImages ?
			<Icon glyph="arrow-invert" className="arrow-left" onClick={this.prev} /> : null;
		var next = hasMultipleImages ?
			<Icon glyph="arrow-invert" className="arrow-right" onClick={this.next} /> : null;

		return (
			<div className="component-image-slideshow">
				{prev}
				<ul>{props.images.map( function ( img, i ) {
					var src = img.src;
					var className = i === active ? 'active' : '';
					return (
						<li className={className} key={'image-slide-' + i}>
							<a href={'https://wikivoyage.org/wiki/' + img.href}
								onClick={self.onClick} style={{ backgroundImage: `url("${src}")` }}
							>
								<img src={src} alt={img.caption} />
							</a>
						</li>
					);
				} )
				}</ul>
				{next}
			</div>
		);
	}
}
export default ImageSlideshow;
