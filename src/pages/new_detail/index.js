import Vue from 'vue'
import Test from './new_detail.vue'
import vueTap from 'v-tap'
Vue.use(vueTap);
new Vue({
    el: "#root",
    render:h=>h(Test)
})