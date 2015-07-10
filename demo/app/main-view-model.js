var textToSpeech = require("nativescript-texttospeech");
var observable = require("data/observable");

var mainViewModel = new observable.Observable();

// set initial states
mainViewModel.set("textToSpeak", "This is an example of using TextToSpeech with a cross platform NativeScript module");
mainViewModel.set("shouldQueue", true);
mainViewModel.set("pitchValue", 1.0);
mainViewModel.set("volumeValue", 1.0);
mainViewModel.set("speechRate", 0.25);

mainViewModel.speakText = function () {
   textToSpeech.speak(mainViewModel.get("textToSpeak"), mainViewModel.get("shouldQueue"), mainViewModel.get("pitchValue"), mainViewModel.get("speechRate"), mainViewModel.get("volumeValue"));
};

exports.mainViewModel = mainViewModel;