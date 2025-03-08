<script lang="ts">
	import type { Writable } from 'svelte/store';
	import { mdiMicrophone } from '@mdi/js';
	import { mdiMicrophoneOff } from '@mdi/js';
	import Icon from './Icon.svelte';
	import { ProgressRadial } from '@skeletonlabs/skeleton';

	$: waitingForSummary = false;

	export let TextSummary: Writable<string>;
	export let type: string;

	let mediaRecorder: MediaRecorder;

	let audioChunks: BlobPart[] | undefined = [];
	let recording = false;
	let audioUrl = '';
	let timeoutId;

	let wasTimeOut: boolean;

	async function startRecording() {
		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
		mediaRecorder = new MediaRecorder(stream);

		mediaRecorder.ondataavailable = (event) => {
			if (event.data.size > 0 && audioChunks) {
				console.log('hi');
				audioChunks.push(event.data);
			}
		};

		mediaRecorder.onstop = async () => {
			const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
			audioUrl = URL.createObjectURL(audioBlob);
			if (!wasTimeOut) {
				console.log('recording stopped and sent');
				sendAudioToServer(audioBlob);
			}
		};

		mediaRecorder.start();
		recording = true;

		//call timeout to not leave audio recording for more than 45 seconds
		// Automatically stop recording after 45 seconds 45000
		timeoutId = setTimeout(() => {
			wasTimeOut = true;
			stopRecording();
		}, 75000);
	}

	function stopRecording() {
		if (mediaRecorder && recording) {
			mediaRecorder.stop();
			recording = false;
		}
	}

	// @ts-ignore
	async function sendAudioToServer(blob) {
		waitingForSummary = true;

		console.log('starting send audio');

		const formData = new FormData();
		for (var pair of formData.entries()) {
			console.log(pair[0] + ', ' + pair[1]);
		}

		formData.append('audio', blob, 'recording.webm');
		formData.append('type', type);

		console.log('FormData created:', {
			// Debug log 2
			blobSize: blob.size,
			blobType: blob.type,
			type: type
		});
		for (var pair of formData.entries()) {
			console.log(pair[0] + ', ' + pair[1]);
		}

		// endpoint to whisper
		try {
			console.log('Initiating fetch request...'); // Debug log 3
			const response = await fetch('api/transcribe', {
				method: 'POST',
				body: formData,
				signal: AbortSignal.timeout(30000)
			});

			const data = await response.json();
			console.log('Server Response:', data);

			//could also call the function here instead?

			$TextSummary = data;
			waitingForSummary = false;
		} catch (error) {
			console.error('Error uploading audio:', error);
			waitingForSummary = false;
			alert('Upload Failed ' + error);
		}
	}
</script>

{#if waitingForSummary}
	<ProgressRadial value={undefined} class="w-6 m-auto" />
{:else if recording}
	<button on:click={stopRecording} disabled={!recording}><Icon icon={mdiMicrophone} /></button>
{:else}
	<button on:click={startRecording} disabled={recording}> <Icon icon={mdiMicrophoneOff} /></button>
{/if}

<!-- Can hide this -->
{#if audioUrl}
	<audio controls>
		<source src={audioUrl} type="audio/webm" />
		Your browser does not support the audio element.
	</audio>
{/if}
