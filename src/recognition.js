/**
 * @class recognition.js 
 * @classdesc has control over the speech to text
 * @constructor init the recognition and creating a speech object
 * @version 1.0
 */
import Speech from "./speech.js";
//Axios is used to send requests to server
import axios from "axios";
export default class SpeechToText {
  constructor() {
    this.recognition;
    this.initRecognition();
    this.speech = new Speech();
  }
  //Maybe we should add grammar for the recognition, change some weight-values regarding trees etc.?
  /**
   * Init the recognition software, the recognition variable
   * If recognition exists in browser, an recognition object is created
   * If not, sets the recognition-object to false
   */
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
  /**
   * Starts the recognition
   * The tree starts listening to the user
   * If recognition does not exists, the message will be: "SpeechRecognition är inte tillgängligt";

   */
  listen() {
    if (this.recognition == false) {
      document.getElementById("message").innerHTML =
        "SpeechRecognition är inte tillgängligt";
      return;
    }
    //start the recognition
    this.recognition.start();

    //is called if a error occur
    this.recognition.onerror = function(error) {
      this.errors.push(error);
    };
   
    //reference to the speech object and speak function
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
          //send request to get tweet with tag
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
              });
          }
        }
      } else {
        //send request to /api/speech
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
          });
      }
      document.getElementById("message").innerHTML = transcript;
    };
  }
  /**
   * Stops the recognition
   * If recognition does not work this function will just return
   */
  stopSpeechRecognition = () => {
    if (this.recognition == false) {
      return;
    }
    this.recognition.stop();
  };
}
