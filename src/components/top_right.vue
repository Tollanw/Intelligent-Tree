<template>
    <div class="container">
        <h1>LYSSNA EFTER RÖST</h1>
        <button class="rec" id="rec" @click="startRecording" >SPELA IN</button>
        <button class="stop" id="stop" @click="stopRecording" >STOPP</button>
        <br><br><br>
        <span id="result_text"></span>
        <span id="message"></span>
    </div>
</template>

<script>
import Recognition from '../recognition'
export default {
    name: 'record_voice',
    data () {
      return {
      recognition: new Recognition(),
      isRecording: false
      }
    },

  methods:  {
    /**
     * Starts the recording
     */
    startRecording(){
          if(this.isRecording == false){
              this.isRecording = true;
              this.recognition.listen();
              document.getElementById("result_text").innerHTML = "";
              document.getElementById("message").innerHTML = "Spelar in ...";
          }
         
    },
    /**
     * Stops the recording
     */
    stopRecording(){
        if(this.isRecording == true){
            this.isRecording = false;
            this.recognition.stopSpeechRecognition();
            document.getElementById("result_text").innerHTML = "Resultat: ";
        }
    }
  }


}
</script>

<style scoped>
.container{
    width: 100%;
    height: 45%;
    text-align: center;
    border-bottom:3px solid #343434;
}
h1{
    font-size: 1.5em;
}
h2{
  font-size: 1.0em;
  font-weight: normal;
}
.rec{
    color:crimson;
    width: 140px;
    height: 50px;
    margin-top: 10px;
    border:none;
    border-radius: 20px;
    font-size: 1.0em;
    cursor:pointer;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    transition:all 0.08s linear;
    outline: none;
    background-color: #ffffff;
    box-shadow: 0 4px #c82848;
    margin-right:30px;
}
.rec:active{
    border:none;
    color:#cccccc;
    background-color: crimson;
    box-shadow: 0 1px crimson;
    transform: translateY(2px);
}

.rec:hover{
    background-color: #ffffff;
}
.stop{
    color:white;
    width: 140px;
    height: 50px;
    margin-top: 10px;
    border:none;
    border-radius: 20px;
    font-size: 1.0em;
    cursor:pointer;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    transition:all 0.08s linear;
    outline: none;
    background-color: crimson;
    box-shadow: 0 4px darkred;
    
}
.stop:active{
    border:none;
    color:#cccccc;
    background-color: crimson;
    box-shadow: 0 1px darkred;
    transform: translateY(2px);
}

.stop:hover{
    background-color: crimson;
}

</style>
