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
	it( 'bold links', function () {
		const html = '<ul><li><i>Nature and wildlife</i>: Popular tourist attractions <b>Singapore Zoo</b>, <b>Night Safari</b>, <b>Jurong Bird Park</b> and the <b>Botanic Gardens</b> are all in the <a href="./Singapore%2FNorth_and_West" title="Singapore/North and West">North and West</a>. For something closer to the city, visit the futuristic <b>Gardens by the Bay,</b> behind the Marina Bay Sands. Finding "real" nature is a little harder, but the <b>Bukit Timah Nature Reserve</b> (in the same district as the zoo) has more plant species than that in the whole of North America, and is also home to a thriving population of wild monkeys. <b>Pulau Ubin</b>, an island off the <a href="./Singapore%2FEast_Coast" title="Singapore/East Coast">Changi Village</a> in the east, is a flashback to the rural Singapore of yesteryear. City parks full of locals jogging or doing tai chi can be found everywhere. Also check out the tortoise and turtle sanctuary in the Chinese Gardens on the west side of town for a great afternoon with these wonderful creatures. $5 for adult admission and $2 for leafy vegetables and food pellets. See <a href="./Botanical_tourism_in_Singapore" title="Botanical tourism in Singapore">Botanical tourism in Singapore</a> for details on where to see trees and plants.</li></ul>';
		const window = domino.createWindow( html );
		const sights = extract( window.document );
		// Night Safari (Singapore) : Night Safari, Singapore : Singapore Night Safari
		assert.strictEqual( sights.length, 10 );
	} );
} );
