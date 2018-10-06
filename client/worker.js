import {
	precache, router,
	cacheFirst, networkOnly, networkFirst
} from 'sw-toolbox';

// Keep in sync with asset names needed for offline
var staticAssets = [
	'/style.css',
	'/images/marker-icon.png',
	'/images/someday-map.png',
	'/main-bundle.js'
];

// Prefetch static assets
precache( staticAssets );

// Serve API requests from the network
const PAGE_CACHE = {
	maxEntries: 50,
	name: 'someday-pages',
	networkTimeoutSeconds: 3
};
const pageCacheOptions = {
	cache: PAGE_CACHE
};

// Serve static assets from cache first
staticAssets.forEach( ( asset ) => {
	router.get( asset, cacheFirst );
} );
// Cache home page, trip lists and trips themselves
router.get( '/', cacheFirst, pageCacheOptions );
router.get( '/trips/:username/:id?', networkFirst, pageCacheOptions );
router.get( '/destination/:title', networkFirst, pageCacheOptions );
router.get( '/destination/:title/rev/:rev', networkOnly, pageCacheOptions );
