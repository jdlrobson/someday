import HomePage from './HomePage';
import ClimateTool from './ClimateTool';
import Destination from './Destination';
import NearbyTool from './NearbyTool';
import Sight from './Sight';
import Trips from './Trips';
import Trip from './Trip';
import routes from './routes';

export default [
	[ routes.HOME, HomePage, '/api/random/en' ],
	[ routes.TRIPS, Trips, '/api/collection' ],
	[ routes.TRIPS_BY_OWNER, Trips, '/api/collection/by/:owner' ],
	[ routes.TRIP, Trip, '/api/collection/by/:owner/:id' ],
	[ routes.SIGHT, Sight, '/api/voyager/sight/:title' ],
	[ routes.DESTINATION_REVISION, Destination, '/api/voyager/page/en.wikivoyage/:title/:revision' ],
	[ routes.DESTINATION, Destination, '/api/voyager/page/en.wikivoyage/:title' ],
	[ routes.NEARBY_TOOL, NearbyTool, '/api/voyager/near/:title' ],
	[ routes.CLIMATE_TOOL, ClimateTool, '/api/voyager/climate/:title' ]
];
