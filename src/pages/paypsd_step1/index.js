import Vue from 'vue'
import Test from './paypsd_step1.vue'
import vueTap from 'v-tap'
import mintUI from 'mint-ui';//导入mint-ui核心包
Vue.use(vueTap);
Vue.use(mintUI);
new Vue({
    el: "#root",
    render:h=>h(Test)
})