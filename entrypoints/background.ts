import { browser } from 'wxt/browser';
import { logIn } from '@/util/authentication';

export default defineBackground(() => {
	browser.runtime.onMessage.addListener((message: unknown, sender, sendResponse) => {
		if (!message || typeof message !== 'object' || !('type' in message) || message.type !== 'htql:login') {
			return;
		}

		if (sender.id !== browser.runtime.id || !sender.url) {
			sendResponse({ success: false, error: 'Tiện ích không xác định được trang gửi yêu cầu đăng nhập. Vui lòng tải lại trang HTQL.' });

			return;
		}

		const senderUrl = new URL(sender.url);

		if (senderUrl.origin !== 'https://htql.ctu.edu.vn' || !['/', '/login.php'].includes(senderUrl.pathname)) {
			sendResponse({ success: false, error: 'Chỉ có thể đăng nhập từ trang https://htql.ctu.edu.vn/login.php.' });

			return;
		}

		logIn(message).then(sendResponse).catch(() => {
			sendResponse({ success: false, error: 'Tiện ích gặp lỗi khi xử lý phản hồi đăng nhập. Vui lòng tải lại tiện ích và trang HTQL.' });
		});

		return true;
	});
});
