import Vue from 'vue'
import Test from './psd_loginmodify'
import vueTap from 'v-tap'
import mintUI from 'mint-ui'
Vue.use(mintUI);
Vue.use(vueTap);
new Vue({
    el: "#root",
    render:h=>h(Test)
})