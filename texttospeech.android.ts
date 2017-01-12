import * as appModule from 'application';
import { SpeakOptions } from './index.d.ts';

declare var android, java: any;

const Locale = java.util.Locale;

export class TNSTextToSpeech {
    private _tts: any /// android.speech.tts.TextToSpeech
	private _initialized: boolean = false;
	private _lastOptions: SpeakOptions = null;  // saves a reference to the last passed SpeakOptions for pause/resume/callback methods.
	private _utteranceProgressListener = android.speech.tts.UtteranceProgressListener.extend({
		init: (() => {
			// console.log("UtteranceProgressListener created!");
		}),
		onStart: ((utteranceId: string) => {
			// TODO
		}),
		onError: ((utteranceId: string) => {
			// TODO
		}),
		onDone: ((utteranceId: string) => {
			if (this._lastOptions.finishedCallback) {
				this._lastOptions.finishedCallback();
			}
		})
	});


	public speak(options: SpeakOptions) {

		if (!this.isString(options.text)) {
			console.log("Text property is required to speak.");
			return;
		}

		if (options.text.length > 4000) {
			console.log("Text cannot be greater than 4000 characters");
			return;
		}

		// save a reference to the options passed in for pause/resume methods to use
		this._lastOptions = options;

		if (!this._tts || !this._initialized) {
			this._tts = new android.speech.tts.TextToSpeech(this._getContext(), new android.speech.tts.TextToSpeech.OnInitListener({
				onInit: ((status) => {
					// if the TextToSpeech was successful initializing
					if (status === android.speech.tts.TextToSpeech.SUCCESS) {
						this._initialized = true;

						this._tts.setOnUtteranceProgressListener(new this._utteranceProgressListener());

						this.speakText(options);
					}

				})
			}))
		} else {
			this.speakText(options);
		}
	}



	/**
	 * Interrupts the current utterance and discards other utterances in the queue.
	 * https://developer.android.com/reference/android/speech/tts/TextToSpeech.html#stop()
	 */
	public pause() {
		if (this._tts && this._initialized) {
			this._tts.stop();
		}
	}


	public resume() {
		//In Android there's no pause so we resume playng the last phrase...
		if (this._lastOptions) {
			this.speak(this._lastOptions);
		}
	}

	/**
 	 * Releases the resources used by the TextToSpeech engine.
 	 * https://developer.android.com/reference/android/speech/tts/TextToSpeech.html#shutdown()
 	 */
	public destroy() {
		if (this._tts) {
			this._tts.shutdown();
		}
	}





	private speakText(options: SpeakOptions) {

		if (this.isString(options.language) && this.isValidLocale(options.language)) {
			let languageArray = options.language.split("-")
			let locale = new Locale(languageArray[0], languageArray[1]);
			this._tts.setLanguage(locale);
		}

		if (!this.isBoolean(options.queue)) {
			options.queue = false;
		}

		if (!options.queue && this._tts.isSpeaking()) {
			this._tts.stop();
		}

		// no range of valid values for Android so just cover default value if none provided
		if (!this.isNumber(options.pitch)) {
			options.pitch = 1.0;
		}

		// no range of valid values for Android so just cover default value if none provided
		if (!this.isNumber(options.speakRate)) {
			options.speakRate = 1.0;
		}

		// valid values are 0.0 to 1.0
		if (!this.isNumber(options.volume) || options.volume > 1.0) {
			options.volume = 1.0;
		} else if (options.volume < 0.0) {
			options.volume = 0.0;
		}


		this._tts.setPitch(options.pitch);
		this._tts.setSpeechRate(options.speakRate);

		let queueMode = options.queue ? android.speech.tts.TextToSpeech.QUEUE_ADD : android.speech.tts.TextToSpeech.QUEUE_FLUSH;

		if (android.os.Build.VERSION.SDK_INT >= 21) { // Hardcoded this value since the static field LOLLIPOP doesn't exist in Android 4.4
			/// >= Android API 21 - https://developer.android.com/reference/android/speech/tts/TextToSpeech.html#speak(java.lang.CharSequence, int, android.os.Bundle, java.lang.String)
			let params = new android.os.Bundle();
			params.putString("volume", options.volume.toString());
			this._tts.speak(options.text, queueMode, params, "UniqueID");
		} else {
			/// < Android API 21 - https://developer.android.com/reference/android/speech/tts/TextToSpeech.html#speak(java.lang.String, int, java.util.HashMap<java.lang.String, java.lang.String>)
			let hashMap = new java.util.HashMap();
			hashMap.put("volume", options.volume.toString());
			this._tts.speak(options.text, queueMode, hashMap);
		}

	}


	// helper function to get current app context 
	private _getContext() {
		if (appModule.android.context) {
			return (appModule.android.context);
		}
		var ctx = java.lang.Class.forName("android.app.AppGlobals").getMethod("getInitialApplication", null).invoke(null, null);
		if (ctx) return ctx;

		ctx = java.lang.Class.forName("android.app.ActivityThread").getMethod("currentApplication", null).invoke(null, null);
		return ctx;
	}

	// helper function to test whether language code has valid syntax
	private isValidLocale(locale) {
		var re = new RegExp("\\w\\w-\\w\\w");
		return re.test(locale);
	}


	private isString(elem) {
		return Object.prototype.toString.call(elem).slice(8, -1) === 'String';
	};

	private isBoolean(elem) {
		return Object.prototype.toString.call(elem).slice(8, -1) === 'Boolean';
	};

	private isNumber(elem) {
		return Object.prototype.toString.call(elem).slice(8, -1) === 'Number';
	};

}






