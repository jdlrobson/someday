import { extractElements } from './domino-utils';

function extractFloat( str ) {
	str = str.replace( '−', '-' );
	return parseFloat( str, 10 );
}

function fix( num ) {
	return parseFloat( num.toFixed( 1 ), 10 );
}

const MONTHS = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
function climateExtractionNew( text ) {
	const ext = extractElements( text, '.climate-table table.infobox table.infobox' );
	if ( ext.extracted.length > 0 ) {
		const firstTable = ext.extracted[ 0 ];
		const secondRow = firstTable.querySelectorAll( 'tr' )[ 1 ];
		const data = Array.from( secondRow.querySelectorAll( 'td' ) ).map( ( col, i ) => {
			const spans = col.querySelectorAll( 'span' );
			const values = Array.from( spans ).map( ( span ) => span.textContent )
				.filter( ( val ) => val.trim() !== '' );
			return {
				heading: MONTHS[ i ],
				precipitation: values[ 0 ],
				high: values[ 1 ],
				low: values[ 2 ]
			};
		} );
		return data;
	}
	return;
}

function climateExtraction( section ) {
	var rows, table,
		imperial = false,
		highRowNum = 0,
		climateData = [];
	var ext = extractElements( section.text, 'table.climate-table' );

	if ( ext.extracted.length === 1 ) {
		table = ext.extracted[ 0 ];
		rows = table.querySelectorAll( 'tr' );
		// get headings
		Array.prototype.forEach.call( table.querySelectorAll( 'th' ), function ( col, j ) {
			if ( j > 0 ) {
				climateData.push( { heading: col.textContent } );
			}
		} );

		Array.prototype.forEach.call( rows, function ( row, i ) {
			// get data.
			var cols = row.querySelectorAll( 'td' );
			if ( cols.length === 13 ) {
				Array.prototype.forEach.call( cols, function ( col, j ) {
					if ( j > 0 ) {
						if ( i === highRowNum ) {
							// highs
							climateData[ j - 1 ].imperial = imperial;
							climateData[ j - 1 ].high = extractFloat( col.textContent, imperial );
						} else if ( i === highRowNum + 1 ) {
							// lows
							climateData[ j - 1 ].low = extractFloat( col.textContent );
						} else if ( i === highRowNum + 2 ) {
							// precipitation
							climateData[ j - 1 ].precipitation = extractFloat( col.textContent );
						}
					} else {
						if ( i === highRowNum ) {
							imperial = col.textContent.indexOf( '(°F)' ) > -1;
						}
					}
				} );
			} else {
				highRowNum += 1;
			}
		} );
		climateData.forEach( function ( mo ) {
			if ( mo.imperial ) {
				delete mo.imperial;
				mo.high = fix( ( mo.high - 32 ) * 5 / 9 );
				mo.low = fix( ( mo.low - 32 ) * 5 / 9 );
				mo.precipitation = fix( mo.precipitation / 0.0393700787402 );
			}
		} );
		section.climate = climateData;
		section.text = ext.html;
	} else {
		section.climate = climateExtractionNew( section.text );
	}
	return Object.assign( {}, section );
}

export default climateExtraction;
