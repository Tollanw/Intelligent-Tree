import Speech from "./speech.js";
import axios from "axios";
export default class SpeechToText {
  constructor() {
    this.recognition;
    this.initRecognition();
    this.speech = new Speech();
  }
  //Init the recognition software
  //Maybe we should add grammar for the recognition, change some weight-values regarding trees etc.?
  initRecognition() {
    //Check if recognition is available, if not: set recognition to false
    this.recognition =
      !!window.SpeechRecognition ||
      !!window.webkitSpeechRecognition ||
      !!window.mozSpeechRecognition ||
      !!window.msSpeechRecognition
        ? new (window.SpeechRecognition ||
            window.webkitSpeechRecognition ||
            window.mozSpeechRecognition ||
            window.msSpeechRecognition)()
        : false;
    if (this.recognition) {
      //maxAlternatives=3 gives 3 different alternatives when the onresult is called by recognition
      this.recognition.maxAlternatives = 3;
      this.recognition.continuous = true;
    }
  }

  listen() {
    if (this.recognition == false) {
      document.getElementById("message").innerHTML =
        "SpeechRecognition är inte tillgängligt";
      return;
    }
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
      var transcript = event.results[0][0].transcript;
      if (
        transcript.toLowerCase().includes("#")) {        
        const words = transcript.split(" ");
        for (var i = 0; i <= words.length; i++) {
          if (words[i].includes("#")) {
            axios
              .get("/api/getTweetWithTag", {
                params: {
                  tag: words[i]
                }
              })
              .then(res => {
                talk(res.data);
              })
              .catch(error => {
                this.errors.push(error);
                console.log(error);
              });
          }
        }
      } else {
        axios
          .get("/api/speech", {
            params: {
              text: transcript
            }
          })
          .then(res => {
            talk(res.data);
          })
          .catch(error => {
            this.errors.push(error);
            console.log(error);
          });
      }
      document.getElementById("message").innerHTML = transcript;
    };
  }
  //stop the recognition manually
  stopSpeechRecognition = () => {
    if (this.recognition == false) {
      console.log("Recognition does not work");
      return;
    }
    this.recognition.stop();
    console.log("Recognition has stopped by user");
  };
}
