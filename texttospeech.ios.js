
var finishedCallback;
var Delegate = NSObject.extend({
	speechSynthesizerDidStartSpeechUtterance:function (synthesizer, utterance){
		//console.log("Started speaking");
	},
	speechSynthesizerDidFinishSpeechUtterance:function(synthesizer, utterance){
		//console.log("Finished speaking");
		if (finishedCallback){
			finishedCallback();
		}
		
	},
	speechSynthesizerDidPauseSpeechUtterance:function(synthesizer, utterance){
		//console.log("Paused speaking");
	},
	speechSynthesizerDidContinueSpeechUtterance:function(synthesizer, utterance){
		//console.log("Continued speaking");
	},
	speechSynthesizerDidCancelSpeechUtterance:function(synthesizer, utterance){
		//console.log("Cancelled speaking");
	}
	}, {
    // The name for the registered Objective-C class.
    name: "MySpeechDelegate",
    // Declare that the native Objective-C class will implement the AVSpeechSynthesizerDelegate Objective-C protocol.
    protocols: [AVSpeechSynthesizerDelegate]
});

var speechSynthesizer;
var delegate;


function getSpeechSynthesizer(){
		if(!speechSynthesizer) {
			speechSynthesizer = AVSpeechSynthesizer.alloc().init();
			speechSynthesizer.delegate = new Delegate();
		}
		return speechSynthesizer;
}

var text_to_speech = {
	speak : function(text, queue, pitch, speakRate, volume, language, callbackOnFinish) {
		getSpeechSynthesizer();
		//Set a finish callback
		finishedCallback = callbackOnFinish;
		if(!isString(text)) {
			console.log("no text was provided");
			return;
		}
		
		// valid values for pitch are 0.5 to 2.0
		if(!isNumber(pitch)) {
			pitch = 1.0;
		} else if(pitch < 0.5) {
			pitch = 0.5;
		} else if(pitch > 2.0) {
			pitch = 2.0;
		}

		// valid values are AVSpeechUtteranceMinimumSpeechRate to AVSpeechUtteranceMaximumSpeechRate
		if(!isNumber(speakRate)) {
			speakRate = 0.5;//AVSpeechUtterance.AVSpeechUtteranceMaximumSpeechRate / 4.0; // default rate is way too fast
		} else if(speakRate < AVSpeechUtterance.AVSpeechUtteranceMinimumSpeechRate) {
			speakRate = AVSpeechUtterance.AVSpeechUtteranceMinimumSpeechRate;
		} else if(speakRate > AVSpeechUtterance.AVSpeechUtteranceMaximumSpeechRate) {
			speakRate = AVSpeechUtterance.AVSpeechUtteranceMaximumSpeechRate;
		}

		// valid values for volume are 0.0 to 1.0
		if(!isNumber(volume) || volume > 1.0) {
			volume = 1.0;
		} else if(volume < 0.0) {
			volume = 0.0;
		}

		var speechUtterance = AVSpeechUtterance.alloc().initWithString(text);

		if (isString(language) && isValidLocale(language)) {
			speechUtterance.voice = AVSpeechSynthesisVoice.voiceWithLanguage(language);
		}

		speechUtterance.pitchMultiplier = pitch;
		speechUtterance.volume = volume;
		speechUtterance.rate = speakRate;

		if(!isBoolean(queue)) {
			queue = false;
		}

		if(!queue && speechSynthesizer.speaking) {
			speechSynthesizer.stopSpeakingAtBoundary(AVSpeechBoundary.AVSpeechBoundaryImmediate);
		}
		speechSynthesizer.speakUtterance(speechUtterance);
	},
	pause: function(now){
		getSpeechSynthesizer().pauseSpeakingAtBoundary(now ? AVSpeechBoundary.AVSpeechBoundaryImmediate : AVSpeechBoundary.AVSpeechBoundaryWord);
	},
	resume:function(){
		getSpeechSynthesizer().continueSpeaking();
	},

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

// helper function to test whether language code has valid syntax
var isValidLocale = function(locale) {
	var re = new RegExp("\\w\\w-\\w\\w");
	return re.test(locale);
}


module.exports = text_to_speech;