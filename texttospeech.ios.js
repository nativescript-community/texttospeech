"use strict";
var speechSynthesizer;
function speak(options) {
    if (!speechSynthesizer) {
        speechSynthesizer = AVSpeechSynthesizer.alloc().init();
    }
    if (!isString(options.text)) {
        console.log("Text is required to speak.");
        return;
    }
    if (!isNumber(options.pitch)) {
        options.pitch = 1.0;
    }
    else if (options.pitch < 0.5) {
        options.pitch = 0.5;
    }
    else if (options.pitch > 2.0) {
        options.pitch = 2.0;
    }
    if (!isNumber(options.speakRate)) {
        options.speakRate = AVSpeechUtterance.AVSpeechUtteranceMaximumSpeechRate / 4.0;
    }
    else if (options.speakRate < AVSpeechUtterance.AVSpeechUtteranceMinimumSpeechRate) {
        options.speakRate = AVSpeechUtterance.AVSpeechUtteranceMinimumSpeechRate;
    }
    else if (options.speakRate > AVSpeechUtterance.AVSpeechUtteranceMaximumSpeechRate) {
        options.speakRate = AVSpeechUtterance.AVSpeechUtteranceMaximumSpeechRate;
    }
    if (!isNumber(options.volume) || options.volume > 1.0) {
        options.volume = 1.0;
    }
    else if (options.volume < 0.0) {
        options.volume = 0.0;
    }
    var speechUtterance = AVSpeechUtterance.alloc().initWithString(options.text);
    if (isString(options.language) && isValidLocale(options.language)) {
        speechUtterance.voice = AVSpeechSynthesisVoice.voiceWithLanguage(options.language);
    }
    speechUtterance.pitchMultiplier = options.pitch;
    speechUtterance.volume = options.volume;
    speechUtterance.rate = options.speakRate;
    if (!isBoolean(options.queue)) {
        options.queue = false;
    }
    if (!options.queue && speechSynthesizer.speaking) {
        speechSynthesizer.stopSpeakingAtBoundary(AVSpeechBoundary.AVSpeechBoundaryImmediate);
    }
    speechSynthesizer.speakUtterance(speechUtterance);
}
exports.speak = speak;
function isString(elem) {
    return Object.prototype.toString.call(elem).slice(8, -1) === 'String';
}
;
function isBoolean(elem) {
    return Object.prototype.toString.call(elem).slice(8, -1) === 'Boolean';
}
;
function isNumber(elem) {
    return Object.prototype.toString.call(elem).slice(8, -1) === 'Number';
}
;
function isValidLocale(locale) {
    var re = new RegExp("\\w\\w-\\w\\w");
    return re.test(locale);
}
//# sourceMappingURL=texttospeech.ios.js.map