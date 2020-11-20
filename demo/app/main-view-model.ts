import { Observable, Page, isIOS } from '@nativescript/core';
import { SpeakOptions, TNSTextToSpeech } from '@nativescript-community/texttospeech';

export class HelloWorldModel extends Observable {
    public speakText: string;
    private _SpeechSynthesizer: TNSTextToSpeech;

    constructor(mainPage: Page) {
        super();
        this.speakText = 'Hello and welcome to Native Script. Hope you enjoy the power.';
        this._SpeechSynthesizer = new TNSTextToSpeech();
        this._SpeechSynthesizer.init().catch((err) => {
            alert(err);
        });
    }

    public async speakThis() {
        if (!this._SpeechSynthesizer) {
            this._SpeechSynthesizer = new TNSTextToSpeech();
        }

        const opts: SpeakOptions = {
            text: this.get('speakText'),
            speakRate: isIOS ? 0.45 : null,
            finishedCallback: () => {
                alert('Finished Speaking :)');
            },
        };
        try {
            await this._SpeechSynthesizer.speak(opts);
        } catch (err) {
            alert(err);
        }
    }

    public byebyeSynthesizer() {
        this._SpeechSynthesizer.pause();
        this._SpeechSynthesizer.destroy();
        console.log('destroyed');
    }

    public pauseSynthesizer() {
        this._SpeechSynthesizer.pause();
        console.log('paused speech');
    }

    public resumeSynthesizer() {
        this._SpeechSynthesizer.resume();
        console.log('resumed speech');
    }
}
