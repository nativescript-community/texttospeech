var appModule = require("application");
var TextToSpeech = android.speech.tts.TextToSpeech;
var Locale = java.util.Locale;
var initialised = false;
var tts;

var text_to_speech = {
	speak : function(text, queue, pitch, speakRate, volume, language){
		if(!isString(text)) {
			console.log("no text was provided");
			return;
		}

		if(text.length > 4000) {
			console.log("text cannot be greater than 4000 characters");
			return;
		}

		if(!tts || !initialised) {
			tts = new TextToSpeech(_getContext(), new TextToSpeech.OnInitListener({
				onInit : function(status) {
					if(status === TextToSpeech.SUCCESS) {
						initialised = true;
						speakText(text, queue, pitch, speakRate, volume, language);
					}
				}
			}));
		} else {
			speakText(text, queue, pitch, speakRate, volume, language);
		}
	}
};

var isString = function (elem) {
	return Object.prototype.toString.call(elem).slice(8, -1) === 'String';
};

var isBoolean = function (elem) {
	return Object.prototype.toString.call(elem).slice(8, -1) === 'Boolean';
};

var isNumber = function (elem) {
	return Object.prototype.toString.call(elem).slice(8, -1) === 'Number';
};

var speakText = function(text, queue, pitch, speakRate, volume, language) {

	if (isString(language) && isValidLocale(language)) {
		var languageArray = language.split("-")
		var locale = new Locale(languageArray[0],languageArray[1]);
		tts.setLanguage(locale);
	}

	if(!isBoolean(queue)) {
		queue = false;
	}

	if(!queue && tts.isSpeaking()) {
		tts.stop();
	}

	// no range of valid values for Android so just cover default value if none provided
	if(!isNumber(pitch)) {
		pitch = 1.0;
	}

	// no range of valid values for Android so just cover default value if none provided
	if(!isNumber(speakRate)) {
		speakRate = 1.0;
	}

	// valid values are 0.0 to 1.0
	if(!isNumber(volume) || volume > 1.0) {
		volume = 1.0;
	} else if(volume < 0.0) {
		volume = 0.0;
	}

	var hashMap = new java.util.HashMap();
	hashMap.put("volume", volume.toString());

	tts.setPitch(pitch);
	tts.setSpeechRate(speakRate);

	var queueMode = queue ? TextToSpeech.QUEUE_ADD : TextToSpeech.QUEUE_FLUSH;

	tts.speak(text, queueMode, hashMap);
};

// helper function to get current app context 
var _getContext = function() {
    if (appModule.android.context) {
        return (appModule.android.context);
    }
    var ctx = java.lang.Class.forName("android.app.AppGlobals").getMethod("getInitialApplication", null).invoke(null, null);
    if (ctx) return ctx;

    ctx = java.lang.Class.forName("android.app.ActivityThread").getMethod("currentApplication", null).invoke(null, null);
    return ctx;
}

// helper function to test whether language code has valid syntax
var isValidLocale = function(locale) {
	var re = new RegExp("\\w\\w-\\w\\w");
	return re.test(locale);
}

module.exports = text_to_speech;
