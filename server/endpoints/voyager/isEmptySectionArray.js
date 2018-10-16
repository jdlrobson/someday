export default function isEmptySectionArray( sections ) {
	var isEmpty = true;
	sections.forEach( function ( section ) {
		if ( !section.isEmpty ) {
			isEmpty = false;
		}
	} );
	return isEmpty;
}
