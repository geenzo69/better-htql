import { modernizeLoginForm } from './loginForm';

export function arrangeLoginLayout(form: HTMLFormElement) {
	const pageBody = document.querySelector('#page-body');
	const table = document.querySelector('#table-main');
	const announcements = document.querySelector<HTMLUListElement>('#module-thongbao .thongbao');

	if (!pageBody || !table) {
		return;
	}

	document.querySelector('#btn-homepage')?.remove();

	const layout = document.createElement('div');
	const loginPanel = document.createElement('div');
	const loginCell = form.closest('td');
	const remainingNotice = loginCell?.querySelector('.thong_bao_temp');
	layout.className = 'htql-login-layout';
	loginPanel.className = 'htql-login-panel';
	modernizeLoginForm(form);
	loginPanel.append(form);

	if (remainingNotice) {
		loginPanel.append(remainingNotice);
	}

	layout.append(loginPanel);
	pageBody.prepend(layout);

	if (announcements) {
		const ticker = document.createElement('div');
		ticker.className = 'htql-announcements';
		ticker.setAttribute('role', 'region');
		ticker.setAttribute('aria-label', 'Thông báo');
		ticker.tabIndex = 0;
		ticker.append(announcements);
		layout.before(ticker);

		const duration = Math.max(30, (announcements.scrollWidth + ticker.clientWidth) / 60);
		announcements.style.setProperty('--htql-ticker-duration', `${duration}s`);
	}

	table.remove();
}
