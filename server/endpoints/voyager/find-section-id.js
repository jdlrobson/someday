export default function findSectionId( sections, name ) {
	name = name.toLowerCase();
	return sections.filter( ( section ) => section.line.toLowerCase() === name )
		.map( section => section.id )[ 0 ];
}
