<script lang="ts">
	import WhisperText from '$lib/whisperText.svelte';

	import { WorkToBePerformedAt } from '../store';
	import { WorkToBePerformed } from '../store';

	import { generateProposal } from '$lib/generate/createDoc';
	import { Packer } from 'docx';

	//import GoogleButton from '$lib/googleButton.svelte';

	$: Price = 0;

	const generateAndSave = () => {
		const doc = generateProposal($WorkToBePerformedAt, $WorkToBePerformed, Price.toString());

		//save
		const [name, address1, address2, phone, email] = $WorkToBePerformedAt
			.split('\n')
			.map((line) => line.trim());

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
	};
</script>

<div class="bg-blue-900 h-12 w-full flex items-center p-4">
	<h1>Proposal Generator</h1>
	<button class="variant-ghost-secondary p-1 ml-auto">Sign in</button>
	<!-- <GoogleButton /> -->
</div>

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

	<div class="input-group input-group-divider grid-cols-[1fr_auto] mt-10">
		<input type="number" bind:value={Price} placeholder="Enter Proposed Price" />
		<div class="input-group-shim" title="plustax">+ TAX</div>
	</div>

	<button
		class="variant-ghost-success p-2 m-5"
		on:click={() => {
			generateAndSave();
		}}>Generate and Download</button
	>
	<!-- <button on:click={() => {WorkToBePerformedAt="hello"; console.log("hello")}} >Start Recording</button> -->
</div>
