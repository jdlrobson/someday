import collection from './endpoints/collection';
import respond from './respond';

function initPublic( app, base, wikimediaProject, lang ) {
	app.get( base + 'collection/by/:user/:id?', function ( req, res ) {
		var id;
		var user = req.params.user;

		if ( req.params.id ) {
			id = parseInt( req.params.id, 10 );
		}
		if ( id < 0 ) {
			res.status( 400 );
			res.send( 'This id is reserved for future functionality and currently not supported.' );
		}

		respond( res, function () {
			return id !== undefined ? collection.members( lang, wikimediaProject, id, user, req.query ) :
				collection.list( lang, wikimediaProject, user, null, null, req.user );
		} );
	} );

	app.get( base + 'collection/', function ( req, res ) {
		respond( res, function () {
			return collection.all( lang, wikimediaProject, req.query );
		} );
	} );
}

function ensureAuthenticated( req, res, next ) {
	if ( req.isAuthenticated() ) {
		return next();
	} else {
		res.status( 401 );
		res.send( 'Login required for this endpoint' );
	}
}

function initPrivate( app, base, wikimediaProject, lang ) {
	app.all( base + 'private/collection/:id/:action/:title?', ensureAuthenticated, function ( req, res ) {
		var id = parseInt( req.params.id, 10 ) || 0;
		var action = req.params.action;
		var profile = req.user;
		var title = req.params.title;
		var coords = req.body.coordinates;
		var lat = coords ? coords.lat : 0;
		var lon = coords ? coords.lon : 0;

		respond( res, function () {
			if ( action === 'create' ) {
				return collection.create( lang, wikimediaProject, req.body.title, req.body.description, req.body.image, profile );
			} if ( action === 'edit' ) {
				return collection.edit( lang, wikimediaProject, id, req.body.title,
					req.body.description, req.body.image, lat, lon, profile );
			} else if ( action === 'with' ) {
				return collection.includes( lang, wikimediaProject, title, false, profile );
			} else if ( action === 'has' ) {
				return collection.member( lang, wikimediaProject, id, [ title ], profile );
			} else {
				return collection.update( lang, wikimediaProject, id, [ title ], profile, action === 'remove' );
			}
		} );
	} );
}
function init( app, base = '/api', wikimediaProject = 'wikipedia', lang = 'en' ) {
	initPublic( app, base, wikimediaProject, lang );
	initPrivate( app, base, wikimediaProject, lang );
}

export default init;
