describe('lottiview class', function() {
  it('can be instantiated', function() {
    var testTNSTextToSpeech;
    var TNSTextToSpeech = require('nativescript-texttospeech').TNSTextToSpeech;
    if (TNSTextToSpeech) {
      testTNSTextToSpeech = new TNSTextToSpeech();
      console.log('TNSTextToSpeech instance: ' + testTNSTextToSpeech);
    }

    expect(function() {
      return new TNSTextToSpeech();
    }).not.toThrow();

    expect(new TNSTextToSpeech()).toBeDefined();
  });
});
