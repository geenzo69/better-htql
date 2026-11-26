import { browser } from 'wxt/browser';
import type { LoginResult } from './authentication';
import { showErrorToast } from './toast';

export function bindLoginSubmission(form: HTMLFormElement, username: HTMLInputElement, password: HTMLInputElement, submit: HTMLInputElement) {
	let pending = false;
	const resetPending = () => {
		pending = false;
		submit.disabled = false;
		submit.value = 'Đăng nhập';
		form.removeAttribute('aria-busy');
	};
	form.addEventListener('submit', async (event) => {
		event.preventDefault();

		if (pending) {
			return;
		}

		username.value = username.value.trim();

		if (!form.reportValidity()) {
			return;
		}

		pending = true;
		submit.disabled = true;
		submit.value = 'Đang đăng nhập…';
		form.setAttribute('aria-busy', 'true');

		try {
			const result: LoginResult = await browser.runtime.sendMessage({
				type: 'htql:login',
				txtDinhDanh: username.value,
				txtMatKhau: password.value,
			});

			if (!result || typeof result.success !== 'boolean') {
				showErrorToast('Tiện ích không trả về kết quả đăng nhập hợp lệ. Vui lòng tải lại tiện ích và trang HTQL.');
				resetPending();

				return;
			}

			if (!result.success) {
				showErrorToast(result.error);
				resetPending();

				return;
			}

			window.location.assign(result.redirectUrl);
		} catch (error) {
			showErrorToast(getMessageError(error));
			resetPending();
		}
	});
	window.addEventListener('pageshow', resetPending);
}

function getMessageError(error: unknown) {
	const message = error instanceof Error ? error.message : typeof error === 'string' ? error : '';

	if (/extension context invalidated/i.test(message)) {
		return 'Tiện ích vừa được cập nhật hoặc tải lại. Hãy tải lại trang HTQL rồi đăng nhập lại.';
	}

	if (/receiving end does not exist|could not establish connection/i.test(message)) {
		return 'Phần xử lý đăng nhập của tiện ích chưa hoạt động. Hãy tải lại tiện ích rồi tải lại trang HTQL.';
	}

	if (/message port closed|message channel closed|channel.*closed|port.*closed/i.test(message)) {
		return 'Kết nối với phần xử lý đăng nhập bị ngắt trước khi có kết quả. Vui lòng tải lại tiện ích và trang HTQL.';
	}

	return message ? `Lỗi tiện ích khi đăng nhập: ${message}` : 'Tiện ích gặp lỗi đăng nhập không có thông tin chi tiết. Vui lòng tải lại tiện ích và trang HTQL.';
}
