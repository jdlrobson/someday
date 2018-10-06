import React from 'react';
import './styles.less';

const offlineBanner = () => {
	return (
		<div className="offline-banner">
			<div className="offline-banner__msg">This page is available in airplane mode! To the airplane!</div>
			<div className="offline-banner__msg offline-banner__msg--small">Don't forget to visit any links on this page that you also need for your flight.</div>
		</div>
	);
};

export default offlineBanner;
