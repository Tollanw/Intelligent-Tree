<template>
  <div class="container">
    <h1>TwitterTree</h1>
    <img alt="Ericsson logo" class="logo" src="../../public/ERI_horizontal_RGB.png"/>
  </div>
</template>

<script>
export default {
  name: 'top'
}
</script>

<style scoped>
.container{
  display: flex;
  height: 60px;
  justify-content: space-between;
  flex-wrap: nowrap;
  word-wrap: none;
  word-break: keep-all;
  overflow: hidden;
  white-space: nowrap;
  background-color: black;
  color: white;
  padding-left: 3%;
  padding-right: 3%;
  align-items: center;
}
.logo{
  width: 150px;
  height: 30px;
}
h1{
  font-size: 1.4em;
  font-weight: normal;
}

@media only screen and (max-width: 600px) {
  .logo {
    display: none;
  }
}

</style>
