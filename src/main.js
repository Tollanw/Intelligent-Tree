import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false
/*
new Vue({
  render: h => h(App),
}).$mount('#app')
*/
new Vue({
    el: '#app',
    router,
    //components: { App },
    render: h => h(App)
    //template: '<App/>'
})