import Vue from 'vue'
import Test from './transaction_del'
import vueTap from 'v-tap'
import mintUI from 'mint-ui'
Vue.use(vueTap);
Vue.use(mintUI);
new Vue({
    el: "#root",
    render:h=>h(Test)
})