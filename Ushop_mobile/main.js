import Vue from 'vue'
import App from './App'
import uView from "uview-ui";
import baseUrl from '@/utils/baseUrl.js'
import http from '@/utils/request.js'

Vue.prototype.$http = http
Vue.prototype.$baseUrl = baseUrl

Vue.use(uView);
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})

app.$mount()
