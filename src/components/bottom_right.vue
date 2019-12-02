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

//import DataHandler from '../../server'
import Speech from '../speech'
import Data from '../../data.json'

export default {
  name: 'moods',
  data () {
      return {
        //dataHandler: new DataHandler(),
        data: Data.Phrases,
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
h1{
    font-size: 1.5em;
}
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
    width: 200px;
    height: 50px;
    margin-top: 10px;
    border:none;
    border-radius: 20px;
    font-size: 1.0em;
    cursor:pointer;
    transition:all 0.08s linear;
    outline: none;
    background-color: #ffffff;
    box-shadow: 0 4px #28B463;
}
.happy:active{
    border:none;
    color: #cccccc;
    background-color: #eeeeee;
    box-shadow: 0 1px #28B463;
    transform: translateY(2px);
}
.happy:hover{
    background-color: #ffffff;
}
.sad{
    width: 200px;
    height: 50px;
    margin-top: 40px;
    border:none;
    border-radius: 20px;
    font-size: 1.0em;
    cursor:pointer;
    transition:all 0.08s linear;
    outline: none;
    background-color: #ffffff;
    box-shadow: 0 4px #9B59B6;
}
.sad:active{
    border:none;
    color: #cccccc;
    background-color: #eeeeee;
    box-shadow: 0 1px #9B59B6;
    transform: translateY(2px);
}
.sad:hover{
    background-color: #ffffff;
}
</style>

