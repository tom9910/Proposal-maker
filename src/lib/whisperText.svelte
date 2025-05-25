<script lang="ts">
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import AudioRecorder from './audioRecorder.svelte';
	import type { Writable } from 'svelte/store';

	export let TextSummary: Writable<string>;
	export let Label: string;
	export let placeholder: string;
	export let type: string;

	$: waitForUpload = false;
</script>

<div>
	<!-- <button on:click={getTextFromAudio}> getText</button> -->
	{#if waitForUpload}
		<ProgressRadial value={undefined} />
	{/if}
	<label class="mt-10"
		>{Label}
		<div class="flex w-11/12">
			<textarea
				class={type === 'info' ? 'textarea h-40' : 'textarea h-80'}
				bind:value={$TextSummary}
				rows="4"
				{placeholder}
			/>
			<AudioRecorder {TextSummary} {type} />
		</div>
	</label>
</div>
