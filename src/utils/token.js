// 定义操作本地存储token的方法
// 有缺陷，只能存token字段 因此单独封装一个
const key = 'geek-itheima'

export const setToken = token => {
  localStorage.setItem(key, token)
}

export const getToken = () => localStorage.getItem(key)

export const removeToken = () => {
  localStorage.removeItem(key)
}
