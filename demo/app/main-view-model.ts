import { Page } from "tns-core-modules/ui/page";
import { Observable } from "tns-core-modules/data/observable";
import { isIOS } from "tns-core-modules/platform";
import { TNSTextToSpeech, SpeakOptions } from "nativescript-texttospeech";

export class HelloWorldModel extends Observable {
  public speakText: string;
  private _SpeechSynthesizer: TNSTextToSpeech;

  constructor(mainPage: Page) {
    super();
    this.speakText = "Hello Brad";
    this._SpeechSynthesizer = new TNSTextToSpeech() as TNSTextToSpeech;
    this._SpeechSynthesizer.speak({ text: "" });
  }

  public speakThis() {
    const opts: SpeakOptions = {
      text: this.get("speakText"),
      speakRate: isIOS ? 0.45 : null,
      finishedCallback: () => {
        alert("Finished Speaking :)");
      }
    };

    this._SpeechSynthesizer.speak(opts);
  }

  public byebyeTextToSpeech() {
    this._SpeechSynthesizer.destroy();
  }

  public pauseSynthesizer() {
    this._SpeechSynthesizer.pause();
  }

  public resumeSynthesizer() {
    this._SpeechSynthesizer.resume();
  }
}
