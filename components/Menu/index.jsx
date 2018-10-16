import React from 'react';
import { HorizontalList } from 'wikipedia-react-components';

import './styles.less';

export default function Menu( { username } ) {
	const tripUrl = username ?
		`/trips/${encodeURIComponent( username )}` :
		'/trips/';
	const tripLabel = username ? 'Your trips' : 'Our trips';
	const trips = <a className="menu__trip"
		href={tripUrl} key="menu-2">{tripLabel}</a>;
	const hello = username ?
		<span key="menu-hello">Welcome back <strong>{username}</strong>!</span> :
		<span key="menu-hello">Hello stranger!</span>;
	const goodbye = username ?
		<a href="/auth/logout" key="menu-auth">Sign out</a> :
		<a href="/auth/mediawiki" key="menu-auth">Sign in</a>;
	return (
		<div className="menu">
			<HorizontalList>
				{
					[
						<a className="menu__link" href="/" key="menu-1">Home</a>,
						hello,
						goodbye,
						trips
					]
				}
			</HorizontalList>
		</div>
	);
}
