import assert from 'assert';
import domino from 'domino';
import extract from './../../../server/endpoints/voyager/extract-sights-from-text';

describe( 'extract-sights-from-text', function () {
	it( 'wikipedia links', function () {
		const html = '<p>The <a href="https://en.wikipedia.org/wiki/Pitch%20Lake" title="w:Pitch Lake">La Brea Pitch Lake</a> is the world\'s largest natural reservoir of asphalt.  However, commercial excavation of asphalt has slowed down considerably, since other more cost effective materials are available for road construction.  The pitch lake is now primarily a tourist destination.  Many go to bathe in its waters, which contain sulphur, which some say has healing properties.</p>';
		const window = domino.createWindow( html );
		const sights = extract( window.document );
		assert.strictEqual( sights.length, 1 );
		assert.strictEqual( sights[ 0 ].name, 'Pitch Lake' );
	} );
} );
