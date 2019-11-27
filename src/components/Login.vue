<template>
    <div class="form">
        <h2>TwitterTree</h2>
        <form v-on:submit='login'>
          Ange användar-ID och lösenord <br><br>
            <input class="textfield" type='text' name='email' placeholder='ID'/><br>
            <input class="textfield" type='password' name='password' placeholder='LÖSENORD'/><br>
            <input class="login_button" type='submit' value='LOGGA IN' />
        </form>
    </div>
</template>

<script>
import router from '../router'
import axios from 'axios'
export default {
  name: 'Login',
  methods: {
    login: (e) => {
      e.preventDefault()
      let email = e.target.elements.email.value
      let password = e.target.elements.password.value
      let login = () => {
        let data = {
          email: email,
          password: password
        }
        axios.post('/api/login', data)
          .then((response) => {
            console.log('Logged in')
            router.push('/dashboard')
          })
          .catch((errors) => {
            console.log('Cannot log in')
          })
      }
      login()
    }
  }
}
</script>

<style>
  .form{
    color:#239B56;
  }
  .textfield{
    width: 200px;
    height: 48px;
    margin-top: 10px;
    margin-bottom: 20px;
    border:none;
    border-bottom:3px solid #2ECC71;
    border-radius: 5px;
    font-size: 1.0em;
    cursor:text;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    transition:all 0.08s linear;
    outline: none;
    background-color: #ffffff;
    padding-left:15px;
  }

  .login_button{
    width: 150px;
    height: 45px;
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
    box-shadow: 0 5px #2ECC71;
}
.login_button:active{
    box-shadow: 0 2px #2ECC71;;
    border:none;
    background-color: #eeeeee;
    transform: translateY(2px);
    
}
.login_button:hover{ 
    background-color: #ffffff;
}

</style>