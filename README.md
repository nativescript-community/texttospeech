<!-- ⚠️ This README has been generated from the file(s) "blueprint.md" ⚠️--><!-- ⚠️ This README has been generated from the file(s) "blueprint.md" ⚠️-->
<!--  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      DO NOT EDIT THIS READEME DIRECTLY! Edit "bluesprint.md" instead.
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
<h1 align="center">@nativescript-community/texttospeech</h1>
<p align="center">
		<a href="https://npmcharts.com/compare/@nativescript-community/texttospeech?minimal=true"><img alt="Downloads per month" src="https://img.shields.io/npm/dm/@nativescript-community/texttospeech.svg" height="20"/></a>
<a href="https://www.npmjs.com/package/@nativescript-community/texttospeech"><img alt="NPM Version" src="https://img.shields.io/npm/v/@nativescript-community/texttospeech.svg" height="20"/></a>
	</p>

<p align="center">
  <b>A text to speech NativeScript plugin for Android and iOS</b></br>
  <sub><sub>
</p>

<br />


| <img src="https://raw.githubusercontent.com/nativescript-community/ui-label/master/images/demo-ios.gif" height="500" /> | <img src="https://raw.githubusercontent.com/nativescript-community/ui-label/master/images/demo-android.gif" height="500" /> |
| --- | ----------- |
| iOS Demo | Android Demo |


