import React from 'react';
import Note from './../Note';

export default function ArrivalInformation( { sections } ) {
	return (
		<div className="arrival-information">
			<h2 className="section__heading">Arriving</h2>
			<Note>
				{sections.map( ( section, i ) => {
					return (
						<div key={'arrival-' + i}>
							<h3>{section.line}</h3>
							<p dangerouslySetInnerHTML={{ __html: section.text }} />
						</div>
					);
				} )}
			</Note>
		</div>
	);
}
