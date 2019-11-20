<template>
  <div id="app">
    
    <Top />

    <div class="main">
      
      
      <Tweets_list />
      
      <div class="right">
        <Record_voice />
      
        <Moods />
      </div>
    </div>
    <div class="footer">
       © 2019 - Alexander Al-Hakeem - Albin Becevic - Niklas Paasonen - Lucas Rosvall - Emil Toll Wester - David Wilkins
      <p/>
      Chalmers tekniska högskola
    </div>
  </div>
</template>

<script>
import Top from './components/header'
import Tweets_list from './components/tweets_list'
import Record_voice from './components/top_right'
import Moods from './components/bottom_right'

export default {
  name: 'app',
  components: { Top, Tweets_list, Record_voice, Moods }
}
</script>

<style>

body{
  margin: 0;
  padding: 0;
  font-family: Nunito;
  background-color: black;
  color: #343434;
  
}
</style>

<style scoped>
.main{
  display: flex;
  
  flex-wrap: nowrap;
  background-color: #f1f3f6;
  height: 550px;
  width: 100%;
}
.right{
  border-left:3px solid #343434;
  width:50%;
  height:100%;
  float:right;
}
.footer{
  width:100%;
  height:60px;
  background-color: black;
  color:white;
  font-size: 0.9em;
  padding-top:20px;
  text-align: center;
  
}


</style>
