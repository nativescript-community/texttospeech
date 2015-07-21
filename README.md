# nativescript-texttospeech

A texttospeech NativeScript plugin for Android & iOS

## Installation

Run the following command from the root of your project:

```
$ tns plugin add nativescript-texttospeech
```

This command automatically installs the necessary files, as well as stores nativescript-texttospeech as a dependency in your project's package.json file.

Due to a current open issue with NativeScript, [#669](https://github.com/NativeScript/nativescript-cli/issues/669), the plugin needs to be added before adding any platforms with the `tns add platform` command.

## Usage

To use the texttospeech module you must first `require()` it:

```js
var tts = require("nativescript-texttospeech");
```

After you have a reference to the module you can then call its `speak(text, queue, pitch, speakRate, volume)` method.

```js
// my-page.js
var tts = require("nativescript-texttospeech");
tts.speak("Sample text to be spoken", true, 1.0, 1.0, 1.0);
```

### Notes

`text` is the only required argument - if it is not supplied the `speak()` method will not be called. For example, the following will run with no issues:

```js
tts.speak("Sample text to be spoken");
```

but the following will not call the `speak()` method:

```js
tts.speak(true, 1.0, 1.0, 1.0);
```

If more than one argument is supplied then they are applied from left to right. For example, the following will also run with no issues and will set values for `text`, `queue` and `pitch`:

```js
tts.speak("Sample text to be spoken", true, 1.0);
```

This means that if you only want to supply some arguments which are not necessarily in order from left to right (e.g. `text` and `speakRate`), you need to supply all arguments, even if you have to set some of them to `null` (or `undefined`). For example:

```js
tts.speak("Sample text to be spoken", null, null, 0.75, null);
```

For any arguments not given an explicit value the following defaults are used:  
`queue = false`  
`pitch = 1.0`  
`speakRate = 1.0`  
`volume = 1.0`

## Credits

Inspired by James Montemagno's [TextToSpeech Xamarin plugin](https://github.com/jamesmontemagno/Xamarin.Plugins/tree/master/TextToSpeech)
