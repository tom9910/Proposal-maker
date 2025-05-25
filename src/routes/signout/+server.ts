import { json } from '@sveltejs/kit';

export async function GET({ cookies }) {
	cookies.delete('auth', { path: '/' });
	return json({ success: true });
}
