import Vue from 'vue'
import Index from './index.vue'
import vueTap from 'v-tap'
import { Tabbar, TabItem } from 'mint-ui';

Vue.component(Tabbar.name, Tabbar);
Vue.component(TabItem.name, TabItem);
Vue.use(vueTap)
new Vue({
    el: "#root",
    render:h=>h(Index)
})