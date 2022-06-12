// 项目是使用本地存储还是对话存储还是cookie 只需改变这里即可
export const setStorage = (key, value) => {
  localStorage.setItem(key, value)
}
export const getStorage = (key) => {
  localStorage.getItem(key)
}
export const removeStorage = (key) => {
  localStorage.removeItem(key)
}
