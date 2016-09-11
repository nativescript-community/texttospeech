var appModule = require("application");
var TextToSpeech = android.speech.tts.TextToSpeech;
var Locale = java.util.Locale;
var initialised = false;
var upsInitialised = false;
var tts;
var lastOptions;
var UtteranceProgressListener = android.speech.tts.UtteranceProgressListener.extend({
        //constructor
        init: function() {
            constructorCalled = true;
            //console.log("UtteranceProgressListener created!");
        },
		onStart:function(utteranceId){
			//console.log("Started speaking");
		},
		onError:function(utteranceId){
			//console.log("Error while speaking");
		},
		onDone:function(utteranceId){
			//console.log("Finished speaking");
            if (lastOptions.callbackOnFinish){
                //console.log("Calling the callback");
                lastOptions.callbackOnFinish();
            }
		}
});

function getSpeechSynthesizer(){
    	if(!tts || !initialised) {
			tts = new TextToSpeech(_getContext(), new TextToSpeech.OnInitListener({
				onInit : function(status) {
					if(status === TextToSpeech.SUCCESS) {
						initialised = true;
                         if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.ICE_CREAM_SANDWICH_MR1) { 
                            //Add the progress listener
                            //console.log("Attaching listener...");
                            tts.setOnUtteranceProgressListener( new UtteranceProgressListener());
                            //console.log("listener attached...");
                         } else {
                             //Don't care on previous version of Android, because it's not supported
                         }
                          upsInitialised = true;
					}
				}
			}));
		}
        return tts;
}

var text_to_speech = {
	speak : function(text, queue, pitch, speakRate, volume, language, callbackOnFinish){
        lastOptions = {
            text:text,
            queue:queue,
            pitch:pitch,
            speakRate:speakRate,
            volume:volume,
            language:language,
            callbackOnFinish:callbackOnFinish
        }
        getSpeechSynthesizer();
		if(!isString(text)) {
			console.log("no text was provided");
			return;
		}

		if(text.length > 4000) {
			console.log("text cannot be greater than 4000 characters");
			return;
		}
        //Speak text if tts initialised
        if (!initialised || !upsInitialised){
            this._speakWhenReady();
        } else {
            speakText(text, queue, pitch, speakRate, volume, language);
        }
	},
    pause: function(now){
		getSpeechSynthesizer().stop();
	},
	resume:function(){
        //In Android there's no pause so we resume playng the last phrase...
        this.speak(lastOptions.text, lastOptions.queue, lastOptions.pitch, 
            lastOptions.speakRate, lastOptions.volume, lastOptions.language, 
            lastOptions.callbackOnFinish);
	},
    _speakWhenReady:function(){
            setTimeout(()=>{
                if (!initialised || !upsInitialised){
                    //Wait a little while...
                    this._speakWhenReady();
                } else {
                    //Speak using saved last Options
                     this.speak(lastOptions.text, lastOptions.queue, lastOptions.pitch, 
                        lastOptions.speakRate, lastOptions.volume, lastOptions.language, 
                        lastOptions.callbackOnFinish);
                }
            }, 200);

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

	tts.setPitch(pitch);
	tts.setSpeechRate(speakRate);

    var queueMode = queue ? TextToSpeech.QUEUE_ADD : TextToSpeech.QUEUE_FLUSH;
    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.ICE_CREAM_SANDWICH_MR1) { 
             //Supported version since API 21
                var params = new android.os.Bundle();
                params.putString(tts.Engine.KEY_PARAM_VOLUME, volume.toString());
               // params.putString(tts.Engine.KEY_PARAM_UTTERANCE_ID, "");
                tts.speak(text, queueMode, params, "UniqueID");
             }
        else {
            //Previous supported version
            var hashMap = new java.util.HashMap();
            hashMap.put(tts.Engine.KEY_PARAM_VOLUME, volume.toString());
            tts.speak(text, queueMode, hashMap);
            }
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