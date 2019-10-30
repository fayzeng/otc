import Vue from 'vue'
import Index from './homepage'
import vueTap from 'v-tap'
import mintUI from 'mint-ui'
Vue.use(vueTap)
Vue.use(mintUI)
new Vue({
    el: "#root",
    render:h=>h(Index)
})