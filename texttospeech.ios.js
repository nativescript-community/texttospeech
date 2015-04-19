var speechSynthesizer;

var text_to_speech = {
	speak : function(text, queue, pitch, speakRate, volume) {
		if(!speechSynthesizer) {
			speechSynthesizer = AVSpeechSynthesizer.alloc().init();
		}

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
			speakRate = AVSpeechUtterance.AVSpeechUtteranceMaximumSpeechRate / 4.0; // default rate is way too fast
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

module.exports = text_to_speech;