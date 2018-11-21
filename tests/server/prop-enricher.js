var assert = require( 'assert' );
import { mergePages } from './../../server/endpoints/prop-enricher';

const SAFARI_THUMB = {
	source: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Entrance_of_Night_Safari%2C_Singapore%2C_2012.jpg/120px-Entrance_of_Night_Safari%2C_Singapore%2C_2012.jpg',
	width: 120,
	height: 80,
	title: 'File:Entrance_of_Night_Safari,_Singapore,_2012.jpg'
};

describe( 'prop-enricher', () => {
	it( 'mergePages', () => {
		const examples = [
			[
				[
					{ title: 'Night Safari, Singapore' },
					{ title: 'Night Safari (Singapore)' }
				],
				[
					{
						title: 'Night Safari, Singapore',
						thumbnail: SAFARI_THUMB
					},
					{
						title: 'Night Safari (Singapore)',
						thumbnail: SAFARI_THUMB
					}
				],
				[
					{ from: 'Orchard Road, Singapore', to: 'Orchard Road' },
					{ from: 'Marina Bay (Singapore)', to: 'Marina Bay, Singapore' },
					{ from: 'Night Safari (Singapore)',
						to: 'Night Safari, Singapore' },
					{ from: 'Orchard, Singapore', to: 'Orchard Road' },
					{ from: 'Sentosa, Singapore', to: 'Sentosa' }
				],
				[
					{
						title: 'Night Safari, Singapore',
						thumbnail: SAFARI_THUMB
					}
				]
			]
		];
		examples.forEach( ( example ) => {
			assert.deepEqual(
				mergePages( example[ 0 ], example[ 1 ], example[ 2 ] ),
				example[ 3 ]
			);
		} );
	} );
} );
