export function configureLoginViewport() {
	const applyViewport = () => {
		if (!document.head) {
			return false;
		}

		const viewports = document.head.querySelectorAll<HTMLMetaElement>('meta[name="viewport"]');
		const content = 'width=device-width, initial-scale=1, viewport-fit=cover';

		if (!viewports.length) {
			const viewport = document.createElement('meta');
			viewport.name = 'viewport';
			viewport.content = content;
			document.head.append(viewport);
		} else {
			for (const viewport of viewports) {
				viewport.content = content;
			}
		}

		return true;
	};
	const observer = new MutationObserver(() => {
		if (applyViewport()) {
			observer.disconnect();
		}
	});

	if (!applyViewport()) {
		observer.observe(document, { childList: true, subtree: true });
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', () => {
			observer.disconnect();
			applyViewport();
		}, { once: true });
	}
}
