import { SpeakOptions } from './index.d.ts';

declare var AVSpeechUtterance, AVSpeechSynthesizer, AVSpeechSynthesisVoice, AVSpeechBoundary: any;

let speechSynthesizer: any;

export function speak(options: SpeakOptions) {
	if (!speechSynthesizer) {
		speechSynthesizer = AVSpeechSynthesizer.alloc().init();
	}

	if (!isString(options.text)) {
		console.log("Text is required to speak.");
		return;
	}

	// valid values for pitch are 0.5 to 2.0
	if (!isNumber(options.pitch)) {
		options.pitch = 1.0;
	} else if (options.pitch < 0.5) {
		options.pitch = 0.5;
	} else if (options.pitch > 2.0) {
		options.pitch = 2.0;
	}

	// valid values are AVSpeechUtteranceMinimumSpeechRate to AVSpeechUtteranceMaximumSpeechRate
	if (!isNumber(options.speakRate)) {
		options.speakRate = AVSpeechUtterance.AVSpeechUtteranceMaximumSpeechRate / 4.0; // default rate is way too fast
	} else if (options.speakRate < AVSpeechUtterance.AVSpeechUtteranceMinimumSpeechRate) {
		options.speakRate = AVSpeechUtterance.AVSpeechUtteranceMinimumSpeechRate;
	} else if (options.speakRate > AVSpeechUtterance.AVSpeechUtteranceMaximumSpeechRate) {
		options.speakRate = AVSpeechUtterance.AVSpeechUtteranceMaximumSpeechRate;
	}

	// valid values for volume are 0.0 to 1.0
	if (!isNumber(options.volume) || options.volume > 1.0) {
		options.volume = 1.0;
	} else if (options.volume < 0.0) {
		options.volume = 0.0;
	}

	let speechUtterance = AVSpeechUtterance.alloc().initWithString(options.text);

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

function isString(elem) {
	return Object.prototype.toString.call(elem).slice(8, -1) === 'String';
};

function isBoolean(elem) {
	return Object.prototype.toString.call(elem).slice(8, -1) === 'Boolean';
};

function isNumber(elem) {
	return Object.prototype.toString.call(elem).slice(8, -1) === 'Number';
};

// helper function to test whether language code has valid syntax
function isValidLocale(locale) {
	let re = new RegExp("\\w\\w-\\w\\w");
	return re.test(locale);
}

