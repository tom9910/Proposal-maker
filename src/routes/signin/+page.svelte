<!-- src/routes/login/+page.svelte -->
<script>
	let username = '';
	let password = '';
	let error = '';

	async function login() {
		const res = await fetch('/signin', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, password })
		});

		if (res.ok) {
			location.href = '/';
		} else {
			const data = await res.json();
			error = data.error;
		}
	}
</script>

<div class="min-h-screen flex mt-10 justify-center">
	<form on:submit|preventDefault={login} class="flex flex-col gap-4">
		<input class="text-black" bind:value={username} placeholder="Username" />
		<input class="text-black" type="password" bind:value={password} placeholder="Password" />
		<button type="submit" class="variant-ghost-success px-3 py-2">Login</button>
		<p>{error}</p>
	</form>
</div>
