var assert = require( 'assert' );

import { addAliases } from './../../../server/endpoints/voyager/add-sights';

describe( 'add-sights', function () {
	it( 'addAliases', function () {
		const examples = [
			[
				[
					'Sri_Mariamman_Hindu_Temple'
				],
				[
					'Sri_Mariamman_Hindu_Temple',
					'Sri_Mariamman_Hindu_Temple,_Singapore',
					'Sri_Mariamman_Hindu_Temple,_(Singapore)'
				]
			]
		];
		examples.forEach( ( example ) => {
			const sights = example[ 0 ].map( ( name ) => ( { name } ) );
			const expected = example[ 1 ];
			const aliasedSights = addAliases( sights, 'Singapore' );
			assert.deepStrictEqual( aliasedSights, expected );
		} );
	} );
} );
