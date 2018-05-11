import random from './endpoints/random';
import page from './endpoints/page';

import respond from './respond';
import cachedResponses from './cached-response.js';
import { DEFAULT_PROJECT, API_PATH, ALLOWED_PROJECTS, DUMMY_SESSION, COLLECTIONS_INCLUDE_WATCHLIST } from './config';

import initApiProxy from 'express-wikimedia-api-proxy';

const cachedResponse = cachedResponses.cachedResponse;
const invalidate = cachedResponses.invalidate;


function initGetMethods( app ) {
	app.get( '/api/page/:lang/:title', ( req, res ) => {
		var proj = getProject( req );
		cachedResponse( res, req.url, function () {
			return page( req.params.title, proj.lang, proj.project, false );
		} );
	} );
}

export default function initRoutes( app ) {
	initGetMethods( app );
	initApiProxy( app, '/api/' );
}

