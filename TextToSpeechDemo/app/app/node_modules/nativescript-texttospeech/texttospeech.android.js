var app = require("application");
var context = app.android.context;
var TextToSpeech = android.speech.tts.TextToSpeech;
var initialised = false;
var tts;

var text_to_speech = {
	speak : function(text, queue, pitch, speakRate, volume){
		if(!isString(text)) {
			console.log("no text was provided");
			return;
		}

		if(text.length > 4000) {
			console.log("text cannot be greater than 4000 characters");
			return;
		}

		if(!tts || !initialised) {
			tts = new TextToSpeech(context, new TextToSpeech.OnInitListener({
				onInit : function(status) {
					if(status === TextToSpeech.SUCCESS) {
						initialised = true;
						speakText(text, queue, pitch, speakRate, volume);
					}
				}
			}));
		} else {
			speakText(text, queue, pitch, speakRate, volume);
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

var speakText = function(text, queue, pitch, speakRate, volume) {
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
	hashMap.put(TextToSpeech.Engine.KEY_PARAM_VOLUME, volume.toString());

	tts.setPitch(pitch);
	tts.setSpeechRate(speakRate);

	var queueMode = queue ? TextToSpeech.QUEUE_ADD : TextToSpeech.QUEUE_FLUSH;

	tts.speak(text, queueMode, hashMap);
};

module.exports = text_to_speech;