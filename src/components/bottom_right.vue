@DevTree1
HEzLrUK.v@nE.B6


<template>
    <div class="container">
        <h1>HUMÖR</h1>
        
        <div class="button_grid">
            <button class="happy" @click="speakHappy">GLAD</button> 
            <br>
            <button class="sad" @click="speakSad">LEDSEN</button>
        </div>
    </div>
</template>

<script>

//import DataHandler from '../server'
import Speech from '../speech'
import Data from '../../data.json'

export default {
  name: 'moods',
  data () {
      return {
    //  dataHandler: new DataHandler(),
      data: Data.phrases,
      speech: new Speech(),

      }
      
    },
    methods: {
        speak(text) {
            return this.speech.speak(text);
        },
        filterdata(mood) {
            return this.dataHandler.filterdata(mood);
        },

        speakHappy() {
            this.speak(this.data[1].phrase);
            console.log("hej");
            //var xhttp = new XMLHttpRequest();
            //xhttp.onreadystatechange = function() {
             //   if (this.readyState == 4 && this.status == 200) {
            //        console.log("Response: " +this.responseText);
           //     }
           // };
           // xhttp.open("GET", "ajax_info.txt", true);
           // xhttp.send();    
        },
        speakSad() {
            this.speak(this.data[11].phrase)  
        }
    }
}
</script>

<style scoped>
.container{
   text-align: center;
    width: 100%;
    height: 50%;
    
}
.button_grid{
    width:90%;
    height:90%;
    margin:auto;
}
.happy{
    width: 250px;
    height: 50px;
    margin-top: 10px;
    border:none;
    border-radius: 20px;
    font-size: 1.0em;
    cursor:pointer;
    -webkit-box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    transition:all 0.08s linear;
    outline: none;
    background-color: #ffffff;
}
.happy:active{
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0);
    border:none;
    color: #cccccc;
    background-color: #eeeeee;
}
.happy:hover{
    margin-top:8px;
    margin-bottom:2px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
    -webkit-box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
    background-color: #ffffff;
}
.sad{
    width: 250px;
    height: 50px;
    margin-top: 40px;
    border:none;
    border-radius: 20px;
    font-size: 1.0em;
    cursor:pointer;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    transition:all 0.08s linear;
    outline: none;
    background-color: #ffffff;
}
.sad:active{
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0);
    border:none;
    color: #cccccc;
    background-color: #eeeeee;
}
.sad:hover{
    margin-top:38px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
    background-color: #ffffff;
}
</style>

