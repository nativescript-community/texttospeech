# nativescript-texttospeech

A texttospeech NativeScript module for Android & iOS

## Installation

Run `npm install nativescript-texttospeech --save` from your project's inner `app` directory:

```
.
├── app
│   ├── app <------------------------------ run npm install from here
│   │   ├── app.css
│   │   ├── app.js
│   │   ├── bootstrap.js
│   │   ├── main-page.js
│   │   ├── main-page.xml
│   │   ├── node_modules
│   │   │   └── nativescript-texttospeech <-- The install will place the module's code here
│   │   │       └── ...
│   │   └── package.json <----------------- The install will register “nativescript-texttospeech as a dependency here
│   └── tns_modules
│       └── ...
└── platforms
    ├── android
    └── ios
```

As is, using npm within NativeScript is still experimental, so it's possible that you'll run into some issues. A more complete solution is in the works, and you can check out [this issue](https://github.com/NativeScript/nativescript-cli/issues/362) for an update on its progress and to offer feedback.

If npm doesn't end up working for you, you can just copy and paste this repo's texttospeech.android.js and texttospeech.ios.js files into your app and reference them directly.

## Usage

To use the texttospeech module you must first `require()` it from your project's `node_modules` directory:

```js
var tts = require( "./node_modules/nativescript-texttospeech/texttospeech" );
```

After you have a reference to the module you can then call its `speak(text, queue, pitch, speakRate, volume)` method.

```js
// my-page.js
var tts = require( "/path/to/node_modules/nativescript-texttospeech/texttospeech" );
tts.speak("Sample text to be spoken", true, 1.0, 1.0, 1.0);
```

A sample project is included with the repo (does not include the nativescript platforms folder). In order to use it perform the following actions:

* Check out repo
* Switch to the TextToSpeechDemo folder on your command line
* Add the platforms that you wish to use (tns platform add {android or ios})
* You should now be able to run the sample as usual (tns run {android or ios})

## Notes

'text' is the only required argument - if it is not supplied the speak() method will not be called. For example, the following will run with no issues:

```js
tts.speak("Sample text to be spoken");
```

but the following will not call the speak() method:

```js
tts.speak(true, 1.0, 1.0, 1.0);
```

If more than one argument is supplied then they are applied from left to right. For example, the following will also run with no issues and will set values for 'text', 'queue' and 'pitch':

```js
tts.speak("Sample text to be spoken", true, 1.0);
```

This means that if you only want to supply some arguments which are not necessarily in order from left to right (e.g. 'text' and 'speakRate'), you need to supply all arguments, even if you have to set some of them to null (or undefined). For example:

```js
tts.speak("Sample text to be spoken", null, null, 0.75, null);
```

For any arguments not given an explicit value the following defaults are used:  
queue = false  
pitch = 1.0  
speakRate = 1.0  
volume = 1.0

## Credits

Inspired by James Montemagno's TextToSpeech Xamarin plugin https://github.com/jamesmontemagno/Xamarin.Plugins/tree/master/TextToSpeech
