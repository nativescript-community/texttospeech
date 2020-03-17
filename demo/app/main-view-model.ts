import { SpeakOptions, TNSTextToSpeech } from 'nativescript-texttospeech';
import { Observable } from 'tns-core-modules/data/observable';
import { isIOS } from 'tns-core-modules/platform';
import { Page } from 'tns-core-modules/ui/page';

export class HelloWorldModel extends Observable {
  public speakText: string;
  private _SpeechSynthesizer: TNSTextToSpeech;

  constructor(mainPage: Page) {
    super();
    this.speakText =
      'Hello and welcome to Native Script. Hope you enjoy the power.';
    this._SpeechSynthesizer = new TNSTextToSpeech() as TNSTextToSpeech;
    this._SpeechSynthesizer.speak({ text: '' });
  }

  public speakThis() {
    if (!this._SpeechSynthesizer) {
      this._SpeechSynthesizer = new TNSTextToSpeech() as TNSTextToSpeech;
    }

    const opts: SpeakOptions = {
      text: this.get('speakText'),
      speakRate: isIOS ? 0.45 : null,
      finishedCallback: () => {
        alert('Finished Speaking :)');
      }
    };

    this._SpeechSynthesizer.speak(opts);
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
