export const HOME = '/';
export const TRIPS = '/trips/';
export const TRIPS_BY_OWNER = '/trips/:owner';

export const TRIP = '/trips/:owner/:id';
export const SIGHT = '/destination/:dest/sight/:title';
export const DESTINATION = '/destination/:title';
export const DESTINATION_REVISION = '/destination/:title/rev/:revision';

export default {
	HOME,
	TRIPS,
	TRIPS_BY_OWNER,
	TRIP,
	SIGHT,
	DESTINATION,
	DESTINATION_REVISION
};
