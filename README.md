[![npm](https://img.shields.io/npm/v/nativescript-texttospeech.svg)](https://www.npmjs.com/package/nativescript-texttospeech)
[![npm](https://img.shields.io/npm/dt/nativescript-texttospeech.svg?label=npm%20downloads)](https://www.npmjs.com/package/nativescript-texttospeech)

# NativeScript-TextToSpeech :loudspeaker:

A Text to Speech NativeScript plugin for Android & iOS

#### Native Controls
 - Android - [TextToSpeech](https://developer.android.com/reference/android/speech/tts/TextToSpeech.html)
 - iOS - [AVSpeechSynthesizer](https://developer.apple.com/reference/avfoundation/avspeechsynthesizer)

## Installation

Run the following command from the root of your project:

```
$ tns plugin add nativescript-texttospeech
```
This command automatically installs the necessary files, as well as stores nativescript-texttospeech as a dependency in your project's package.json file.

## Video Tutorial
[egghead lesson @ https://egghead.io/lessons/typescript-using-text-to-speech-with-nativescript](https://egghead.io/lessons/typescript-using-text-to-speech-with-nativescript)


## Usage

```js
/// javascript
var TextToSpeech = require("nativescript-texttospeech");


/// TypeScript
import { TNSTextToSpeech, SpeakOptions } from 'nativescript-texttospeech';

let TTS = new TNSTextToSpeech();

let speakOptions: SpeakOptions = {
    text: 'Whatever you like', /// *** required ***
    speakRate: 0.5, // optional - default is 1.0
    pitch: 1.0, // optional - default is 1.0
    volume: 1.0, // optional - default is 1.0
    locale: "en-GB",  // optional - default is system locale,
    finishedCallback: Function // optional
}

// Call the `speak` method passing the SpeakOptions object
TTS.speak(speakOptions).then(() => {
    // everything is fine
}, (err) => {
    // oops, something went wrong!
});

```


#### API

- `speak(options: SpeakOptions): Promise<any>` - start speaking with the given options
- `pause(): void` - pause the speech
- `resume(): void` - resume the speech
- `destroy(): void` - release resources for the speech synthesizer/engine

- `SpeakOptions = {}`
    - `text: string` ** required **
    - `queue?: boolean = false`  
    - `pitch?: number = 1.0`  
    - `speakRate?: number = 1.0`  
    - `volume?: number = 1.0` 
    - `locale?: string = default system locale`
    - `language?: string = default system language` ** Android only **
    - `finishedCallback?: Function`


If you wish to set a custom locale, you need to provide a valid BCP-47 code, e.g. `en-US`. If you wish to set only a custom language (without a preferred country code), you need to provide a valid ISO 639-1 language code. If both are set, the custom locale will be used.

The plugin checks whether the supplied locale/language code has the correct syntax but will not prevent setting a nonexistent codes. Please use this feature with caution.

Example with language code only:
```js
let speakOptions: SpeakOptions = {
    text: 'Whatever you like', // *** required ***
    language: "en"  // english language will be used
}
```

Example with locale:
```js
let speakOptions: SpeakOptions = {
    text: 'Whatever you like', // *** required ***
    locale: "en-AU"  // australian english language will be used
}
```

### Tip
- The speech synthesizer takes a moment to initialize on most devices. A simple way to get around this (tested in the demo app) is to create your new instance of the TNSTextToSpeech and then immediately call the `speak` method with the options objects `text` value = `""`. This will force the synthesizer to "warm up" and not speak anything. Now when you call the `speak` method for your app's functionality it will already have "warmed up" the synthesizer so the delay should be minimal.
It's possible this "Warm up" process could be put into the plugin source itself, I don't have time to do it right now but welcome any contribution that is well tested to make this the default behavior of the synthesizers.

### Android Only Methods

- `getAvailableLanguages(): Promise<Array<Language>>;` - returns an array of available languages (use to prevent using non-existing language/local codes)


## Credits

Inspired by James Montemagno's [TextToSpeech Xamarin plugin](https://github.com/jamesmontemagno/Xamarin.Plugins/tree/master/TextToSpeech)

Thanks to [anarchicknight](https://github.com/anarchicknight) for this plugin.
Thanks to [stefalda](https://github.com/stefalda) for his great work on pause/resume and the finishedCallback events :bomb:
