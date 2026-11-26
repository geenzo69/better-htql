import { z } from 'zod';

export type LoginResult = { success: true; redirectUrl: string } | { success: false; error: string };

const loginSchema = z.object({
	txtDinhDanh: z.string().trim().min(1).max(128),
	txtMatKhau: z.string().min(1).max(512),
});
const loginUrl = 'https://dkmh.ctu.edu.vn/htql/sinhvien/dang_nhap.php';
const redirectUrl = new URL('hindex.php', loginUrl).href;

export async function logIn(input: unknown): Promise<LoginResult> {
	const parsed = loginSchema.safeParse(input);

	if (!parsed.success) {
		return { success: false, error: 'Vui lòng nhập mã số đăng nhập và mật khẩu.' };
	}

	try {
		const response = await fetch(loginUrl, {
			method: 'POST',
			credentials: 'include',
			cache: 'no-store',
			body: new URLSearchParams(parsed.data),
			signal: AbortSignal.timeout(20000),
		});

		if (!response.ok) {
			return { success: false, error: response.status === 429 ? 'Hệ thống đang giới hạn đăng nhập (HTTP 429). Vui lòng thử lại sau.' : `Máy chủ đăng nhập trả về lỗi HTTP ${response.status}. Vui lòng thử lại sau.` };
		}

		const html = (await response.text()).replace(/<!--[\s\S]*?-->/g, '');
		const invalidCredentials = html.includes('Ban da nhap sai ma so sinh vien hoac mat khau!') || html.includes('Ma so sinh vien hoac mat khau khong dung!');

		if (invalidCredentials) {
			return { success: false, error: 'Mã số đăng nhập hoặc mật khẩu không đúng.' };
		}

		const scripts = Array.from(html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi));
		const hasSuccessRedirect = scripts.some((script) => /\blocation\s*\.\s*href\s*=\s*(['"])hindex\.php\1\s*;?/.test(script[1] ?? ''));

		if (hasSuccessRedirect) {
			return { success: true, redirectUrl };
		}

		return { success: false, error: 'Máy chủ đã phản hồi nhưng không có thông báo đăng nhập thành công hoặc sai tài khoản. Chưa thể xác nhận kết quả đăng nhập.' };
	} catch (error) {
		const timeout = error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError');

		return { success: false, error: timeout ? 'Máy chủ đăng nhập không phản hồi trong 20 giây. Vui lòng thử lại.' : 'Kết nối đến dkmh.ctu.edu.vn bị lỗi. Kiểm tra mạng và quyền truy cập DKMH của tiện ích rồi thử lại.' };
	}
}
