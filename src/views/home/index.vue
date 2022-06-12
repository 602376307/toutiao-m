<template>
  <div>
    <!-- 顶导航栏 -->
    <van-nav-bar fixed>
      <template #left>
        <img src="@/assets/toutiao_logo.png" class="logo" />
      </template>
      <template #right>
        <!-- 行内样式不会转为rem 需要手动转，原本这里是18px。18/37.5 -->
        <van-icon name="search" size="0.48rem" color="#fff" @click="goSearchPage"/>
      </template>
    </van-nav-bar>
    <!-- 标签栏 -->
    <div class="tabs">
      <van-tabs v-model="channelId" sticky animated offset-top="1.226667rem" @change="changeFn">
        <van-tab v-for="item in userChannelsList" :key="item.id" :title="item.name" :name="item.id">
        <ArticleIist :channelId="item.id"></ArticleIist>
        </van-tab>
      </van-tabs>
      <!-- 编辑频道图标 -->
    <van-icon name="plus" size="0.37333334rem" class="moreChannels" get-container="body" @click="show = true"/>
    </div>
    <!-- 编辑频道弹出层 -->
    <van-popup class="channelPopup" v-model="show">
      <ChannelEdit
        :userList="userChannelsList"
        :moreList="unChannelList"
        @addChannelEV="addChannelFn"
        @deleteChannelEV="deleteChannelFn"
        @closeEV="closeFn"
        ref="edit"
        v-model="channelId"
          ></ChannelEdit>
    </van-popup>
  </div>
</template>

<script>
import { getUserChannelsAPI, getAllChannelsAPI, updateChannelsAPI, deleteChannelsAPI } from '@/api'
// import { Toast } from 'vant'
import ArticleIist from './components/ArticleIist.vue'
import ChannelEdit from './ChannelEdit.vue'
export default {
  components: {
    ArticleIist,
    ChannelEdit
  },
  data () {
    return {
      channelId: 0, // 控制激活的频道  0  默认请求推荐列表
      userChannelsList: [], // 用户选择的频道列表数据
      // articleList: []
      show: false, // 控制编辑频道弹出层显示/隐藏
      allChannelsList: [],
      channelScrollObj: {} // 存储每个频道的滚动条位置  channelId: scrollTop
    }
  },
  // 刚打开网页时，只创建推荐的ArticleIist，其他ArticleIist未被创建。首次切换到其他标签时，其他的ArticleIist才被创建。
  // 当第二次切换到相同标签时，是用显示与隐藏
  created () {
    this.getUserChannels()
    // this.getArticleList()
    this.getAllChannels()
  },
  methods: {
    async getUserChannels () {
      const res = await getUserChannelsAPI()
      this.userChannelsList = res.data.data.channels
      // console.log(res)
    },
    async getAllChannels () {
      const res = await getAllChannelsAPI()
      // console.log(res)
      this.allChannelsList = res.data.data.channels
    },
    // 添加频道
    async addChannelFn (obj) {
      this.userChannelsList.push(obj)
      // 处理接口需要的数据 不需要name属性，且新增seq，且推荐频道不允许修改
      // const newArr = this.userChannelsList.filter(obj => obj.id !== 0)
      // console.log(newArr)
      const theNewArr = this.userChannelsList.map((obj, index) => {
        const newObj = { ...obj } // 拷贝一份，否则影响原数组
        delete newObj.name
        newObj.seq = index
        return newObj
      })
      // console.log(theNewArr)
      const res = await updateChannelsAPI(theNewArr)
      console.log(res)
    },
    // 删除频道
    async deleteChannelFn (obj) {
      const index = this.userChannelsList.findIndex(item => item.id === obj.id)
      this.userChannelsList.splice(index, 1)
      // 可以用删除接口，也可用覆盖式接口
      const res = await deleteChannelsAPI(obj.id)
      console.log(res) // 该删除接口没有返回值 状态码204
    },
    closeFn () {
      this.show = false
      this.$refs.edit.isEdit = false
    },
    // 首页-右上角放大镜-进入搜索页面
    goSearchPage () {
      this.$router.push('/search')
    },
    // 频道切换时触发
    changeFn () {
      // 由于切换频道时，原频道高度变为零，因此切回来的瞬间高度还是为0，需要等页面加载完后执行
      this.$nextTick(() => {
        document.documentElement.scrollTop = this.channelScrollObj[this.channelId]
      })
    },
    scrollFn () {
      this.$route.meta.scrollT = document.documentElement.scrollTop // 保存首页滚动条位置
      this.channelScrollObj[this.channelId] = document.documentElement.scrollTop // 保存频道滚动条位置
    }
  },
  computed: {
    unChannelList () { // 筛选 更多频道
      const newArr = this.allChannelsList.filter(item => {
        const index = this.userChannelsList.findIndex(smallItem => {
          return smallItem.id === item.id
        })
        if (index === -1) {
          return true
        } else {
          return false
        }
      })
      return newArr
    }
  },
  activated () {
    // 监听滚动事件，赋值给路由
    window.addEventListener('scroll', this.scrollFn) // 切回来时会把这里执行完再执行this.scrollFn
    // 切回来时立刻取路由值给当前页  注意这里属于原生，不是响应式的 只会执行一次
    document.documentElement.scrollTop = this.$route.meta.scrollT
  },
  deactivated () {
    // 移除事件监听
    window.removeEventListener('scroll', this.scrollFn)
  }
}
</script>

<style scoped lang="less">
.logo {
  width: 100px;
  height: 30px;
}
.tabs {
  padding-top: 46px;
}
// 设置 tabs 容器的样式
/deep/ .van-tabs__wrap {
  padding-right: 30px;
  background-color: #fff;
}
.moreChannels {
  position: fixed;
  top: 60px;
  right: 8px;
  z-index: 999;
}
// vw vh相对于浏览器窗口的百分比
.channelPopup {
  width: 100vw;
  height: 100vh;
}
</style>
