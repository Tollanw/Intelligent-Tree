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
            <p />
            Chalmers tekniska högskola
        </div>
    </div>
</template>


<script>
    import Top from './header'
    import Tweets_list from './tweets_list'
    import Record_voice from './top_right'
    import Moods from './bottom_right'
    import axios from 'axios'
    import router from '../router'
    export default {
        name: 'Login',
        components: { Top, Tweets_list, Record_voice, Moods },
        data() {
            return {
                user: {
                    name: ''
                }
            }
        },
        methods: {
            getUserData: function () {
                let self = this
                axios.get('/api/user')
                    .then((response) => {
                        console.log(response)
                        self.$set(this, 'user', response.data.user)
                    })
                    .catch((errors) => {
                        console.log(errors)
                        router.push('/')
                    })
            }
        },
        mounted() {
            this.getUserData()
        }
    }
</script>

<style>

    body {
        margin: 0;
        padding: 0;
        font-family: Nunito;
        background-color: black;
        color: #343434;
    }
</style>

<style scoped>
    .main {
        display: flex;
        flex-wrap: nowrap;
        background-color: #f1f3f6;
        height: 550px;
        width: 100%;
    }

    .right {
        border-left: 3px solid #343434;
        width: 50%;
        height: 100%;
        float: right;
    }

    .footer {
        width: 100%;
        height: 60px;
        background-color: black;
        color: white;
        font-size: 0.9em;
        padding-top: 20px;
        text-align: center;
    }
</style>
