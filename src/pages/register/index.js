import Vue from 'vue'
import Index from './register.vue'
import vueTap from 'v-tap'
import mintui from 'mint-ui'

Vue.use(vueTap)
Vue.use(mintui)
new Vue({
    el: "#root",
    render:h=>h(Index)
})