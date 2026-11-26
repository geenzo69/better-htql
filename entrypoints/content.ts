import '@/assets/login.css';
import { arrangeLoginLayout } from '@/util/loginLayout';
import { configureLoginViewport } from '@/util/loginViewport';
import { initializeToasts } from '@/util/toast';

export default defineContentScript({
	matches: ['https://htql.ctu.edu.vn/', 'https://htql.ctu.edu.vn/login.php*'],
	runAt: 'document_start',
	cssInjectionMode: 'manifest',
	main() {
		document.documentElement.classList.add('custom-htql-login');
		configureLoginViewport();

		const initialize = () => {
			try {
				customizeLogin();
			} finally {
				document.documentElement.classList.add('htql-login-ready');
			}
		};

		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', initialize, { once: true });
		} else {
			initialize();
		}
	},
});

function customizeLogin() {
	const form = document.querySelector<HTMLFormElement>('form[name="frmLogin"]');

	if (!form) {
		return;
	}

	void initializeToasts();
	form.action = 'https://dkmh.ctu.edu.vn/htql/sinhvien/dang_nhap.php';
	form.method = 'post';

	const captcha = form.querySelector<HTMLInputElement>('input[name="txtMaBaoVe"]');
	const captchaRow = captcha?.closest('tr');

	if (captchaRow && !captchaRow.querySelector('[name="txtDinhDanh"], [name="txtMatKhau"]')) {
		captchaRow.remove();
	} else {
		captcha?.remove();
		form.querySelector('#verify_code')?.remove();
	}

	for (const submit of form.querySelectorAll('input[type="submit"][name="login"]')) {
		submit.removeAttribute('name');
	}

	const notice = form.nextElementSibling;
	const captchaHint = notice?.querySelector('font[color="#000000"]');
	const hintText = captchaHint?.textContent?.replace(/\s+/g, ' ').trim();

	if (notice?.matches('.thong_bao_temp') && hintText && /^Chú ý:\s*Mã bảo vệ là nhập/.test(hintText)) {
		captchaHint?.remove();

		if (!notice.textContent?.trim()) {
			notice.remove();
		}
	}

	arrangeLoginLayout(form);
}
