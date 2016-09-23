/**
 * Initiate the text to speech.
 * @param {object} SpeakOptions - SpeakOptions object.
 */
export function speak(options: SpeakOptions);


export interface SpeakOptions {
    text: string;
    queue?: boolean;
    pitch?: number;
    speakRate?: number;
    volume?: number;
    language?: string;
}