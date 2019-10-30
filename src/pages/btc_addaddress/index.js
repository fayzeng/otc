import Vue from 'vue'
import Test from './btc_addaddress.vue'
import vueTap from 'v-tap'
Vue.use(vueTap);
new Vue({
    el: '#root',
    render: h=>h(Test)
})