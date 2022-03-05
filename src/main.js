import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import './assets/icon/iconfont.css'
// import 'default-passive-events'

Vue.prototype.$EventBus = new Vue()
import { Message } from 'element-ui';
// 引入初始化样式
import './style.css'

const http = axios.create({
  baseURL: 'https://test.icethem02.xyz',
  // https://test.icethem02.xyz
  // https://test.icethem02.xyz
  // https://admin.vgdg67.cn
  // https://test.icethem02.xyz
  // withCredentials:true
})

http.interceptors.request.use(function (config) {
  let url = config.url;
  if(url === '/index.php/index/login/index/'){
    localStorage.setItem('token',"");
    config.headers.Authorization = '';
} else {
  if(localStorage.token) {
    config.headers.Authorization = '' + localStorage.token
  }
}
  return config;
}, function (error) {
  return Promise.reject(error);
});

var once = false
http.interceptors.response.use(res => {
  return res
}, err => {
  if (err.response.status) {
    // 402时跳转到登录页
    if (err.response.status === 402) {
      localStorage.removeItem('token')
      localStorage.removeItem('uid')
      localStorage.removeItem('zh_name')
      localStorage.removeItem('authority')
      if (once === false) {
        Message.error("请重新登陆");
        router.push('/login')
        once = true
        setTimeout(() => {
          once = false
        }, 3000);
      } else {
        //
      }
    }
  }
  return Promise.reject(err)
})

Vue.prototype.$http = http
Vue.prototype.$EventBus = new Vue()

// 引入echarts
import * as echarts from 'echarts';
Vue.prototype.$echarts = echarts

//引入一键复制
import VueClipboard from 'vue-clipboard2'
Vue.use( VueClipboard )

Vue.config.productionTip = false
Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// 解决表格滚动滞后
import { Table } from 'element-ui';
delete Table._Ctor
const bindEvents = Table.methods.bindEvents
Object.assign(Table.methods,{
  bindEvents() {
    bindEvents.call(this)
    this.bodyWrapper.addEventListener('mousewheel', this.handleBodyMousewheel)
  },
  handleBodyMousewheel(event) {
    const fixedWrapper = this.$refs.fixedWrapper
    if (fixedWrapper) {
      const fixedBodyWrapper = fixedWrapper.querySelector('.el-table__fixed-body-wrapper')
      if (fixedBodyWrapper) {
        event.preventDefault()
        fixedBodyWrapper.scrollBy({ left: event.deltaX, top: event.deltaY })
        this.$refs.bodyWrapper.scrollBy({ left: event.deltaX, top: event.deltaY })
      }
    }
  }
})
Vue.component(
  Table.name,
  Table
)
