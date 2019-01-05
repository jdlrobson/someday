import React from 'react';

import './styles.less';

class Climate extends React.Component {
	onChange( ev ) {
		this.setState( { month: ev.currentTarget.value } );
	}
	constructor( props ) {
		super( props );
		this.state = {
			month: props.month
		};
	}
	componentDidMount() {
		this.setState( { month: this.getCurrentMonth() } );
	}
	getCurrentMonth() {
		return ( new Date() ).getMonth();
	}
	renderInfo() {
		var options,
			props = this.props,
			climate = props.data,
			curMonthNum = this.state.month || this.getCurrentMonth(),
			curMonth = climate[ curMonthNum ],
			degSuffix = curMonth.imperial ? '°F' : '°C',
			precSuffix = curMonth.imperial ? 'inches' : 'mm';

		options = climate.map( function ( data, i ) {
			return (
				<option value={i} key={'climate-option-' + i}>{data.heading}</option>
			);
		} );

		return (
			<div className="component-climate hydratable"
				data-component="climate"
				data-props={JSON.stringify( props )}>
				<div>
					<h3>
						<select defaultValue={curMonthNum}
							disabled={this.state.month === undefined}
							onChange={this.onChange.bind( this )}>{options}</select>
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
		const { data } = this.props;
		if ( data ) {
			return this.renderInfo();
		} else {
			return ( <p>{'No climate information is available for this destination.'}</p> );
		}
	}
}

export default Climate;
