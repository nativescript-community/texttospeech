"use strict";
var appModule = require('application');
var Locale = java.util.Locale;
var TextToSpeech = android.speech.tts.TextToSpeech;
var initialised = false;
var tts = null;
function speak(options) {
    if (!isString(options.text)) {
        console.log("Text property is required to speak.");
        return;
    }
    if (options.text.length > 4000) {
        console.log("Text cannot be greater than 4000 characters");
        return;
    }
    if (!tts || !initialised) {
        tts = new TextToSpeech(_getContext(), new TextToSpeech.OnInitListener({
            onInit: function (status) {
                if (status === TextToSpeech.SUCCESS) {
                    initialised = true;
                    speakText(options);
                }
            }
        }));
    }
    else {
        speakText(options);
    }
}
exports.speak = speak;
function speakText(options) {
    if (isString(options.language) && isValidLocale(options.language)) {
        var languageArray = options.language.split("-");
        var locale = new Locale(languageArray[0], languageArray[1]);
        tts.setLanguage(locale);
    }
    if (!isBoolean(options.queue)) {
        options.queue = false;
    }
    if (!options.queue && tts.isSpeaking()) {
        tts.stop();
    }
    if (!isNumber(options.pitch)) {
        options.pitch = 1.0;
    }
    if (!isNumber(options.speakRate)) {
        options.speakRate = 1.0;
    }
    if (!isNumber(options.volume) || options.volume > 1.0) {
        options.volume = 1.0;
    }
    else if (options.volume < 0.0) {
        options.volume = 0.0;
    }
    var hashMap = new java.util.HashMap();
    hashMap.put("volume", options.volume.toString());
    tts.setPitch(options.pitch);
    tts.setSpeechRate(options.speakRate);
    var queueMode = options.queue ? TextToSpeech.QUEUE_ADD : TextToSpeech.QUEUE_FLUSH;
    tts.speak(options.text, queueMode, hashMap);
}
;
function _getContext() {
    if (appModule.android.context) {
        return (appModule.android.context);
    }
    var ctx = java.lang.Class.forName("android.app.AppGlobals").getMethod("getInitialApplication", null).invoke(null, null);
    if (ctx)
        return ctx;
    ctx = java.lang.Class.forName("android.app.ActivityThread").getMethod("currentApplication", null).invoke(null, null);
    return ctx;
}
function isValidLocale(locale) {
    var re = new RegExp("\\w\\w-\\w\\w");
    return re.test(locale);
}
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
//# sourceMappingURL=texttospeech.android.js.map