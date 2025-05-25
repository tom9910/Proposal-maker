import { json } from '@sveltejs/kit';
import dotenv from 'dotenv';

dotenv.config();

export async function GET({ cookies }) {
	const auth = cookies.get('auth');
	if (auth !== 'logged-in') {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	return json({ lic: process.env.LIC, phone: process.env.PHONE, addy: process.env.ADDRESS });
}
