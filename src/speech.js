export default class TextToSpeech {
  constructor() {
    //options used for the speech synthesis
    this.options = {
      rate: 1,
      pitch: 1,
      voice: ""
    };
    this.available_voices = false;
    this.voice = false;
    this.getVoices();
  }
  
  //get all the available voices
  getVoices = () => {
    this.available_voices = window.speechSynthesis.getVoices();
    console.log(this.available_voices);
    let findVoice = this.findVoice;
    if (this.available_voices.length == 0) {
      window.speechSynthesis.addEventListener("voiceschanged", function() {
        findVoice();
      });
    } else {
      findVoice();
    }
  };
  //find a voice
  findVoice = () => {
    //choose swedish if possible
    let sve = this.available_voices.find(v => v.lang === "sv-SE");
    if (sve !== undefined) this.options.voice = sve;
    else this.options.voice = this.available_voices[0];
  };

  //speak
  //The text-parameter is the spoken input
  speak = text => {
    let options = this.options;
    return new Promise((resolve, reject) => {
      try {
        let utter = new SpeechSynthesisUtterance();
        Object.assign(utter, options);
        utter.text = text;
        utter.onend = function() {
          resolve(utter);
        };
        window.speechSynthesis.speak(utter);
      } catch (error) {
        reject(false);
      }
    });
  }
}