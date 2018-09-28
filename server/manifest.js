import {
	GCM_SENDER_ID, SITE_TITLE
} from './config';

const manifest = {
	name: SITE_TITLE,
	short_name: SITE_TITLE,
	start_url: './',
	display: 'standalone',
	icons: [
		{
			src: '/home-icon.png',
			sizes: '48x48',
			type: 'image/png'
		},
		{
			src: '/home-icon.png',
			sizes: '192x192',
			type: 'image/png'
		}
	],
	theme_color: 'white',
	gcm_sender_id: GCM_SENDER_ID
};

export default manifest;
