//template for first login page
<template>
    
    <div id="app">
        <div>
            <a href="#" class="logout" v-on:click="logout">LOGGA UT</a>
        </div>
        <router-view />
    </div>
</template>
<script>
    import router from './router'
    import axios from 'axios'
    export default {
        name: 'App',
        methods: {
            logout: function (e) {
                axios
                    .get('/api/logout')
                    .then(() => {
                        router.push('/')
                    })
            }
        }
    }
</script>

<style>
    
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 20px;
    }
    .logout{
      font-size: 1.3 em; 
      color: white;
      font-weight: bold;
      text-decoration:none;
      padding:5px 10px 5px 10px;
    }
    .logout:hover{
      border: 2px solid white;
    }
    .logout:visited{
      color:white;
    }
</style>


