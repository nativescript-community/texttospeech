/**
 * Initiate the text to speech.
 * @param {string} text - The text to speak.
 * @param {boolean} [queue=false] - To queue the speak call.
 * @param {number} [pitch=1.0] - To pitch of the speech.
 * @param {number} [speakRate=1.0] - The speak rate of the speech.
 * @param {number} [volume=1.0] - The volume of the speech.
 * @param {string} [language=default system language] - To queue the speak call.
 */
export function speak(text: string, queue?: boolean, pitch?: number, speakRate?: number, volume?: number, language?: string);
