// src/routes/login/+server.ts
import { ADMIN_HASH, OPENAI_API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { error } from 'console';
import dotenv from 'dotenv';

dotenv.config();

const storedHash = process.env.ADMIN_HASH;

export async function POST({ request, cookies }) {
	if (!storedHash) {
		throw error('no validation');
	}
	const { username, password } = await request.json();

	if (username !== process.env.UID) {
		return json({ error: 'Invalid username' }, { status: 401 });
	}

	const passwordMatch = await bcrypt.compare(password, storedHash);
	if (!passwordMatch) {
		return json({ error: 'Invalid credentials' }, { status: 401 });
	}

	// Success — set a cookie
	cookies.set('auth', 'logged-in', {
		path: '/',
		httpOnly: true,
		sameSite: 'strict',
		secure: true,
		maxAge: 60 * 60 * 24
	});

	return json({ success: true });
}
