
export declare class TNSTextToSpeech {

    /**
     * Initiate the text to speech.
     * @param {object} SpeakOptions - SpeakOptions object.
     */
    speak(options: SpeakOptions): void;


    /**
     * Release the resources used by the TextToSpeech engine/synthesizer
     */
    destroy(): void;


    /**
     * Pause the engine/synthesizer currently speaking.
     */
    pause(): void;


    /**
     * Resume the engine/synthesizer. On Android it will start from beginning - since there is no actual pause, only stop.
     */
    resume(): void;

}



export interface SpeakOptions {
    text: string;
    queue?: boolean;
    pitch?: number;
    speakRate?: number;
    volume?: number;
    language?: string;
    finishedCallback?: Function;
}