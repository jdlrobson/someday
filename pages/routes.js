export const HOME = '/';
export const TRIPS = '/trips/';
export const TRIPS_BY_OWNER = '/trips/:owner';

export const TRIP = '/trips/:owner/:id';
export const CLIMATE_TOOL = '/tools/climate/:title';
export const NEARBY_TOOL = '/tools/nearby/:title';
export const SIGHT = '/destination/:dest/sight/:title';
export const DESTINATION = '/destination/:title';
export const DESTINATION_REVISION = '/destination/:title/rev/:revision';

export default {
	CLIMATE_TOOL,
	NEARBY_TOOL,
	HOME,
	TRIPS,
	TRIPS_BY_OWNER,
	TRIP,
	SIGHT,
	DESTINATION,
	DESTINATION_REVISION
};
