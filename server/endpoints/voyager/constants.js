export const SIGHT_HEADINGS = [ 'See', 'See & Do', 'Do' ];
export const DESTINATION_BLACKLIST = [ 'Understand', 'Talk', 'See' ];
export const EXPLORE_HEADINGS = [ 'Regions', 'Districts', 'Countries', 'Get around', 'Listen',
	'Eat and drink', 'Counties', 'Prefectures', 'Fees/Permits', 'See',
	'Buy', 'Eat', 'Drink', 'Do', 'Smoke' ];

export const TRANSIT_LINK_HEADINGS = [ 'by train', 'by bus', 'by boat', 'get in' ];
export const COUNTRY_SECTION_HEADINGS = [ 'regions' ];
export const ISLAND_SECTION_HEADINGS = [
	'nearby islands', 'the islands', 'islands'
];
export const REGION_SECTION_HEADINGS = ISLAND_SECTION_HEADINGS.concat( [
	'cities', 'other destinations', 'cities and towns',
	'towns & villages', 'towns &amp; villages',
	'cities / villages',
	'destinations', 'towns', 'countries and territories'
] );

export const ITEMS_TO_DELETE = [
	// should be handled upstream (https://gerrit.wikimedia.org/r/370371)
	'.dablink',
	// https://github.com/jdlrobson/someday/issues/42
	'.pp_cautionbox',
	'.mw-kartographer-maplink',
	'.pp_infobox',
	'.listing-metadata',
	// otherwise you'll have destination links from the outline box.
	// e.g. https://en.wikivoyage.org/wiki/Dudinka
	'.article-status',
	'.noprint',
	'.ambox',
	'.mbox-image',
	// Hatnotes - haven't worked a better way to deal with them yet.
	'dl',
	'.mbox-text',
	'.scribunto-error',
	'.mw-kartographer-container'
];

// Haven't worked out what to do with these yet.
export const SECTION_BLACKLIST = [ 'Learn', 'Work', 'Stay safe', 'Stay healthy',
	'Cope', 'Respect', 'Connect',
	// Relying on our climate widget. For countries e.g. New Zealand
	// let's try and pull out key words.
	'Climate',
	// TODO: Extract dates and show per month e.g. New Zealand
	'Holidays',
	// TMI. e.g. New Zealand
	'People',
	'Time zones',
	'Politics',
	'History' ];

export const TITLE_BLACKLIST = [ 'Travel topics' ];
