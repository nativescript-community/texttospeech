import { Page } from 'ui/page';
import { Observable } from "data/observable";
import { isIOS } from 'platform';
import { TNSTextToSpeech, SpeakOptions } from 'nativescript-texttospeech';

export class HelloWorldModel extends Observable {

    public speakText: string;
    private SpeechSynthesizer: TNSTextToSpeech;

    constructor(mainPage: Page) {
        super();
        console.log('page: ' + mainPage);

        this.speakText = 'Hello Brad';
        this.SpeechSynthesizer = new TNSTextToSpeech();
    }


    public speakThis() {
        let opts: SpeakOptions = {
            text: this.get('speakText'),
            speakRate: isIOS ? 0.45 : null,
            finishedCallback: (() => {
                alert('Finished Speaking :)');
            })
        }

        this.SpeechSynthesizer.speak(opts);

    }

    public byebyeTextToSpeech() {
        this.SpeechSynthesizer.destroy();
    }

    public pauseSynthesizer() {
        this.SpeechSynthesizer.pause();
    }


    public resumeSynthesizer() {
        this.SpeechSynthesizer.resume();
    }

}