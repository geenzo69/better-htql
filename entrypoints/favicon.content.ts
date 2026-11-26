import { browser } from 'wxt/browser';

export default defineContentScript({
	matches: ['https://htql.ctu.edu.vn/*', 'https://dkmh.ctu.edu.vn/htql/*'],
	runAt: 'document_start',
	main(ctx) {
		const iconUrl = browser.runtime.getURL('/icon/48.png');
		const updateFavicon = () => {
			const head = document.head;

			if (!head) {
				return;
			}

			const icons = head.querySelectorAll<HTMLLinkElement>('link[rel~="icon"]');

			if (!icons.length) {
				const icon = document.createElement('link');
				icon.rel = 'icon';
				icon.type = 'image/png';
				icon.sizes.value = '48x48';
				icon.href = iconUrl;
				head.append(icon);
			}

			for (const icon of icons) {
				if (icon.href !== iconUrl) {
					icon.href = iconUrl;
				}

				if (icon.type !== 'image/png') {
					icon.type = 'image/png';
				}

				if (icon.sizes.value !== '48x48') {
					icon.sizes.value = '48x48';
				}
			}
		};
		const headObserver = new MutationObserver(updateFavicon);
		const observeHead = () => {
			if (!document.head) {
				return false;
			}

			headObserver.observe(document.head, {
				childList: true,
				subtree: true,
				attributes: true,
				attributeFilter: ['href', 'rel', 'type', 'sizes'],
			});
			updateFavicon();

			return true;
		};
		const documentObserver = new MutationObserver(() => {
			if (observeHead()) {
				documentObserver.disconnect();
			}
		});

		if (!observeHead()) {
			documentObserver.observe(document, { childList: true, subtree: true });
		}

		ctx.onInvalidated(() => {
			documentObserver.disconnect();
			headObserver.disconnect();
		});
	},
});
