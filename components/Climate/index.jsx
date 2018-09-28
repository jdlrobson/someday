import React from 'react';

import './styles.less';

class Climate extends React.Component {
	onChange( ev ) {
		this.setState( { month: ev.currentTarget.value } );
	}
	constructor() {
		super();
		this.state = {
			month: null
		};
	}
	renderInfo() {
		var options,
			climate = this.props.climate,
			curMonthNum = this.state.month || ( new Date() ).getMonth(),
			curMonth = climate[ curMonthNum ],
			degSuffix = curMonth.imperial ? '°F' : '°C',
			precSuffix = curMonth.imperial ? 'inches' : 'mm';

		options = climate.map( function ( data, i ) {
			return (
				<option value={i} key={'climate-option-' + i}>{data.heading}</option>
			);
		} );

		return (
			<div className="component-climate">
				<div>
					<h3>
						<select defaultValue={curMonthNum}
							disabled={!this.state.month} onChange={this.onChange}>{options}</select>
					</h3>
					<h4>Average temperatures</h4>
					<span className="high">{curMonth.high}<sup>{degSuffix}</sup></span>
					<span className="low">{curMonth.low}</span>
				</div>
				<div>Precipitation: { curMonth.precipitation} {precSuffix}</div>
			</div>
		);
	}
	render() {
		if ( this.props.climate ) {
			return this.renderInfo();
		} else {
			return ( <p>No climate information is available for this destination.</p> );
		}
	}
}

export default Climate;
