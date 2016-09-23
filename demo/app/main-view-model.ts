import { Page } from 'ui/page';
import { Observable } from "data/observable";
import { isIOS } from 'platform';
import { SpeakOptions, speak } from 'nativescript-texttospeech';

export class HelloWorldModel extends Observable {

    public speakText: string;

    constructor(mainPage: Page) {
        super();
        console.log('page: ' + mainPage);

        this.speakText = 'Hello Brad';
    }


    public speakThis() {
        let opts: SpeakOptions = {
            text: this.get('speakText'),
            speakRate: isIOS ? 0.45 : null
        }

        speak(opts);

    }

}