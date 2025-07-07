<script lang="ts">
	import WhisperText from '$lib/whisperText.svelte';

	import { WorkToBePerformedAt } from '../store';
	import { WorkToBePerformed } from '../store';

	import { generateProposal } from '$lib/generate/createDoc';
	import { Packer } from 'docx';
	import { goto, invalidateAll } from '$app/navigation';
	import { generateInvoice } from '$lib/generate/createInvoice';

	export let data;

	$: Price = 0;

	const generateAndSave = async () => {
		const doc = await generateProposal($WorkToBePerformedAt, $WorkToBePerformed, Price.toString());

		const invoiceDoc = await generateInvoice(
			$WorkToBePerformedAt,
			$WorkToBePerformed,
			Price.toString()
		);

		//save
		const [name, address1, address2, phone, email] = $WorkToBePerformedAt
			.split('\n')
			.map((line) => line.trim());
		if ('error' in doc) {
			alert(doc.error);
		} else {
			Packer.toBlob(doc).then((blob) => {
				const url = window.URL.createObjectURL(blob);

				const link = document.createElement('a');

				link.href = url;
				link.download = `Proposal-${address1}-${name}.docx`;

				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);

				window.URL.revokeObjectURL(url);
			});
		}

		//save invoice
		if ('error' in invoiceDoc) {
			alert(invoiceDoc.error);
		} else {
			Packer.toBlob(invoiceDoc).then((blob) => {
				const url = window.URL.createObjectURL(blob);

				const link = document.createElement('a');

				link.href = url;
				link.download = `Invoice-${address1}-${name}.docx`;

				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);

				window.URL.revokeObjectURL(url);
			});
		}
	};

	const logout = async () => {
		const authRes = await fetch('/signout');
		if (authRes.ok) {
			invalidateAll();
		} else {
			console.log('signout failed');
		}
	};
</script>

<div class="bg-blue-900 h-12 w-full flex items-center p-4">
	<h1>Proposal Generator</h1>
	<!-- <button class="variant-ghost-secondary p-1 ml-auto">Sign in</button> -->
	<!-- <GoogleButton /> -->
	<button
		class="variant-ghost-primary ms-auto px-8"
		on:click={() => (data.isAuthed ? logout() : goto('/signin'))}
		>{data.isAuthed ? 'Sign Out' : 'Sign In'}</button
	>
</div>

{#if data.isAuthed}
	<div class="container h-full mx-auto justify-center items-center text-center">
		<!-- <textarea class="textarea mt-10" rows="4" placeholder="Enter customer information (work to be perfomed at)." /> -->
		<WhisperText
			TextSummary={WorkToBePerformedAt}
			Label={'Work To Be Performed At: '}
			placeholder={'Enter customer information'}
			type={'info'}
		></WhisperText>
		<WhisperText
			TextSummary={WorkToBePerformed}
			Label={'Description of Work To Be Performed: '}
			placeholder={'Enter Work To Be Performed'}
			type={'work'}
		></WhisperText>

		<div class="input-group input-group-divider grid-cols-[1fr_auto] mt-10 w-11/12">
			<input type="number" bind:value={Price} placeholder="Enter Proposed Price" />
			<div class="input-group-shim" title="plustax">+ TAX</div>
		</div>

		<button
			class="variant-ghost-success p-2 m-5"
			on:click={() => {
				generateAndSave();
			}}>Generate and Download</button
		>
	</div>
{:else}
	<h2>Welcome to AI Proposal Generator</h2>
	<p>Please sign in to use!</p>
	<a
		href="https://www.atedsanchezroofing.com/"
		class="inline-block px-4 py-2 text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 transition-colors duration-200 mt-10"
		target="_blank"
		rel="noopener noreferrer"
	>
		Visit A Ted Sanchez Construction/Roofing online
	</a>
{/if}
