// 采用的export default  二次封装 外部引入时的变量是任意叫的
// import { Notify } from 'vant'
// export default Notify
import { Toast } from 'vant'
export default ({ type, message }) => {
  if (type === 'danger') {
    type = 'fail'
  }
  Toast({
    type,
    message
  })
}
