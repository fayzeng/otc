import Vue from 'vue'
import Index from './my_info_addphonenumber.vue'
import mintUI from 'mint-ui';//导入mint-ui核心包
import vueTap from 'v-tap'

Vue.use(vueTap)
Vue.use(mintUI);
new Vue({
    el: "#root",
    render:h=>h(Index)
})