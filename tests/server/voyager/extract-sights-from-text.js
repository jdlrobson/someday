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
	it( 'billericay (external links)', () => {
		const html = '<ul id="mwJQ"><li id="mwJg"><bdi class="vcard" about="#mwt6" typeof="mw:Transclusion" data-mw="{&quot;parts&quot;:[{&quot;template&quot;:{&quot;target&quot;:{&quot;wt&quot;:&quot;do\n&quot;,&quot;href&quot;:&quot;./Template:Do&quot;},&quot;params&quot;:{&quot;name&quot;:{&quot;wt&quot;:&quot;Barleylands&quot;},&quot;alt&quot;:{&quot;wt&quot;:&quot;&quot;},&quot;url&quot;:{&quot;wt&quot;:&quot;http://www.barleylands.co.uk&quot;},&quot;email&quot;:{&quot;wt&quot;:&quot;&quot;},&quot;address&quot;:{&quot;wt&quot;:&quot;&quot;},&quot;lat&quot;:{&quot;wt&quot;:&quot;&quot;},&quot;long&quot;:{&quot;wt&quot;:&quot;&quot;},&quot;directions&quot;:{&quot;wt&quot;:&quot;&quot;},&quot;phone&quot;:{&quot;wt&quot;:&quot;&quot;},&quot;tollfree&quot;:{&quot;wt&quot;:&quot;&quot;},&quot;fax&quot;:{&quot;wt&quot;:&quot;&quot;},&quot;hours&quot;:{&quot;wt&quot;:&quot;&quot;},&quot;price&quot;:{&quot;wt&quot;:&quot;&quot;},&quot;content&quot;:{&quot;wt&quot;:&quot;Just outside the town, has many things to see and do, including a children\'s farm centre and museum and a craft village. It can easily be accessed by public transport on the 100 bus from the town centre and station.&quot;}},&quot;i&quot;:0}}]}" id="mwJw"><a rel="mw:ExtLink" class="external text" href="http://www.barleylands.co.uk"><span id="Barleylands" class="fn org listing-name"><b>Barleylands</b></span></a>.<span typeof="mw:Entity"> </span><bdi class="note listing-content">Just outside the town, has many things to see and do, including a children\'s farm centre and museum and a craft village. It can easily be accessed by public transport on the 100 bus from the town centre and station.</bdi><span class="listing-metadata"><span class="listing-metadata-items"><span typeof="mw:Entity">&nbsp;</span></span></span></bdi></li></ul>';
		const window = domino.createWindow( html );
		const sights = extract( window.document );
		assert.strictEqual( sights.length, 1 );
		assert.strictEqual( sights[ 0 ].title, 'Barleylands' );
		assert.strictEqual( sights[ 0 ].url, 'http://www.barleylands.co.uk' );
		assert.strictEqual( sights[ 0 ].external, true );
	} );
} );
