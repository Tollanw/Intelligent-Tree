<template>
    <div class="container">
        <h1>LYSSNA EFTER RÖST</h1>
        <button id="play" @click="listenToPerson">SPELA IN</button>
        <br><br>
        <span id="message">Resultat</span>
    </div>
</template>

<script>
import Speech from '../speech'
export default {
  name: 'record_voice',
  data () {
      return{
      speech: new Speech(),
      isRecording: false
      }
  },

  methods:  {
      listenToPerson(){
          if(this.isRecording==false) {
            this.isRecording=true;
            this.speech.listen()
            document.getElementById("play").style.backgroundColor = "crimson";
            document.getElementById("play").style.color = "white";

          }
          else {
              this.isRecording=false;
              this.speech.stopSpeechRecognition()
              document.getElementById("play").style.backgroundColor = "white";
              document.getElementById("play").style.color = "crimson";


          }
      }
  }

}
</script>

<style scoped>
.container{
    width: 100%;
    height: 50%;
    text-align: center;
    border-bottom:3px solid #343434;
}

h2{
  font-size: 1.0em;
  font-weight: normal;
}
button{
    color:crimson;
    width: 250px;
    height: 50px;
    margin-top: 30px;
    border:none;
    border-radius: 4px;
    font-size: 1.0em;
    cursor:pointer;
    -webkit-box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    transition:all 0.08s linear;
    outline: none;
}
button:active{
    
    border:none;
    color: #cccccc;
    background-color: #eeeeee;
}
button:hover{
    margin-top:28px;
    -webkit-box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
    
}


</style>
