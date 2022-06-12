<template>
  <div>
    <van-nav-bar
  title="黑马头条-登录"
/>
<van-form @submit="onSubmit">
  <van-field
    v-model="user.mobile"
    required
    name="mobile"
    label="手机号"
    placeholder="请输入11位手机号"
    :rules="[{ required: true, message: '请填写手机号' },{
        pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确'
    }]"
  />
  <van-field
    v-model="user.code"
    required
    type="password"
    name="code"
    label="密码"
    placeholder="请输入6位验证码"
    :rules="[{ required: true, message: '请填写密码' },{
        pattern:/^\d{6}$/, message: '密码格式不正确'
    }]"
  />
  <div style="margin: 16px;">
    <van-button round block type="info" native-type="submit" :disabled="isLoading" :loading="isLoading"  loading-text="登录中...">登录</van-button>
  </div>
</van-form>
  </div>
</template>

<script>
import { loginAPI } from '@/api'
// import { Notify } from 'vant' // vant消息提示函数
import Notify from '@/ui/Notify' // 优化过的消息提示函数 Notify只是代号。实际上为Toast
import { setToken } from '@/utils/token.js'
import { setStorage } from '@/utils/storage'

export default {
  data () {
    return {
      user: {
        mobile: '13888888888',
        code: '246810' // 先默认为246810
      },
      isLoading: false
    }
  },
  methods: {
    async onSubmit (values) {
    //   console.log('submit', values)
    // 打开加载条
      this.isLoading = true
      try {
        const res = await loginAPI(this.user)
        // console.log(res)
        Notify({ type: 'success', message: '登陆成功' })
        // 存token
        setToken(res.data.data.token)
        // 存refresh-token
        setStorage('refresh_token', res.data.data.refresh_token)
        // 跳转至首页，replace不可以回退，push可以
        this.$router.replace({
          path: this.$route.query.path || '/layout/home'
        })
      } catch (error) {
        console.log(error)
        Notify({ type: 'danger', message: '账号或密码错误' })
      }
      // 关闭加载条
      this.isLoading = false
    }
  }
}
</script>

<style scoped lang="less">
// .van-nav-bar{
//     background-color: #007bff;
// }
// /deep/ .van-nav-bar__title{
//     color:white;
// }
</style>
