// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import filters from './filters'
import 'normalize.css'// 引入全局normalize.css
import 'vant/lib/index.css'// 引入全局vant样式
import 'swiper/dist/css/swiper.min.css'
import 'nprogress/nprogress.css'
import '@/assets/css/common.css'
import NProgress from 'nprogress'
// import 'mapbox-gl/dist/mapbox-gl.css'
import {Lazyload, Image} from 'vant'
import {sync} from 'vuex-router-sync'
import SDK from '@/sdk/NIM_Web_SDK_v6.1.0.js'
import LoadingIcon from '@/assets/img/imgDefault01@2x.png'
import ErrorIcon from '@/assets/img/imgBreak01@2x.png'
import bear from '@/assets/bear/bear.png'
import logo from '@/assets/img/logo_v2.png'
import cover from '@/assets/img/loginCover_v2.png'
import imgNodata from '@/assets/img/imgNodata@2x.png'
import '@/plugins/touch'

// import VueAnalytics from 'vue-analytics'
// const isProd = process.env.NODE_ENV === 'production'

// Vue.use(VueAnalytics, {
//   id: 'UA-146203590-2', // UA-146203590-1 是/xplo/
//   debug: {
//     enabled: !isProd,
//     sendHitTask: isProd
//   },
//   checkDuplicatedScript: true,
//   autoTracking: {
//     screenview: true,
//     pageviewOnLoad: false,
//     exception: true
//   },
//   // 字段跟踪
//   fields: {
//     version: 'v2.1'
//   },
//   router
// })

sync(store, router)

// load images
Vue.prototype.$defaultCover = LoadingIcon
Vue.prototype.$errorCover = ErrorIcon
Vue.prototype.$bear = bear
Vue.prototype.$logo = logo
Vue.prototype.$launchCover = cover
Vue.prototype.$imgNodata = imgNodata
// IM SDK
Vue.prototype.$SDK = SDK

// 懒加载全局注册
Vue.use(Lazyload, {
  preLoad: 1,
  error: ErrorIcon,
  loading: LoadingIcon,
  attempt: 3,
  lazyComponent: true
})
Vue.use(Image)

// 过滤器统一处理加载
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// 首次加载不显示自定义加载条，只会显示浏览器自带的加载条
window.addEventListener('load', () => {
  // 路由守卫
  router.beforeEach((to, from, next) => {
    NProgress.configure({ speed: 500, showSpinner: true })
    NProgress.set(0.3)
    NProgress.inc(0.2)
    NProgress.start()
    NProgress.inc()
    next()
  })
  router.afterEach((to, from) => {
    if (to.meta.title) {
      document.title = to.meta.title
    }
    NProgress.done()
  })
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
