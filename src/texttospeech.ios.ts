import { SpeakOptions } from './index';

@NativeClass
class MySpeechDelegate extends NSObject {
    doneCallback;
    public static ObjCProtocols = [AVSpeechSynthesizerDelegate];
    public speechSynthesizerDidStartSpeechUtterance(synthesizer, utterance) {
        // TODO
    }

    public speechSynthesizerDidFinishSpeechUtterance(synthesizer, utterance) {
        if (this.doneCallback) {
            this.doneCallback();
        }
    }

    public speechSynthesizerDidPauseSpeechUtterance(synthesizer, utterance) {
        // TODO
    }

    public speechSynthesizerDidContinueSpeechUtterance(synthesizer, utterance) {
        // console.log("Continued speaking");
    }

    public speechSynthesizerDidCancelSpeechUtterance(synthesizer, utterance) {
        // console.log("Cancelled speaking");
    }
}

function isString(elem) {
    return typeof elem === 'string';
}

function isBoolean(elem) {
    return typeof elem === 'boolean';
}

function isNumber(elem) {
    return typeof elem === 'number' && isFinite(elem);
}

export class TNSTextToSpeech {
    private _speechSynthesizer: AVSpeechSynthesizer;
    private _lastOptions: SpeakOptions = null;
    delegate: MySpeechDelegate;

    public async init() {
        //stub function to be like android
    }
    public async speak(options: SpeakOptions): Promise<any> {
        if (!this._speechSynthesizer) {
            this._speechSynthesizer = AVSpeechSynthesizer.alloc().init();
            this._speechSynthesizer.delegate = this.delegate = new MySpeechDelegate();
        }

        if (!isString(options.text)) {
            throw new Error('Text is required to speak.');
        }

        this._lastOptions = options;

        const needsAudioSession = options.sessionCategory || options.sessionMode || options.sessionRouteSharingPolicy || options.audioMixing;
        const audioSession = AVAudioSession.sharedInstance();

        if (needsAudioSession) {
            audioSession.setCategoryModeRouteSharingPolicyOptionsError(
                options.sessionCategory !== undefined ? options.sessionCategory : AVAudioSessionCategoryAmbient,
                options.sessionMode !== undefined ? options.sessionMode : AVAudioSessionModeDefault,
                options.sessionRouteSharingPolicy !== undefined ? options.sessionRouteSharingPolicy : AVAudioSessionRouteSharingPolicy.Default,
                options.audioMixing ? AVAudioSessionCategoryOptions.MixWithOthers : AVAudioSessionCategoryOptions.DuckOthers,
                //@ts-ignore
                null
            );
            audioSession.setActiveError(true);
        }
        this.delegate.doneCallback = () => {
            if (needsAudioSession) {
                audioSession.setActiveError(false);
            }
            options?.finishedCallback?.();
        };

        // valid values for pitch are 0.5 to 2.0
        if (!isNumber(options.pitch)) {
            options.pitch = 1.0;
        } else if (options.pitch < 0.5) {
            options.pitch = 0.5;
        } else if (options.pitch > 2.0) {
            options.pitch = 2.0;
        }

        // valid values are AVSpeechUtteranceMinimumSpeechRate to AVSpeechUtteranceMaximumSpeechRate
        if (!isNumber(options.speakRate)) {
            options.speakRate = AVSpeechUtteranceMaximumSpeechRate / 2.5; // default rate is way too fast
        } else if (options.speakRate < AVSpeechUtteranceMinimumSpeechRate) {
            options.speakRate = AVSpeechUtteranceMinimumSpeechRate;
        } else if (options.speakRate > AVSpeechUtteranceMaximumSpeechRate) {
            options.speakRate = AVSpeechUtteranceMaximumSpeechRate;
        }

        // valid values for volume are 0.0 to 1.0
        if (!isNumber(options.volume) || options.volume > 1.0) {
            options.volume = 1.0;
        } else if (options.volume < 0.0) {
            options.volume = 0.0;
        }

        const speechUtterance = AVSpeechUtterance.alloc().initWithString(options.text);

        let localeStr = options.locale || options.language;
        if (localeStr) {
            if (localeStr.indexOf('-') === -1) {
                localeStr = localeStr + '-' + localeStr.toUpperCase();
            }
            speechUtterance.voice = AVSpeechSynthesisVoice.voiceWithLanguage(localeStr);
        }
        speechUtterance.pitchMultiplier = options.pitch;
        speechUtterance.volume = options.volume;
        speechUtterance.rate = options.speakRate;

        if (!isBoolean(options.queue)) {
            options.queue = false;
        }

        if (!options.queue && this._speechSynthesizer.speaking) {
            this._speechSynthesizer.stopSpeakingAtBoundary(AVSpeechBoundary.Immediate);
        }

        this._speechSynthesizer.speakUtterance(speechUtterance);
    }

    public pause(now) {
        this._speechSynthesizer.pauseSpeakingAtBoundary(now ? AVSpeechBoundary.Immediate : AVSpeechBoundary.Word);
    }

    public resume() {
        this._speechSynthesizer.continueSpeaking();
    }

    public destroy() {
        /// does iOS have anything to destroy/free resources???
        this._speechSynthesizer = null;
    }

    /**
     * Private Methods
     */

    // helper function to test whether language code has valid syntax
    private isValidLocale(locale) {
        const re = new RegExp('\\w\\w-\\w\\w');
        return re.test(locale);
    }
}
