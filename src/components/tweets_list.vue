<template>
    <div class="container">
        <h1>KÖADE TWEETS</h1>
        <button @click="listen">LÄS UPP MENINGAR</button>

        
            <div v-for="(t, i) of list" :key="t.id">
              <div class="tweets">
                <p v-bind:class="{reading: i === current && reading}">{{"'' "+t.text+" ''"}}</p>
            </div>
        </div>
        

    </div>
</template>

<script>
import tweets from '../../tweets_parsed.json'
import Speech from '../speech'
import { setTimeout } from 'timers';

export default {
  name: 'tweets_list',
  data () {
    return {
      token: false,
      list: tweets.tweets,
      current: 0,
      speech: new Speech(),
      synth: window.speechSynthesis,
      delayBetweenSpeech: 200,
      reading: false
    }
  },
  async created () {
    // this.speak('Twitter feed test')
    // let tweets = require('../tweets_parsed.json')
    // this.listen()
  },
  methods: {
    speak (text) {
      return this.speech.speak(text)
    },
    listen () {
      this.synth.cancel()
      let _this = this
      if (this.list[this.current] !== undefined) {
        this.reading = true
        this.speak(this.list[this.current].text).then(() => {
          setTimeout(() => {
            _this.current = _this.current+1
            _this.listen()
          }, _this.delayBetweenSpeech)
        }).catch(err => console.log(err))
      } else {
        _this.current = 0
        _this.reading = false
      }
    }
  }
}
</script>

<style scoped>
.container{
    width: 50%;
    height: 100%;
    text-align: center;
}
.tweets{
    background-color: white;
    padding-top: 0.5px;
    padding-bottom: 0.5px;
    width: 90%;
    border-radius: 5px;
    margin: auto;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.05);
    margin-top:15px;
}
h2{
  font-size: 1.0em;
  font-weight: normal;
}
.reading{
  color:hotpink;
}
button{
    width: 250px;
    height: 50px;
    margin-top: 10px;
    margin-bottom: 20px;
    border:none;
    border-radius: 20px;
    font-size: 1.0em;
    cursor:pointer;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    transition:all 0.08s linear;
    outline: none;
    background-color: #ffffff;
}
button:active{
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0);
    border:none;
    color: #cccccc;
    background-color: #eeeeee;
}
button:hover{
    margin-top:8px;
    margin-bottom:22px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.4);
    
}


</style>
