var assert = require( 'assert' );

import { hasForbiddenCategory } from './../../../server/endpoints/voyager/add-images-from-commons';

describe( 'add-images-from-commons', function () {
	it( 'hasForbiddenCategory', function () {
		const examples = [
			[
				[],
				false
			],
			[
				[
					'Category:Airport'
				],
				true
			]
		];
		examples.forEach( ( example ) => {
			assert.ok( hasForbiddenCategory( example[ 0 ] ) === example[ 1 ] );
		} );
	} );
} );
