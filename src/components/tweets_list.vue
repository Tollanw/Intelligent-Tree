<template>
  <div class="container">
    <h1>TWEETS</h1>
    <input type="text" name="keyword" id="keyword" placeholder="NYCKELORD..." />
    <input
      type="text"
      name="filter"
      id="filter"
      placeholder="RESULTATFILTER..."
    />

    <button class="update" @click="setTwitterInfo">UPPDATERA</button>

    <br />
    <button class="read" @click="listen">LÄS UPP TWEETS</button>
    <div class="tweetList">
      <div v-for="(t, i) of list" :key="t.id">
        <div class="tweets">
          <p v-bind:class="{ reading: i === current && reading }">
            {{ "'' " + t.text + " ''" }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Speech from "../speech";
import { setTimeout } from "timers";

export default {
  name: "tweets_list",
  data() {
    return {
      token: false,
      list: false,
      current: 0,
      speech: new Speech(),
      synth: window.speechSynthesis,
      delayBetweenSpeech: 200,
      reading: false
    };
  },
  async created() {
    this.getTwitterData();
  },
  methods: {
    getTwitterData: function() {
      axios
        .get("/api/twitterdata")
        .then(res => {
          console.log(res);
        })
        .catch(error => {
          this.errors.push(error);
          console.log(error);
        });
    },
    setTwitterInfo: function(){
      var keyInput = document.getElementById("keyword").value;
      var filterInput = document.getElementById("filter").value;
      if (keyInput == null || filterInput == null) {
        alert("Wrong input");
        return;
      }
      axios
        .get("/api/setTwitterInfo", {
          params: {
            keyword: document.getElementById("keyword").value,
            filter: document.getElementById("filter").value
          }
        })
        .then(res => {
          this.list = res.data.tweets;
        })
        .catch(error => {
          this.errors.push(error);
          console.log(error);
        });
    },

    speak(text) {
      return this.speech.speak(text);
    },
    tweet_update() {
      var keyword = document.getElementById("keyword").value;
      var filter = document.getElementById("filter").value;
      console.log(keyword + "   " + filter);

      // require('../../runPython.js');
    },
    listen() {
      this.synth.cancel();
      let _this = this;
      if (this.list[this.current] !== undefined) {
        this.reading = true;
        this.speak(this.list[this.current].text)
          .then(() => {
            setTimeout(() => {
              _this.current = _this.current + 1;
              _this.listen();
            }, _this.delayBetweenSpeech);
          })
          .catch(err => console.log(err));
      } else {
        _this.current = 0;
        _this.reading = false;
      }
    }
  }
};
</script>

<style scoped>
select option[data-default] {
  color: #888;
}

.container {
  width: 50%;
  height: 100%;
  text-align: center;
}
.tweetList {
  height: 65%;
  width: 100%;
  overflow: auto;
}
.tweets {
  background-color: #ffffff;
  padding-top: 0.5px;
  padding-bottom: 0.5px;
  width: 90%;
  border-radius: 5px;
  margin: auto;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.15),
    inset 0px 0px 20px rgba(255, 255, 255, 0.7);
  margin-top: 15px;
  margin-bottom: 20px;
}
h1 {
  font-size: 1.5em;
}
h2 {
  font-size: 1em;
  font-weight: normal;
}
.reading {
  color: hotpink;
}
input {
  width: 150px;
  height: 48px;
  margin-top: 10px;
  margin-bottom: 20px;
  border: none;
  border-bottom: 3px solid coral;
  border-radius: 5px;
  font-size: 1em;
  cursor: text;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.08s linear;
  outline: none;
  background-color: #ffffff;
  margin-right: 20px;
  padding-left: 15px;
}
.update {
  width: 150px;
  height: 50px;
  margin-top: 10px;
  margin-bottom: 20px;
  border: none;
  border-radius: 20px;
  font-size: 1em;
  cursor: pointer;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.08s linear;
  outline: none;
  background-color: #ffffff;
  box-shadow: 0 4px coral;
}
.update:active {
  box-shadow: 0 1px coral;
  border: none;
  color: #cccccc;
  background-color: #eeeeee;
  transform: translateY(2px);
}
.update:hover {
  background-color: #ffffff;
}
.read {
  width: 200px;
  height: 50px;
  margin-top: 10px;
  margin-bottom: 20px;
  border: none;
  border-radius: 20px;
  font-size: 1em;
  cursor: pointer;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.08s linear;
  outline: none;
  background-color: #ffffff;
  box-shadow: 0 4px cornflowerblue;
}
.read:active {
  box-shadow: 0 1px cornflowerblue;
  border: none;
  color: #cccccc;
  background-color: #eeeeee;
  transform: translateY(2px);
}
.read:hover {
  background-color: #ffffff;
}
</style>
