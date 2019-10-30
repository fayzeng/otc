import Vue from 'vue'
import update_v from './update_v'
import mintUI from 'mint-ui'
import vueTap from 'v-tap'

Vue.use(vueTap)
Vue.use(mintUI);
new Vue({
    el: "#root",
    render:h=>h(update_v)
})