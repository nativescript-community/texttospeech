export declare class TNSTextToSpeech {
    init(): Promise<void>;

    /**
     * Initiate the text to speech.
     * @param {object} SpeakOptions - SpeakOptions object.
     */
    speak(options: SpeakOptions): Promise<void>;

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

    /**
     * Android only: Returns array of available Languages
     */
    getAvailableLanguages(): Promise<Language[]>;
}

export interface SpeakOptions {
    text: string;
    queue?: boolean;
    pitch?: number;
    speakRate?: number;
    volume?: number;
    locale?: string;
    language?: string;
    finishedCallback?: Function;

    /**
     * Callback to execute when info is emitted from the player.
     * @returns {Object} An object containing the native values for the info callback.
     */
    infoCallback?: Function;

    /**
     * iOS: The category for playing recorded music or other sounds that are central to the successful use of your app.
     *  https://developer.apple.com/documentation/avfaudio/avaudiosessioncategory?language=objc
     */
    sessionCategory?: string;

    /**
     * iOS: Audio session mode identifiers.
     * https://developer.apple.com/documentation/avfaudio/avaudiosessionmode
     */
    sessionMode?: string;

    /**
     * iOS: Cases that indicate the possible route-sharing policies for an audio session.
     * https://developer.apple.com/documentation/avfaudio/avaudiosessionroutesharingpolicy
     */
    sessionRouteSharingPolicy?: AVAudioSessionRouteSharingPolicy;

    audioMixing?: boolean;
}

export interface Language {
    language: string;
    languageDisplay: string;
    country: string;
    countryDisplay: string;
}