[](#table-of-contents)


[](#table-of-contents)

## Table of Contents

* [Installation](#installation)
		* [Native Controls](#native-controls)
* [Installation](#installation-1)
* [Video Tutorial](#video-tutorial)
* [Usage](#usage)
		* [API](#api)
	* [Tip](#tip)
	* [Android Only Methods](#android-only-methods)
* [Credits](#credits)
	* [Examples:](#examples)
* [Demos and Development](#demos-and-development)
	* [Repo Setup](#repo-setup)
	* [Build](#build)
	* [Demos](#demos)
* [Contributing](#contributing)
	* [Update repo ](#update-repo-)
	* [Update readme ](#update-readme-)
	* [Update doc ](#update-doc-)
	* [Publish](#publish)
	* [modifying submodules](#modifying-submodules)
* [Questions](#questions)


[](#installation)


[](#installation)

## Installation
Run the following command from the root of your project:

`ns plugin add @nativescript-community/texttospeech`

A Text to Speech NativeScript plugin for Android & iOS

#### Native Controls

-   Android - [TextToSpeech](https://developer.android.com/reference/android/speech/tts/TextToSpeech.html)
-   iOS - [AVSpeechSynthesizer](https://developer.apple.com/reference/avfoundation/avspeechsynthesizer)


[](#installation)


[](#installation)

## Installation

Run the following command from the root of your project:

```
tns plugin add @nativescript-community/texttospeech
```

This command automatically installs the necessary files, as well as stores @nativescript-community/texttospeech as a dependency in your project's package.json file.


[](#video-tutorial)


[](#video-tutorial)

## Video Tutorial

[egghead lesson @ https://egghead.io/lessons/typescript-using-text-to-speech-with-nativescript](https://egghead.io/lessons/typescript-using-text-to-speech-with-nativescript)


[](#usage)


[](#usage)

## Usage

```js
/// javascript
const TextToSpeech = require('@nativescript-community/texttospeech');

/// TypeScript
import { TNSTextToSpeech, SpeakOptions } from '@nativescript-community/texttospeech';

const TTS = new TNSTextToSpeech();

const speakOptions: SpeakOptions = {
    text: 'Whatever you like', /// *** required ***
    speakRate: 0.5, // optional - default is 1.0
    pitch: 1.0, // optional - default is 1.0
    volume: 1.0, // optional - default is 1.0
    locale: 'en-GB', // optional - default is system locale,
    finishedCallback: Function, // optional
};

// Call the `speak` method passing the SpeakOptions object
TTS.speak(speakOptions).then(
    () => {
        // everything is fine
    },
    (err) => {
        // oops, something went wrong!
    }
);
```

#### API

-   `speak(options: SpeakOptions): Promise<any>` - start speaking with the given options
-   `pause(): void` - pause the speech
-   `resume(): void` - resume the speech
-   `destroy(): void` - release resources for the speech synthesizer/engine

-   `SpeakOptions = {}`
    -   `text: string` ** required **
    -   `queue?: boolean = false`
    -   `pitch?: number = 1.0`
    -   `speakRate?: number = 1.0`
    -   `volume?: number = 1.0`
    -   `locale?: string = default system locale or language`
    -   `finishedCallback?: Function`

If you wish to set a custom locale, you need to provide a valid BCP-47 code, e.g. `en-US`. If you wish to set only a custom language (without a preferred country code), you need to provide a valid ISO 639-1 language code.

The plugin checks whether the supplied locale code has the correct syntax but will not prevent setting a nonexistent codes. Please use this feature with caution.

Example with language code only:

```js
const speakOptions: SpeakOptions = {
    text: 'Whatever you like', // *** required ***
    locale: 'en', // english language will be used
};
```

Example with locale:

```js
const speakOptions: SpeakOptions = {
    text: 'Whatever you like', // *** required ***
    locale: 'en-AU', // australian english language will be used
};
```

### Tip

-   The speech synthesizer takes a moment to initialize on most devices. A simple way to get around this (tested in the demo app) is to create your new instance of the TNSTextToSpeech and then immediately call the `init` method . This will force the synthesizer to "warm up" . Now when you call the `speak` method for your app's functionality it will already have "warmed up" the synthesizer so the delay should be minimal.
    It's possible this "Warm up" process could be put into the plugin source itself, I don't have time to do it right now but welcome any contribution that is well tested to make this the default behavior of the synthesizers.

### Android Only Methods

-   `getAvailableLanguages(): Promise<Array<Language>>;` - returns an array of available languages (use to prevent using non-existing language/local codes)


[](#credits)


[](#credits)

## Credits

Inspired by James Montemagno's [TextToSpeech Xamarin plugin](https://github.com/jamesmontemagno/Xamarin.Plugins/tree/master/TextToSpeech)

Thanks to [anarchicknight](https://github.com/anarchicknight) for this plugin.
Thanks to [stefalda](https://github.com/stefalda) for his great work on pause/resume and the finishedCallback events :bomb:

### Examples:

- [Basic Drawer](demo-snippets/vue3/BasicDrawer.vue)
  - A basic sliding drawer.
- [All Sides](demo-snippets/vue3/AllSides.vue)
  - An example of drawers on all sides: left, right, top, bottom.


[](#demos-and-development)


[](#demos-and-development)

## Demos and Development


### Repo Setup

The repo uses submodules. If you did not clone with ` --recursive` then you need to call
```
git submodule update --init
```

The package manager used to install and link dependencies must be `pnpm` or `yarn`. `npm` wont work.

To develop and test:
if you use `yarn` then run `yarn`
if you use `pnpm` then run `pnpm i`

**Interactive Menu:**

To start the interactive menu, run `npm start` (or `yarn start` or `pnpm start`). This will list all of the commonly used scripts.

### Build

```bash
npm run build.all
```
WARNING: it seems `yarn build.all` wont always work (not finding binaries in `node_modules/.bin`) which is why the doc explicitly uses `npm run`

### Demos

```bash
npm run demo.[ng|react|svelte|vue].[ios|android]

npm run demo.svelte.ios # Example
```

Demo setup is a bit special in the sense that if you want to modify/add demos you dont work directly in `demo-[ng|react|svelte|vue]`
Instead you work in `demo-snippets/[ng|react|svelte|vue]`
You can start from the `install.ts` of each flavor to see how to register new demos 


[](#contributing)


[](#contributing)

## Contributing

### Update repo 

You can update the repo files quite easily

First update the submodules

```bash
npm run update
```

Then commit the changes
Then update common files

```bash
npm run sync
```
Then you can run `yarn|pnpm`, commit changed files if any

### Update readme 
```bash
npm run readme
```

### Update doc 
```bash
npm run doc
```

### Publish

The publishing is completely handled by `lerna` (you can add `-- --bump major` to force a major release)
Simply run 
```shell
npm run publish
```

### modifying submodules

The repo uses https:// for submodules which means you won't be able to push directly into the submodules.
One easy solution is t modify `~/.gitconfig` and add
```
[url "ssh://git@github.com/"]
	pushInsteadOf = https://github.com/
```


[](#questions)


[](#questions)

## Questions

If you have any questions/issues/comments please feel free to create an issue or start a conversation in the [NativeScript Community Discord](https://nativescript.org/discord).


[](#demos-and-development)

## Demos and Development


### Repo Setup

The repo uses submodules. If you did not clone with ` --recursive` then you need to call
```
git submodule update --init
```

The package manager used to install and link dependencies must be `pnpm` or `yarn`. `npm` wont work.

To develop and test:
if you use `yarn` then run `yarn`
if you use `pnpm` then run `pnpm i`

**Interactive Menu:**

To start the interactive menu, run `npm start` (or `yarn start` or `pnpm start`). This will list all of the commonly used scripts.

### Build

```bash
npm run build.all
```
WARNING: it seems `yarn build.all` wont always work (not finding binaries in `node_modules/.bin`) which is why the doc explicitly uses `npm run`

### Demos

```bash
npm run demo.[ng|react|svelte|vue].[ios|android]

npm run demo.svelte.ios # Example
```

Demo setup is a bit special in the sense that if you want to modify/add demos you dont work directly in `demo-[ng|react|svelte|vue]`
Instead you work in `demo-snippets/[ng|react|svelte|vue]`
You can start from the `install.ts` of each flavor to see how to register new demos 


[](#contributing)

## Contributing

### Update repo 

You can update the repo files quite easily

First update the submodules

```bash
npm run update
```

Then commit the changes
Then update common files

```bash
npm run sync
```
Then you can run `yarn|pnpm`, commit changed files if any

### Update readme 
```bash
npm run readme
```

### Update doc 
```bash
npm run doc
```

### Publish

The publishing is completely handled by `lerna` (you can add `-- --bump major` to force a major release)
Simply run 
```shell
npm run publish
```

### modifying submodules

The repo uses https:// for submodules which means you won't be able to push directly into the submodules.
One easy solution is t modify `~/.gitconfig` and add
```
[url "ssh://git@github.com/"]
	pushInsteadOf = https://github.com/
```

[](#questions)

## Questions

If you have any questions/issues/comments please feel free to create an issue or start a conversation in the [NativeScript Community Discord](https://nativescript.org/discord).