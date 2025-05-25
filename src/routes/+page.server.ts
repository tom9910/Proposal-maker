export async function load({ cookies }) {
	const isAuthed = cookies.get('auth') === 'logged-in';
	return { isAuthed };
}
