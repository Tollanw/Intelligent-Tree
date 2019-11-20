<template>
    <div class="container">
        <h1>LYSSNA EFTER RÖST</h1>
        <button id="rec" @click="listenToPerson" >SPELA IN</button>
        <br><br><br>
        <span id="message">" Resultat "</span>
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
          if(this.isRecording == false){
              console.log("False");
              console.log(this.isRecording);
              this.isRecording = true;
              this.speech.listen();
              document.getElementById("rec").style.backgroundColor = "crimson";
              document.getElementById("rec").style.color = "white";
              document.getElementById("rec").innerText = "STOPPA ...";
              
          }
          else{
              console.log("True");
              console.log(this.isRecording);
              this.isRecording = false;
              this.speech.stopSpeechRecognition();
              document.getElementById("rec").style.backgroundColor = "white";
              document.getElementById("rec").style.color = "crimson";
              document.getElementById("rec").innerText = "SPELA IN";
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

h2{
  font-size: 1.0em;
  font-weight: normal;
}
button{
    color:crimson;
    width: 250px;
    height: 50px;
    margin-top: 10px;
    border:none;
    border-radius: 20px;
    font-size: 1.0em;
    cursor:pointer;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    transition:all 0.08s linear;
    outline: none;
}
button:active{
    border:none;
    color:#cccccc;
    background-color: #eeeeee;
}

button:hover{
    margin-top:8px;
    margin-bottom: 2px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
    
}


</style>
