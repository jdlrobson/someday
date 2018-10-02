import React from 'react';
import { showOverlay, hideOverlay } from './overlay';
import { Overlay, Input, Button } from 'wikipedia-react-components';
import qs from 'query-string';

const HOST = '/api/wikimedia/en.wikivoyage.org/api.php';
const location = window.location;
let currentEdit = '';

function showSpinnerOverlay( ev ) {
	showOverlay( ev,
		<Overlay>
			<div>Saving...</div>
		</Overlay>
	);
}

function mwApiWithToken( params, token ) {
	let query = {
		action: 'query',
		meta: 'tokens',
		type: token
	};
	return fetch( HOST,
		{
			credentials: 'same-origin',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify( query )
		}
	)
		.then( ( resp ) => resp.json() )
		.then( function ( data ) {
			params.token = data[ token + 'token' ];
			return fetch(
				HOST,
				{
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json'
					},
					credentials: 'same-origin',
					method: 'POST',
					body: JSON.stringify( params )
				}
			);
		} )
		.then( ( resp ) => resp.json() );
}

function getSaveHandler( title, section ) {
	return function ( ev ) {
		showSpinnerOverlay( ev );
		const text = currentEdit;
		return mwApiWithToken( {
			action: 'edit',
			title: title,
			basetimestamp: null, // revision timestamp
			starttimestamp: null,
			summary: 'Edit via the someday app',
			section,
			text
		}, 'csrf' ).then( (resp) => {
			const rev = resp.edit.newrevid;
			hideOverlay();
			location.href = location.origin + '/destination/' + title + '/rev/' + rev;
		} );
	};
}
function getWikitext( title, section ) {
	const query = qs.stringify( {
		action: 'query',
		format: 'json',
		prop: 'revisions',
		rvprop: 'content|timestamp',
		titles: title,
		formatversion: 2,
		rvsection: section
	} );
	return fetch( `${HOST}?${query}` )
		.then( ( resp ) => resp.json() )
		.then( ( data ) => data.pages[ 0 ].revisions[ 0 ].content );
}

function setCurrentEdit( ev ) {
	currentEdit = ev.currentTarget.value;
}

export function showEditOverlay( ev, title, section ) {
	getWikitext( title, section ).then( ( wikitext ) => {
		currentEdit = wikitext;
		showOverlay( ev,
			<Overlay>
				<h1 key="edit-heading">Edit this content</h1>
				<p key="edit-desc">Edits are public and update the original content on wikivoyage.org</p>
				<Input textarea="true" key="edit-text"
					defaultValue={wikitext} onChange={setCurrentEdit}
					placeholder="Write a note for yourself here."></Input>
				<Button key="edit-save" onClick={getSaveHandler( title, section )} label="Done"></Button>
				<Button key="edit-cancel" onClick={hideOverlay}>Cancel</Button>
			</Overlay>
		);
	} );
}
