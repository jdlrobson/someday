var assert = require( 'assert' );

import domino from 'domino';
import extractLeadParagraph from '../../server/endpoints/extractLeadParagraph';

describe( 'extractLeadParagraph', function () {
	it( 'extractLeadParagraph', function () {
		const examples = [
			[
				'<p>Hello world</p>',
				'<p>Hello world</p>',
				'Simple example'
			],
			[
				'<p><span>   </span></p>\n\n<p><b>Chaguanas</b> is in <a href="/wiki/Trinidad" title="Trinidad">Trinidad</a>.</p>',
				'<p><b>Chaguanas</b> is in <a href="/wiki/Trinidad" title="Trinidad">Trinidad</a>.</p>',
				'Empty paragraphs removed'
			]
		];
		examples.forEach( ( example ) => {
			var doc = domino.createDocument( example[ 0 ] );
			assert.strictEqual( extractLeadParagraph( doc ), example[ 1 ], example[ 2 ] );
		} );
	} );
} );
