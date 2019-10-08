import axios from 'axios'
import { getToken, setToken } from '@/api/auth'
import store from '@/store'
import {Toast} from 'vant'

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 60000 // request timeout
})
// request interceptor
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    const token = getToken()
    if (token) {
      // 让每个请求携带token-- ['Authorization']为自定义key 请根据实际情况自行修改
      config.headers['Authorization'] = token
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response interceptor 响应拦截器
service.interceptors.response.use(data => {
  // 拦截响应header，若有新的token，则设置
  if (data.headers.newToken) {
    setToken('Authorization', data.headers.newToken)
  }
  if (data.data.code === 'offline') {
    console.log('现在是离线状态', store)
    Toast({
      message: 'Offline.'
    })
    store.commit('UPDATE_OfflineShow', true)
  } else {
    store.commit('UPDATE_OfflineShow', false)
    let code = Number(data.data.code)
    switch (code) {
      case 500:
        console.log('内部服务异常')
        Toast({
          message: 'Internal service exception.'
        })
        break
      case 404:
        console.log('该请求没有找到指定资源')
        Toast({
          message: 'The requested resource was not found.'
        })
        break
      default:
        return data
    }
  }
},
error => {
  console.log('err' + error) // for debug
  return Promise.reject(error)
}
)

export default service
