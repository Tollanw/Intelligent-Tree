<template>
  <div class="container">
    <h1>HUMÖR</h1>

    <div class="button_grid">
      <button class="happy" @click="getMood(1)">GLAD</button>
      <br />
      <button class="sad" @click="getMood(2)">LEDSEN</button>
    </div>
  </div>
</template>

<script>
import Speech from "../speech";
//Axios is used for sending requests
import axios from "axios";

export default {
  name: "moods",
  data() {
    return {
      speech: new Speech()
    };
  },
  methods: {
    /**
     * Sends a request to /api/getMood to retrieve a phrase regarding the mood 
     * The phrase is then spoken by the speak(text)-method
     * @param {number} currentModd Can be either 1 or 2, 1=happy, 2=sad
     */
    getMood: function(currentMood) {
      axios
        .get("/api/getMood", {
          params: {
            mood: currentMood
          }
        })
        .then(res => {
          //speak the result
          this.speak(res.data);
        })
        .catch(error => {
          this.errors.push(error);
        });
    },
    speak(text) {
      return this.speech.speak(text);
    }
  }
};
</script>

<style scoped>
h1 {
  font-size: 1.5em;
}
.container {
  text-align: center;
  width: 100%;
  height: 50%;
}
.button_grid {
  width: 90%;
  height: 90%;
  margin: auto;
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
.happy:active {
  border: none;
  color: #cccccc;
  background-color: #eeeeee;
  box-shadow: 0 1px #28b463;
  transform: translateY(2px);
}
.happy:hover {
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
.sad:active {
  border: none;
  color: #cccccc;
  background-color: #eeeeee;
  box-shadow: 0 1px #9b59b6;
  transform: translateY(2px);
}
.sad:hover {
  background-color: #ffffff;
}
</style>
