// 封装全局指令
const directiveObj = {
  install (Vue) {
    Vue.directive('fofo', {
      // inserted创建时才执行
      inserted (el) {
        // 如果直接用到原生标签，el就是原生，会报错
        // const input = el.querySelector('input')
        // input.focus()
        // 知识点：原生DOM的nodeName能拿到标签的名字（全是大写）
        // 改进
        if (el.nodeName === 'INPUT' || el.nodeName === 'TEXTAREA') {
          el.focus()
        } else {
          setTimeout(() => {
            const input = el.querySelector('input')
            const textArea = el.querySelector('textarea')
            if (input) input.focus()
            if (textArea) textArea.focus()
          })
        }
      },
      // 指令所在标签更新执行
      update (el) {
        if (el.nodeName === 'INPUT' || el.nodeName === 'TEXTAREA') {
          el.focus()
        } else {
          setTimeout(() => {
            const input = el.querySelector('input')
            const textArea = el.querySelector('textarea')
            if (input) input.focus()
            if (textArea) textArea.focus()
          })
        }
      }
    })
  }
}
export default directiveObj
