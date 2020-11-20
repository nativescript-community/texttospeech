import { Application } from '@nativescript/core';
import { Language, SpeakOptions } from './index';

@NativeClass
class UtteranceProgressListener extends android.speech.tts.UtteranceProgressListener {
    finishedCallback;
    onStart(utteranceId: string) {
        // TODO
    }
    onError(utteranceId: string) {
        // TODO
    }
    onDone(utteranceId: string) {
        if (this.finishedCallback) {
            this.finishedCallback();
        }
    }
}

export class TNSTextToSpeech {
    private _tts: android.speech.tts.TextToSpeech;
    private _initialized: boolean = false;
    private _lastOptions: SpeakOptions = null; // saves a reference to the last passed SpeakOptions for pause/resume/callback methods.
    private listener: UtteranceProgressListener;

    private async init() {
        if (!this._tts || !this._initialized) {
            return new Promise<void>((resolve, reject) => {
                this._tts = new android.speech.tts.TextToSpeech(
                    this._getContext(),
                    new android.speech.tts.TextToSpeech.OnInitListener({
                        onInit: (status) => {
                            // if the TextToSpeech was successful initializing
                            console.log('init done', status);
                            if (status === android.speech.tts.TextToSpeech.SUCCESS) {
                                this._initialized = true;
                                const listener = new UtteranceProgressListener();
                                this.listener = listener;
                                this._tts.setOnUtteranceProgressListener(listener);
                                resolve();
                            } else {
                                reject(new Error('TextToSpeech failed to init with code ' + status));
                            }
                        },
                    })
                );
            });
        }
    }

    public async speak(options: SpeakOptions) {
        if (!this.isString(options.text)) {
            throw new Error('Text property is required to speak.');
        }
        await this.init();
        let maxLen: number = 4000; // API level 18 added method for getting value dynamically
        if (android.os.Build.VERSION.SDK_INT >= 18) {
            try {
                maxLen = android.speech.tts.TextToSpeech.getMaxSpeechInputLength();
            } catch (error) {
                console.log(error);
            }
        }

        if (options.text.length > maxLen) {
            throw new Error('Text cannot be greater than ' + maxLen.toString() + ' characters');
        }

        // save a reference to the options passed in for pause/resume methods to use
        this._lastOptions = options;
        this.listener.finishedCallback = () => {
            options.finishedCallback && options.finishedCallback();
            this._lastOptions = null;
        };

        this.speakText(options);
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
        // In Android there's no pause so we resume playng the last phrase...
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
        if (this.isString(options.locale) && this.isValidLocale(options.locale)) {
            const localeArray = options.locale.split('-');
            const locale = new java.util.Locale(localeArray[0], localeArray[1]);
            this._tts.setLanguage(locale);
        } else if (this.isString(options.language)) {
            let locale = null;
            if (this.isValidLocale(options.language)) {
                // only for backwards compatbility with old API
                const languageArray = options.language.split('-');
                locale = new java.util.Locale(languageArray[0], languageArray[1]);
            } else {
                locale = new java.util.Locale(options.language);
            }
            if (locale) {
                this._tts.setLanguage(locale);
            }
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

        const queueMode = options.queue ? android.speech.tts.TextToSpeech.QUEUE_ADD : android.speech.tts.TextToSpeech.QUEUE_FLUSH;
        console.log('about to speak');
        if (android.os.Build.VERSION.SDK_INT >= 21) {
            // Hardcoded this value since the static field LOLLIPOP doesn't exist in Android 4.4
            /// >= Android API 21 - https://developer.android.com/reference/android/speech/tts/TextToSpeech.html#speak(java.lang.CharSequence, int, android.os.Bundle, java.lang.String)
            const params = new android.os.Bundle();
            params.putString('volume', options.volume.toString());
            this._tts.speak(options.text, queueMode, params, 'UniqueID');
        } else {
            /// < Android API 21 - https://developer.android.com/reference/android/speech/tts/TextToSpeech.html#speak(java.lang.String, int, java.util.HashMap<java.lang.String, java.lang.String>)
            const hashMap = new java.util.HashMap();
            hashMap.put('volume', options.volume.toString());
            this._tts.speak(options.text, queueMode, hashMap);
        }
    }

    public getAvailableLanguages(): Promise<Language[]> {
        return new Promise((resolve, reject) => {
            const result: Language[] = new Array<Language>();
            this.init().then(
                () => {
                    const languages = this._tts.getAvailableLanguages().toArray();
                    for (let c = 0; c < languages.length; c++) {
                        const lang: Language = {
                            language: languages[c].getLanguage(),
                            languageDisplay: languages[c].getDisplayLanguage(),
                            country: languages[c].getCountry(),
                            countryDisplay: languages[c].getDisplayCountry(),
                        };
                        result.push(lang);
                    }
                    resolve(result);
                },
                (err) => {
                    reject(err);
                }
            );
        });
    }

    // helper function to get current app context
    private _getContext() {
        if (Application.android.context) {
            return Application.android.context;
        }

        let ctx = java.lang.Class.forName('android.app.AppGlobals').getMethod('getInitialApplication', null).invoke(null, null);

        if (ctx) {
            return ctx;
        }

        ctx = java.lang.Class.forName('android.app.ActivityThread').getMethod('currentApplication', null).invoke(null, null);
        return ctx;
    }

    // helper function to test whether language code has valid syntax
    private isValidLocale(locale) {
        const re = new RegExp('\\w\\w-\\w\\w');
        return re.test(locale);
    }

    private isString(elem) {
        return Object.prototype.toString.call(elem).slice(8, -1) === 'String';
    }

    private isBoolean(elem) {
        return Object.prototype.toString.call(elem).slice(8, -1) === 'Boolean';
    }

    private isNumber(elem) {
        return Object.prototype.toString.call(elem).slice(8, -1) === 'Number';
    }
}
