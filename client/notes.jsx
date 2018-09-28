/* global localStorage */
import React from 'react';
import { showOverlay, hideOverlay } from './overlay';
import { Overlay, Input, Button } from 'wikipedia-react-components';

let debouncer;
function getSaveHandler( title ) {
	return function ( ev ) {
		const val = ev.currentTarget.value;
		window.clearTimeout( debouncer );
		window.setTimeout( () => {
			// do save.
			localStorage.setItem( title, val );
		}, 300 );
	};
}
function getNote( title ) {
	return localStorage.getItem( title ) || '';
}

export function showNoteOverlay( title ) {
	showOverlay(
		<Overlay>
			<h1>Make a note</h1>
			<p>Notes are private and notes will not leave your device.</p>
			<Input textarea={true}
				onInput={getSaveHandler( title )}
				defaultValue={getNote( title )}
				placeholder="Write a note for yourself here."></Input>
			<Button onClick={hideOverlay} label="Done"></Button>
		</Overlay>
	);
}
