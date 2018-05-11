import HomePage from './HomePage';
import Destination from './Destination';
import Sight from './Sight';

export default [
	[ '/', HomePage, '/api/random/en' ],
	[ '/destination/:dest/sight/:title', Sight, '/api/voyager/page/en.wikivoyage/:title' ],
	[ '/destination/:title', Destination, '/api/voyager/page/en.wikivoyage/:title' ]
];
