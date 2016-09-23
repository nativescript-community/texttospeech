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

## Usage

```js
/// javascript
var TextToSpeech = require("nativescript-texttospeech");


/// TypeScript
import { TNSTextToSpeech, SpeakOptions } from 'nativescript-texttospeech';

let TTS = new TNSTextToSpeech();

let speakOptions: SpeakOptions = {
    text: 'Whatever you like', /// *** required ***
    speakRate: 0.5 // optional - default is 1.0
    pitch: 1.0 // optional - default is 1.0
    volume: 1.0 // optional - default is 1.0
    language: "en-GB"  // optional - default is system language,
    finishedCallback: Function // optional
}

// Call the `speak` method passing the SpeakOptions object
TTS.speak(speakOptions);

```


#### API

- `speak(options: SpeakOptions)` - start speaking with the given options
- `pause()` - pause the speech
- `resume()` - resume the speech
- `destroy()` - release resources for the speech synthesizer/engine

- `SpeakOptions = {}`
    - `text: string` ** required **
    - `queue?: boolean = false`  
    - `pitch?: number = 1.0`  
    - `speakRate?: number = 1.0`  
    - `volume?: number = 1.0` 
    - `language?: string = default system language`
    - `finishedCallback?: Function`


If you wish to set a custom language, you need to provide a valid ISO 639-1 language code, e.g. `en-US`. The plugin checks whether the supplied langauge code has the correct syntax but will not prevent setting a nonexistent language code. Please use this feature with caution.

## Credits

Inspired by James Montemagno's [TextToSpeech Xamarin plugin](https://github.com/jamesmontemagno/Xamarin.Plugins/tree/master/TextToSpeech)

Thanks to [anarchicknight](https://github.com/anarchicknight) for this plugin.
Thanks to [stefalda](https://github.com/stefalda) for his great work on pause/resume and the finishedCallback events :bomb: