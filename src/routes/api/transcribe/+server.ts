import OpenAI from 'openai';
import fs, { unlink } from 'fs';
import { promises as fsp } from 'fs';

import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';

import { convertToBulletPoints } from '$lib/summary/getTextSummary.js';
import { convertToFormattedInfo } from '$lib/summary/getInfoSummary.js';

const openai = new OpenAI({
	apiKey: env.OPENAI_API_KEY
});

export async function POST({ request, cookies }) {
	// 🔐 Check auth cookie
	const auth = cookies.get('auth');
	if (auth !== 'logged-in') {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	console.log('starting audio processing');
	const formData = await request.formData();
	const type = formData.get('type') as string;

	const audioFile = formData.get('audio') as File | null;

	// check file exists
	if (!audioFile) {
		return new Response(JSON.stringify({ error: 'No audio file uploaded' }), { status: 400 });
	}

	// Convert the file to a readable stream
	const buffer = Buffer.from(await audioFile.arrayBuffer());

	const sendAudioAndGetText = async (): Promise<Response> => {
		let result: Response = json('empty');

		// Create a file
		try {
			await fsp.writeFile('/tmp/recording.webm', buffer);
			console.log('File written successfully');
		} catch (error) {
			console.log('error writing file:', error);
		}

		//TODO: try catch
		try {
			if (env.API_ON !== 'False') {
				const transcription = await openai.audio.transcriptions.create({
					file: fs.createReadStream('/tmp/recording.webm'),
					model: 'whisper-1'
					// prompt: "use @ for emails like johnny@appleseed.com and use numbers like 123-4567 for phone numbers" doesnt seem to do anything
				});

				//successful api response
				console.log(transcription.text);

				const points: string[] = [
					'REPLACE OR REPAIR CRACKED OR BROKEN TILES',
					'SEAL ALL ROOF PENETRATIONS WITH SILICONE COATING',
					'REPAIR LOOSE FASCIA',
					'REMOVE EXSISTING SHINGLES',
					'INSPECT DECK, REPLACE DAMAGED PLYWOOD',
					'INSTALL NEW ROOF JACKS',
					'INSTALL NEW DRIP EDGE',
					'INSTALL SYNTHETIC VAPOR BARRIER',
					'INSTALL NEW STARTER SHINGLES',
					'INSTALL MODIFIED BITUMEN',
					'APPLY PLASTIC CEMENT AROUND ROOF PENETRATIONS AND VENTS',
					'CLEAN JOB SITE WHEN COMPLETE'
				];

				if (type === 'info') {
					result = await convertToFormattedInfo(transcription.text);
				} else {
					result = await convertToBulletPoints(transcription.text, points);
				}

				console.log('summary response: ', result);

				//result = json({ text: transcription.text }); //transcription.text
			} // of if
			else {
				result = json({ text: 'test value' }); //transcription.text
			}
		} catch (error) {
			console.log('Error in transcribe endpoint ', error);
		}

		// delete file from static

		unlink('/tmp/recording.webm', (err) => {
			if (err) console.log(err);
			else {
				console.log('File deleted');
			}
		});

		console.log('api call complete');

		return result;
	}; // get text

	return await sendAudioAndGetText();

	//sample result : 7102 Gettysburg Road NE, Ted Sanchez, SanchezTed26 at Yahoo.com
}
