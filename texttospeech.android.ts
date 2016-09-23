import * as appModule from 'application';
import { SpeakOptions } from './index.d.ts';


const Locale = java.util.Locale;
const TextToSpeech = android.speech.tts.TextToSpeech;


let initialised: boolean = false;
let tts: any = null;


declare var android, java: any;


export function speak(options: SpeakOptions) {
	if (!isString(options.text)) {
		console.log("Text property is required to speak.");
		return;
	}

	if (options.text.length > 4000) {
		console.log("Text cannot be greater than 4000 characters");
		return;
	}

	if (!tts || !initialised) {
		tts = new TextToSpeech(_getContext(), new TextToSpeech.OnInitListener({
			onInit: function (status) {
				if (status === TextToSpeech.SUCCESS) {
					initialised = true;
					speakText(options);
				}
			}
		}));
	} else {
		speakText(options);
	}
}


function speakText(options: SpeakOptions) {

	if (isString(options.language) && isValidLocale(options.language)) {
		let languageArray = options.language.split("-")
		let locale = new Locale(languageArray[0], languageArray[1]);
		tts.setLanguage(locale);
	}

	if (!isBoolean(options.queue)) {
		options.queue = false;
	}

	if (!options.queue && tts.isSpeaking()) {
		tts.stop();
	}

	// no range of valid values for Android so just cover default value if none provided
	if (!isNumber(options.pitch)) {
		options.pitch = 1.0;
	}

	// no range of valid values for Android so just cover default value if none provided
	if (!isNumber(options.speakRate)) {
		options.speakRate = 1.0;
	}

	// valid values are 0.0 to 1.0
	if (!isNumber(options.volume) || options.volume > 1.0) {
		options.volume = 1.0;
	} else if (options.volume < 0.0) {
		options.volume = 0.0;
	}

	let hashMap = new java.util.HashMap();
	hashMap.put("volume", options.volume.toString());

	tts.setPitch(options.pitch);
	tts.setSpeechRate(options.speakRate);

	let queueMode = options.queue ? TextToSpeech.QUEUE_ADD : TextToSpeech.QUEUE_FLUSH;

	tts.speak(options.text, queueMode, hashMap);
};

// helper function to get current app context 
function _getContext() {
	if (appModule.android.context) {
		return (appModule.android.context);
	}
	var ctx = java.lang.Class.forName("android.app.AppGlobals").getMethod("getInitialApplication", null).invoke(null, null);
	if (ctx) return ctx;

	ctx = java.lang.Class.forName("android.app.ActivityThread").getMethod("currentApplication", null).invoke(null, null);
	return ctx;
}

// helper function to test whether language code has valid syntax
function isValidLocale(locale) {
	var re = new RegExp("\\w\\w-\\w\\w");
	return re.test(locale);
}


function isString(elem) {
	return Object.prototype.toString.call(elem).slice(8, -1) === 'String';
};

function isBoolean(elem) {
	return Object.prototype.toString.call(elem).slice(8, -1) === 'Boolean';
};

function isNumber(elem) {
	return Object.prototype.toString.call(elem).slice(8, -1) === 'Number';
};