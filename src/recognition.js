import Speech from "./speech.js";

export default class SpeechToText {
  constructor() {
    this.recognition;
    this.initRecognition();
    this.speech = new Speech();
  }
  //Init the recognition software
  //Maybe we should add grammar for the recognition, change some weight-values regarding trees etc.?
  initRecognition() {
    this.recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition ||
      window.mozSpeechRecognition ||
      window.msSpeechRecognition)();
    //maxAlternatives=3 gives 3 different alternatives when the onresult is called by recognition
    this.recognition.maxAlternatives = 3;
    this.recognition.continuous = true;
  }

  listen() {
    //start the recognition
    this.recognition.start();
    console.log("Recording started");

    //is called if a error occur
    this.recognition.onerror = function() {
      console.log("Error! Something went wrong.");
    };
    //is called when recognition starts
    this.recognition.onstart = function() {
      console.log("Recognition activated. Start talking.");
    };
    //is called when the speech ends
    this.recognition.onend = function() {
      console.log("No voice. Recognition has stopped.");
    };

    let speech = this.speech;
    function talk(text) {
      speech.speak(text);
    }

    //is called when recognition has a result..
    this.recognition.onresult = function(event) {
      console.log(event);
      var transcript = event.results[0][0].transcript;
      document.getElementById("message").innerHTML = transcript;
      if (
        transcript.toLowerCase().includes("hej") ||
        transcript.toLowerCase().includes("tjena")
      ) {
        talk("Tjena kompis");
        //var greetings = greeting.greetings[Math.floor(Math.random() * greeting.greetings.length)].text;
        //talk(greetings);
      } else if (transcript.toLowerCase().includes("mamma")) {
        talk(
          "Visste du att min mamma har sagt att jag kommer bli längre än ett hus en dag."
        );
      } else if (transcript.toLowerCase() === "hur lång är du") {
        talk("Jag vet inte, men jag tror jag är över 30 meter.");
      } else if (
        transcript.toLowerCase().includes("träd") ||
        transcript.toLowerCase().includes("cool")
      ) {
        talk("Jag är ett så himla coolt träd.");
      } else {
        talk("Jag förstår inte vad du menar med " + transcript);
      }
    };
  }
  //stop the recognition manually
  stopSpeechRecognition = () => {
    this.recognition.stop();
    console.log("Recognition has stopped by user");
  };
}
