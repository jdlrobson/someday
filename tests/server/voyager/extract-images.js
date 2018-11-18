var assert = require( 'assert' );

import extract from './../../../server/endpoints/voyager/extract-images';

describe( 'extract-images', function () {
	it( 'Black dragon pool', function () {
		var section = {
			text: '<figure class="mw-default-size" id="mwBw"><span class="image"><img src="//upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Black_Dragon_Pool.jpg/220px-Black_Dragon_Pool.jpg" data-file-type="bitmap" height="165" width="220" srcset="//upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Black_Dragon_Pool.jpg/440px-Black_Dragon_Pool.jpg 2x, //upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Black_Dragon_Pool.jpg/330px-Black_Dragon_Pool.jpg 1.5x"></span><figcaption>Black Dragon Pool</figcaption></figure>'
		};
		section = extract( section );
		var img = section.images[ 0 ];
		assert.strictEqual( section.images.length, 1 );
		assert.strictEqual( img.src, '//upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Black_Dragon_Pool.jpg/220px-Black_Dragon_Pool.jpg' );
		assert.strictEqual( img.caption, 'Black Dragon Pool' );
		assert.strictEqual( img.href, 'Black_Dragon_Pool.jpg' );
	} );
	it( 'Galle (#14)', () => {
		var section = {
			text: `<figure class="mw-default-size" id="mwBw">
<span class="image">
	<img src="//upload.wikimedia.org/wikipedia/commons/b/ba/GalleFort.jpg" data-file-type="bitmap" height="165" width="220">
</span><figcaption>Black Dragon Pool</figcaption></figure>`
		};
		section = extract( section );
		var img = section.images[ 0 ];
		assert.strictEqual( section.images.length, 1 );
		assert.strictEqual( img.href, 'GalleFort.jpg' );
	} );
	it( 'South east Asia', function () {
		var section = {
			text: '<div>\n<p>Nine of the most prominent cities in Southeast Asia include:</p>\n<figure><a href="/wiki/File:Singapore_skyline_at_sunset_viewed_from_Gardens_by_the_Bay_East_-_20120426.jpg" class="image"><img src="//upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Singapore_skyline_at_sunset_viewed_from_Gardens_by_the_Bay_East_-_20120426.jpg/250px-Singapore_skyline_at_sunset_viewed_from_Gardens_by_the_Bay_East_-_20120426.jpg" srcset="//upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Singapore_skyline_at_sunset_viewed_from_Gardens_by_the_Bay_East_-_20120426.jpg/500px-Singapore_skyline_at_sunset_viewed_from_Gardens_by_the_Bay_East_-_20120426.jpg 2x, //upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Singapore_skyline_at_sunset_viewed_from_Gardens_by_the_Bay_East_-_20120426.jpg/375px-Singapore_skyline_at_sunset_viewed_from_Gardens_by_the_Bay_East_-_20120426.jpg 1.5x" height="144" width="250"></a><figcaption>Singapore</figcaption></figure>\n\n<ul><li id="mwFA"> <a href="/wiki/Bangkok" title="Bangkok">Bangkok</a> — Thailand\'s bustling, cosmopolitan capital with nightlife and fervour</li>\n<li id="mwFg"> <a href="/wiki/Ho_Chi_Minh_City" title="Ho Chi Minh City">Ho Chi Minh City</a> (formerly Saigon) — The bustling metropolis that has become Vietnam\'s largest city and the economic centre of the south</li>\n<li id="mwGA"> <a href="/wiki/Jakarta" title="Jakarta">Jakarta</a> — The largest metropolitan city in southeast Asia, and beautiful life in the evening</li>\n<li id="mwGg"> <a href="/wiki/Kuala_Lumpur" title="Kuala Lumpur">Kuala Lumpur</a> — grown from a small sleepy Chinese tin-mining village to a bustling metropolis</li>\n<li id="mwHA"> <a href="/wiki/Luang_Prabang" title="Luang Prabang">Luang Prabang</a> — a <a href="/wiki/UNESCO_World_Heritage_List" title="UNESCO World Heritage List">UNESCO World Heritage City</a> known for its numerous temples, colonial era architecture, and vibrant night market</li>\n<li id="mwHw"> <a href="/wiki/Manila" title="Manila">Manila</a> — a crowded, historic, and bustling city known for its unique blend of cultures and flavors with many places to see and experience</li>\n<li id="mwIQ"> <a href="/wiki/Phnom_Penh" title="Phnom Penh">Phnom Penh</a> — a city striving to retain the name of "The Pearl of Asia", as it was known before 1970</li>\n<li id="mwIw"> <a href="/wiki/Singapore" title="Singapore">Singapore</a> — modern, affluent city with a medley of Chinese, Indian and Malay influences</li>\n<li id="mwJQ"> <a href="/wiki/Yangon" title="Yangon">Yangon</a> (formerly Rangoon) — the commercial capital of Myanmar, known for its pagodas and colonial architecture</li></ul>\n\n</div>'
		};

		section = extract( section );
		assert.strictEqual( section.images.length, 1 );
		assert.strictEqual( section.images[ 0 ].src, '//upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Singapore_skyline_at_sunset_viewed_from_Gardens_by_the_Bay_East_-_20120426.jpg/250px-Singapore_skyline_at_sunset_viewed_from_Gardens_by_the_Bay_East_-_20120426.jpg' );
		assert.ok( section.text.indexOf( 'Singapore_skyline_at_sunset' ) === -1 );
	} );
} );
