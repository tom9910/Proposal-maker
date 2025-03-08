import OpenAI from 'openai';
import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';

const openai = new OpenAI({
	apiKey: env.OPENAI_API_KEY
});

export async function convertToFormattedInfo(inputText: string): Promise<Response> {
	try {
		// Create a prompt that introduces format rules
		const devprompt = `You are a precise text formatter that formats contact information in a specific way.

            Format Rules:
            1. Output should be exactly 5 lines
            2. Line 1: Name in format "Firstname Lastname"
            3. Line 2: Street address in bold with **
            4. Line 3: City, State Zip in bold with **
            5. Line 4: Phone number in format (XXX) XXX-XXXX
            6. Line 5: Email address with @ symbol

            Additional Rules:
            - Convert any spelled-out numbers to digits (e.g., "seven" becomes "7")
            - Convert any "at" in email addresses to "@"
            - Maintain all original capitalization
            - Bold lines (2 and 3) must be wrapped in **
            - Phone numbers must be in format (000) 123-4567
            - Do not add any extra lines, spaces, or formatting
            - Do not add any explanatory text or notes

            Example Output:
            John Smith
            **123 Main Street**
            **Springfield, IL 62701**
            (555) 123-4567
            john@email.com`;
		console.log('starting gpt request');

		const response = await openai.chat.completions.create({
			model: 'gpt-4o-mini', // Or your preferred model
			messages: [
				{
					role: 'developer',
					content: devprompt
				},
				{
					role: 'user',
					content: inputText
				}
			],
			temperature: 0.2, // Lower temperature for more consistent formatting
			max_completion_tokens: 1000
		});

		console.log('chatgpt response completed');

		return json(response.choices[0].message.content);
	} catch (error) {
		console.error('Error converting contanct info:', error);
		throw error;
	}
}
