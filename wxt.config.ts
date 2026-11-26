import { defineConfig } from 'wxt';

// See https://wxt.dev/api/reference/wxt/interfaces/inlineconfig.html
export default defineConfig({
	modules: ['@wxt-dev/module-react'],
	manifest: {
		host_permissions: ['https://dkmh.ctu.edu.vn/*'],
		icons: {
			16: 'icon/16.png',
			32: 'icon/32.png',
			48: 'icon/48.png',
			96: 'icon/96.png',
			128: 'icon/128.png',
		},
		action: {
			default_icon: {
				16: 'icon/16.png',
				32: 'icon/32.png',
				48: 'icon/48.png',
			},
		},
		web_accessible_resources: [
			{
				resources: ['icon/*.png'],
				matches: ['https://htql.ctu.edu.vn/*', 'https://dkmh.ctu.edu.vn/*'],
			},
		],
	},
});
