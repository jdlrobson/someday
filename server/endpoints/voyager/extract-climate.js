import { extractElements } from './domino-utils';

function extractFloat( str ) {
	str = str.replace( '−', '-' );
	return parseFloat( str, 10 );
}

function fix( num ) {
	return parseFloat( num.toFixed( 1 ), 10 );
}

const MONTHS = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];

function fromFahrenheitToCelcius( val ) {
	return fix( ( val - 32 ) * 5 / 9 );
}

function fromInchesToMm( val ) {
	return fix( val / 0.0393700787402 );
}

function checkImperial( data ) {
	// assuming that over 60C is pretty hot, so it will be F.
	const imperial = data.filter( ( row ) => row.high > 60 ).length > 0;
	if ( imperial ) {
		return data.map( ( row ) => {
			return Object.assign( {}, row, {
				high: fromFahrenheitToCelcius( row.high ),
				low: fromFahrenheitToCelcius( row.low ),
				precipitation: fromInchesToMm( row.precipitation )
			} );
		} );
	} else {
		return data;
	}
}

export function climateToWikiText( climate, title ) {
	let text = '{{Climate|\n';
	climate.forEach( ( month ) => {
		const monthKey = month.heading.toLowerCase();
		Object.keys( month ).filter( ( key ) => key !== 'heading' ).forEach( ( key ) => {
			// map to param name
			const param = monthKey + key.replace( 'itation', '' );
			text += '\n|' + param + ' = ' + month[ key ];
		} );
	} );
	text += `\n|Source: [[w:${title}#Climate]]\n`;
	return text + '}}';
}

export function climateExtractionWikipedia( text ) {
	const matches = extractElements( text, 'table tr' );
	let climate = [];
	matches.extracted.forEach( ( tr ) => {
		const th = Array.from( tr.querySelectorAll( 'th' ) );
		const td = Array.from( tr.querySelectorAll( 'td' ) );
		if ( climate.length === 0 && th.length === 14 ) {
			climate = th.map( ( th ) => ( { heading: th.textContent } ) ).slice( 1, 13 );
		} else if ( th.length === 1 ) {
			const legend = th[ 0 ].textContent.toLowerCase();
			const vals = td.slice( 0, 12 );
			let key;
			if ( legend.indexOf( 'average high' ) > -1 ) {
				key = 'high';
			} else if ( legend.indexOf( 'average low' ) > -1 ) {
				key = 'low';
			} else if (
				legend.indexOf( 'rainfall' ) > -1 ||
				legend.indexOf( 'average precipitation mm ' ) > -1
			) {
				key = 'precipitation';
			}
			if ( key ) {
				climate.forEach( ( item, i ) => {
					let val = vals[ i ].textContent.replace( /\(.*\)/g, '' );
					const negate = val.match( /[-−]/ );	
					const finalVal = parseFloat( val.replace( /[-−]/g, '' ) );
					item[ key ] = negate ? -finalVal : finalVal;
				} );
			}
		}
	} );
	return climate;
}

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
				precipitation: parseFloat( values[ 0 ] ),
				high: parseInt( values[ 1 ], 10 ),
				low: parseInt( values[ 2 ], 10 )
			};
		} );
		return checkImperial( data );
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
				mo.high = fromFahrenheitToCelcius( mo.high );
				mo.low = fromFahrenheitToCelcius( mo.low );
				mo.precipitation = fromInchesToMm( mo.precipitation );
			}
		} );
		section.climate = checkImperial( climateData );
		section.text = ext.html;
	} else {
		section.climate = climateExtractionNew( section.text );
	}
	return Object.assign( {}, section );
}

export default climateExtraction;
