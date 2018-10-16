export default function cleanupUnwantedData( data ) {
	const warnings = ( data.warnings || [] ).concat(
		data.remaining.sections.map(
			( section ) => `Omitted section ${section.line}`
		)
	);
	return Object.assign( {}, data, {
		lead: Object.assign( {}, data.lead, {
			geo: undefined,
			image: undefined,
			media: undefined,
			lastmodifier: undefined,
			sections: undefined,
			languagecount: undefined,
			issues: undefined
		} ),
		remaining: undefined,
		warnings
	} );
}
