import Vue from 'vue'
import Start_page from './start_page'
import mintUI from 'mint-ui'
import vueTap from 'v-tap'

Vue.use(vueTap)
Vue.use(mintUI);
new Vue({
    el: "#root",
    render:h=>h(Start_page)
})