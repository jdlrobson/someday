var assert = require( 'assert' );

import { getAliases } from './../../../server/endpoints/voyager/add-sights';

describe( 'add-sights', function () {
	it( 'getAliases', function () {
		const examples = [
			[
				[
					'Sri_Mariamman_Hindu_Temple'
				],
				[
					'Sri Mariamman Hindu Temple, Singapore',
					'Sri Mariamman Hindu Temple (Singapore)'
				]
			]
		];
		examples.forEach( ( example ) => {
			const sights = example[ 0 ].map( ( name ) => ( { name } ) );
			const expected = example[ 1 ];
			const aliasedSights = Object.keys( getAliases( sights, 'Singapore' ) );
			assert.deepStrictEqual( aliasedSights, expected );
		} );
	} );
} );
