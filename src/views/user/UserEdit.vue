<template>
  <div class="user-edit-container">
    <!-- Header 区域 -->
    <van-nav-bar title="编辑资料" left-arrow @click-left="$router.back()" fixed />

    <!-- 用户资料 -->
    <van-cell-group class="action-card">
      <van-cell title="头像" is-link center>
        <template #default>
          <van-image round class="avatar" :src="userInfo.photo" @click="imageClickFn"/>
          <input type="file" v-show="false" ref="iptFile" accept="image/*" @change="onFileChangeFn">
        </template>
      </van-cell>
      <van-cell title="名称" :value="userInfo.name" is-link  @click="nameClickFn"/>
      <van-cell title="生日" :value="userInfo.birthday" is-link  @click="birthdayClickFn"/>
    </van-cell-group>
    <!-- 编辑昵称弹窗 -->
    <van-dialog v-model="show" title="修改昵称" show-cancel-button :before-close="beforCloseFn">
      <input type="text" v-fofo v-model="inputUserName" >
    </van-dialog>
    <!-- 日期选择弹窗 -->
    <van-popup v-model="timeShow" get-container="body" position="bottom" round >
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="timeOkFn"
        @cancel="timeCancelFn"
      />
    </van-popup>
  </div>
</template>

<script>
import { getUserInfoAPI, updateUserPhotoAPI, updateUserInfoAPI } from '@/api'
import { farmatTime } from '@/utils/data.js'
import { mapMutations } from 'vuex'
import { Notify } from 'vant'
export default {
  name: 'UserEdit',
  data () {
    return {
      userInfo: {},
      show: false, // 控制编辑昵称弹窗显示隐藏
      inputUserName: '',
      minDate: new Date(1960, 0, 1),
      maxDate: new Date(), // 不写获取当前系统时间
      currentDate: new Date(2021, 0, 17),
      timeShow: false
    }
  },
  created () {
    this.getUserInfo()
  },
  methods: {
    ...mapMutations(['SET_USERPHOTO', 'SET_NICKNAME']),
    async getUserInfo () {
      const res = await getUserInfoAPI()
      this.userInfo = res.data.data
    },
    // 图片点击事件
    imageClickFn () {
      this.$refs.iptFile.click()
    },
    // 文件选择框内容改变事件
    async onFileChangeFn (e) {
    //   console.log(e.target.files[0]) 对象的key是0 看似是数组而已 e.target.files拿到用户选中的文件
      if (e.target.files.length === 0) return // 如果没有图片就结束
      const fd = new FormData() // 创建一个formdata对象
      fd.append('photo', e.target.files[0]) // append方法往里添加键值对
      const res = await updateUserPhotoAPI(fd)
      this.SET_USERPHOTO(res.data.data.photo)
      this.userInfo.photo = res.data.data.photo
    },
    // 昵称点击事件
    nameClickFn () {
      this.show = true
      this.inputUserName = this.userInfo.name
    },
    // 编辑昵称弹窗关闭前触发
    async beforCloseFn (action, done) {
      if (action === 'confirm') {
        // 确定
        var pattern = /^[A-Za-z0-9\u4e00-\u9fa5]{1,7}$/
        if (pattern.test(this.inputUserName)) {
          // 通过校验
          const res = await updateUserInfoAPI({ name: this.inputUserName })
          if (res.status === 200) {
            done()
            this.userInfo.name = this.inputUserName
            this.SET_NICKNAME(this.inputUserName)
            Notify({ type: 'success', message: '修改昵称成功' })
          }
        } else {
          Notify({ type: 'warning', message: '昵称必须是1-7位的中英文数字组合' })
          done(false)
        }
      } else {
        done() // 关闭弹窗
      }
    },
    // 点击生日编辑
    birthdayClickFn () {
      this.timeShow = true
      this.currentDate = new Date(this.userInfo.birthday) // 打开时显示当前用户的生日
    },
    // 点击生日编辑确认
    async timeOkFn (value) {
      // value其实就是currentDate
      const res = await updateUserInfoAPI({ birthday: farmatTime(value) })
      if (res.status === 200) {
        this.userInfo.birthday = farmatTime(value)
        Notify({ type: 'success', message: '修改生日成功' })
        this.timeShow = false
      }
    },
    // 点击生日编辑取消
    timeCancelFn () {
      this.timeShow = false
    }
  }
}
</script>

<style lang="less" scoped>
.user-edit-container {
  padding-top: 46px;
  .avatar {
    width: 50px;
    height: 50px;
  }
}
/deep/ .van-icon-arrow-left {
    color: #fff;
}
/deep/ .van-dialog__content {
  text-align: center;
  input {
    padding: 0;
    outline: none;
    text-align: center;
    border: none;
  }
}
</style>
