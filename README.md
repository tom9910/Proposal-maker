# Proposal maker

An app to develop proposals designed for [Ted Sanchez Construction](https://www.atedsanchezroofing.com/)

Use openai api to understand voice and summarize input while referring to and identifying common inputs for the buiseness.

## How To Use

1. Click the microphone icon next to the text box to begin. DO NOT enter anything into the text box before this. (you may have to allow audio in your browser)
2. Record your audio clip saying the information expected for that box in a free form speech.
3. Click the microphone icon when finished. (you have 60 seconds to click this)
4. Review the generated text
5. Make any edits if neccesary, while PRESERVING FORMATTING
6. Click on generate and download. The newly created document will be created and saved to your downloads folder.

## Getting started

You will need an `OPEN_API_KEY` in your env file. As well as value API_ON set to true.

You will also need a file called companyInfo.ts
It must be formatted similar to

```
export const companyInfo = {
	nameAndLicenseNum: 'Company name								lic info',
	addressAndPhoneNum: ' 1234 address rd							PH. # 555-555-5555'
};
```

## create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/main/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## planned features for future releases

Customizable expected prompts and likely bullet points.

Customizable proposal format and file types.

Customizable proposal text.

Edit recording time options.

Choose a model.
