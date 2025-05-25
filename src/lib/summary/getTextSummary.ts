import OpenAI from 'openai';
import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';

const openai = new OpenAI({
	apiKey: env.OPENAI_API_KEY
});

const commonPoints = [''];

export async function convertToBulletPoints(
	inputText: string,
	commonPoints: string[]
): Promise<Response> {
	try {
		// Create a prompt that incorporates common phrases
		const prompt = `
          Convert the following text into clear, organized bullet points.
          Pay special attention to these key phrases if they appear and only if they appear: ${commonPoints.join(', ')}.
          Make sure to maintain any important relationships between ideas. There should also be a title to the bullet points. Which will be the first item in the provided text. 
		  If no text comes through and only if there is no text remind the user to check the microphone.

          Text to convert:
          ${inputText}
        `;
		console.log('starting gpt request');

		const response = await openai.chat.completions.create({
			model: 'gpt-4o-mini', // Or your preferred model
			messages: [
				{
					role: 'developer',
					content:
						'You are a precise assistant that converts text into well-organized bullet points. When you see something similar to the predefined common phrases, ensure they are featured in the bullet points. Maintain the original meaning and relationships between ideas.'
				},
				{
					role: 'user',
					content: prompt
				}
			],
			temperature: 0.3, // Lower temperature for more consistent formatting
			max_completion_tokens: 1000
		});

		console.log('chatgpt response completed');

		return json(response.choices[0].message.content);
	} catch (error) {
		console.error('Error converting text to bullets:', error);
		throw error;
	}
}
