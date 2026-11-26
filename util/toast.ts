import { createElement } from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';

let initialization: Promise<typeof import('sonner')> | undefined;

export function initializeToasts() {
	if (!initialization) {
		initialization = mountToasts();
	}

	return initialization;
}

export async function showErrorToast(message: string) {
	const { toast } = await initializeToasts();
	toast.error(message, { id: 'htql-login-error' });
}

async function mountToasts() {
	const sonner = await import('sonner');
	const container = document.createElement('div');
	container.id = 'htql-toast-root';
	document.body.append(container);

	const root = createRoot(container);
	flushSync(() => {
		root.render(createElement(sonner.Toaster, {
			theme: 'light',
			position: 'bottom-center',
			richColors: true,
			closeButton: true,
			duration: 8000,
			offset: 20,
			mobileOffset: 16,
			containerAriaLabel: 'Thông báo',
			toastOptions: {
				closeButtonAriaLabel: 'Đóng thông báo',
				style: { boxShadow: 'none' },
			},
		}));
	});

	return sonner;
}
