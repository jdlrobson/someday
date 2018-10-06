import HomePage from './HomePage';
import Destination from './Destination';
import Sight from './Sight';
import Trips from './Trips';
import Trip from './Trip';

export default [
	[ '/', HomePage, '/api/random/en' ],
	[ '/trips/', Trips, '/api/collection' ],
	[ '/trips/:owner', Trips, '/api/collection/by/:owner' ],
	[ '/trips/:owner/:id', Trip, '/api/collection/by/:owner/:id' ],
	[ '/destination/:dest/sight/:title', Sight, '/api/wikimedia/en.wikipedia.org/rest_v1/page/summary/:title' ],
	[ '/destination/:title/rev/:revision', Destination, '/api/voyager/page/en.wikivoyage/:title/:revision' ],
	[ '/destination/:title', Destination, '/api/voyager/page/en.wikivoyage/:title' ]
];
