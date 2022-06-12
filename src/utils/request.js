import theAxios from 'axios'
import { Notify } from 'vant'
import router from '../router'
import { getToken, removeToken } from './token' // setToken
// import { updateTokenAPI } from '@/api'
const axios = theAxios.create({
  baseURL: 'http://toutiao.itheima.net',
  timeout: 5000
})

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // console.log(config.headers.Authorization)
  // ?.可选链操作符，前面对象没有length时，返回undefined
  if (getToken()?.length > 0 && config.headers.Authorization === undefined) {
    config.headers.Authorization = `Bearer ${getToken()}`
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器  返回至函数调用的地方
axios.interceptors.response.use(function (response) { // http状态码2xx  3xx 进入这里
  // 对响应数据做点什么
  return response
}, async function (error) { // http状态码4xx  5xx 进入这里
  // 对响应错误做点什么
  // token过期
  if (error.response.status === 401) {
    // token过期，删除token，再跳转,让全局守卫放行

    // 方式一 有感知刷新token
    removeToken()
    router.replace(`/login?path=${router.currentRoute.fullPath}`)
    Notify({ type: 'warning', message: '身份认证失败' })

    // 方式二 无感知刷新token
    // const res = await updateTokenAPI()
    // // 1.存储新token
    // setToken(res.data.data.token)
    // // 2.在新请求的请求头上加入新token
    // error.config.headers.Authorization = `Bearer ${res.data.data.token}`
    // // 3.重新发起上一次请求 error.config上一次失败请求的配置对象 结果要return回去原来的页面
    // return axios(error.config)
    // console.log(res)
  }
  // 如果refresh token也过期
  if (error.response.status === 500 && error.config.url === '/v1_0/authorizations' && error.config.method === 'put') {
    // 清除本地存储所有值
    localStorage.clear()
    Notify({ type: 'warning', message: '身份认证失败' })
    // 跳转
    router.replace('/login')
  }
  return Promise.reject(error)
})

export default ({ url, method = 'GET', params = {}, data = {}, headers = {} }) => {
  return axios({
    url,
    method,
    params,
    data,
    headers
  })
}
