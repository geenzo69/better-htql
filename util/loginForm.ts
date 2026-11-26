import { createLoginIcon } from './loginIcon';

export function modernizeLoginForm(form: HTMLFormElement) {
	const username = form.querySelector<HTMLInputElement>('[name="txtDinhDanh"]');
	const password = form.querySelector<HTMLInputElement>('[name="txtMatKhau"]');
	const submit = form.querySelector<HTMLInputElement>('input[type="submit"]');

	if (!username || !password || !submit) {
		return;
	}

	const heading = document.createElement('h1');
	const usernameLabel = document.createElement('label');
	const passwordLabel = document.createElement('label');
	const usernameField = document.createElement('span');
	const passwordField = document.createElement('span');
	const passwordToggle = document.createElement('button');
	const submitField = document.createElement('div');
	heading.id = 'htql-login-heading';
	heading.textContent = 'Đăng nhập';
	usernameLabel.textContent = 'Mã số đăng nhập';
	passwordLabel.textContent = 'Mật khẩu';
	username.removeAttribute('placeholder');
	password.removeAttribute('placeholder');
	username.required = true;
	password.required = true;
	username.spellcheck = false;
	username.setAttribute('autocapitalize', 'none');
	usernameField.className = 'htql-login-field';
	passwordField.className = 'htql-login-field';
	passwordToggle.className = 'htql-password-toggle';
	passwordToggle.type = 'button';
	passwordToggle.setAttribute('aria-label', 'Hiện mật khẩu');
	passwordToggle.setAttribute('aria-pressed', 'false');
	passwordToggle.title = 'Hiện mật khẩu';
	passwordToggle.append(createLoginIcon('eye'));
	passwordToggle.addEventListener('click', () => {
		const visible = password.type === 'password';
		const label = visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu';
		password.type = visible ? 'text' : 'password';
		passwordToggle.setAttribute('aria-label', label);
		passwordToggle.setAttribute('aria-pressed', String(visible));
		passwordToggle.title = label;
		passwordToggle.replaceChildren(createLoginIcon(visible ? 'eyeOff' : 'eye'));
	});
	usernameField.append(createLoginIcon('user'), username);
	passwordField.append(createLoginIcon('lock'), password, passwordToggle);
	usernameLabel.append(usernameField);
	passwordLabel.append(passwordField);
	submit.value = 'Đăng nhập';
	submitField.className = 'htql-login-submit';
	submitField.append(submit, createLoginIcon('arrow'));
	form.setAttribute('aria-labelledby', heading.id);
	form.replaceChildren(heading, usernameLabel, passwordLabel, submitField);
	form.addEventListener('submit', (event) => {
		if (submit.disabled) {
			event.preventDefault();

			return;
		}

		submit.disabled = true;
		submit.value = 'Đang đăng nhập…';
		form.setAttribute('aria-busy', 'true');
	});
	window.addEventListener('pageshow', () => {
		submit.disabled = false;
		submit.value = 'Đăng nhập';
		form.removeAttribute('aria-busy');
	});
}
