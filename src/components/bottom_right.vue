<template>
    <div class="container">
        <h1>HUMÖR</h1>
        
        <div class="button_grid">
            <button class="happy">GLAD</button> 
            <br>
            <button class="sad">LEDSEN</button>
        </div>
    </div>
</template>

<script>
export default {
  name: 'moods'
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
    transition:all 0.08s linear;
    outline: none;
}
.happy:active{
    -webkit-box-shadow: 0px 0px 20px rgba(0, 0, 0, 0);
    border:none;
    color: #cccccc;
    background-color: #eeeeee;
}
.happy:hover{
    margin-top:8px;
    margin-bottom:2px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
    
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
    
}
</style>
