type LoginIcon = 'user' | 'lock' | 'eye' | 'eyeOff' | 'arrow';

const paths: Record<LoginIcon, string[]> = {
	user: ['M20 21v-2a7 7 0 0 0-14 0v2', 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0'],
	lock: ['M6 10h12v11H6z', 'M8 10V7a4 4 0 0 1 8 0v3', 'M12 14v3'],
	eye: ['M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12', 'M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0'],
	eyeOff: ['M3 3l18 18', 'M10.6 5.1 12 5c7 0 10 7 10 7a20 20 0 0 1-3.1 4.1', 'M6.2 6.2A20 20 0 0 0 2 12s3 7 10 7a11 11 0 0 0 5.8-1.8', 'M10 10a3 3 0 0 0 4 4'],
	arrow: ['M5 12h14', 'm13 6 6 6-6 6'],
};

export function createLoginIcon(icon: LoginIcon) {
	const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	svg.setAttribute('viewBox', '0 0 24 24');
	svg.setAttribute('fill', 'none');
	svg.setAttribute('stroke', 'currentColor');
	svg.setAttribute('stroke-width', '1.7');
	svg.setAttribute('stroke-linecap', 'round');
	svg.setAttribute('stroke-linejoin', 'round');
	svg.setAttribute('aria-hidden', 'true');
	svg.setAttribute('focusable', 'false');

	for (const data of paths[icon]) {
		const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		path.setAttribute('d', data);
		svg.append(path);
	}

	return svg;
}
