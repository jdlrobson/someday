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
					{ pageid: 38376,
						ns: 0,
						title: 'Walt Disney World',
						thumbnail: {
							source: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Magic_Kingdom_-_The_%27Big_Bang%27_at_Wishes_-_by_hyku.jpg/80px-Magic_Kingdom_-_The_%27Big_Bang%27_at_Wishes_-_by_hyku.jpg',
							width: 80,
							height: 120
						}
					}
				],
				[
					{ title: 'Disney World' }
				],
				// redirects
				[
					{ from: 'Disney World', to: 'Walt Disney World' }
				],
				[
					{ pageid: 38376,
						ns: 0,
						title: 'Walt Disney World',
						thumbnail: {
							source: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Magic_Kingdom_-_The_%27Big_Bang%27_at_Wishes_-_by_hyku.jpg/80px-Magic_Kingdom_-_The_%27Big_Bang%27_at_Wishes_-_by_hyku.jpg',
							width: 80,
							height: 120
						},
						redirects: [ 'Disney World' ]
					}
				]
			],
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
