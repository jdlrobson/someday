import React from 'react';
import { Icon, TruncatedText } from 'wikipedia-react-components';

import './styles.less';

class ImageSlideshow extends React.Component {
	render() {
		var props = this.props;
		var hasMultipleImages = props.images.length > 1;

		const maxHeight = props.images.length ? props.images.map( image => parseInt( image.height, 10 ) )
			.reduce( ( prev, currentValue ) => {
				return !prev || prev < currentValue ?
					currentValue : prev;
			} ) : 0;
		return (
			<div className="component-image-slideshow">
				<ul key="component-image-slideshow-list">
					{props.images.map( function ( img, i ) {
						var src = img.src || img.source;
						const key = `image-slide-${i}`;
						var className = i === 0 ? 'active' : '';
						return (
							<li className={className} key={key}
								style={
									{
										height: maxHeight + 'px'
									}
								}
							>
								{hasMultipleImages &&
								<Icon className="arrow-left" glyph="arrow-invert" />
								}
								<div
									style={{
										backgroundRepeat: 'no-repeat',
										backgroundSize: 'contain',
										height: '100%',
										backgroundPosition: 'center',
										width: '100%',
										margin: 'auto',
										backgroundImage: `url("${src}")`
									}}
								>
									<a className="caption"
										href={`https://wikivoyage.org/wiki/${img.href}`}>
										<TruncatedText>{img.caption || 'View original image'}</TruncatedText>
									</a>
								</div>
								{hasMultipleImages &&
								<Icon className="arrow-right" glyph="arrow-invert" />
								}
							</li>
						);
					} )
					}</ul>
			</div>
		);
	}
}
export default ImageSlideshow;
