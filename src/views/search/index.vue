<template>
  <div>
    <!-- 搜索页面头部 -->
    <div class="search-header">
      <!-- 后退按钮 -->
      <van-icon
        name="arrow-left"
        color="white"
        size="0.48rem"
        class="goback"
        @click="$router.back()"
      />
      <!-- 搜索组件 -->
      <van-search
        v-model.trim="kw"
        @input="inputFn"
        v-fofo
        placeholder="请输入搜索关键词"
        background="#007BFF"
        shape="round"
        @search="searchFn"
      />
    </div>
    <!-- 搜索建议列表 -->
    <div class="sugg-list" v-if="kw.length !== 0">
      <div
        class="sugg-item"
        v-for="(str, index) in searchSuggestionList"
        :key="index"
        v-html="lightFn(str, kw)"
        @click="suggestFn(str)"
      ></div>
    </div>
    <!-- 搜索历史 -->
    <div class="search-history" v-else>
      <!-- 标题 -->
      <van-cell title="搜索历史">
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #right-icon>
          <van-icon name="delete" class="search-icon" @click="deleteFn"/>
        </template>
      </van-cell>

      <!-- 历史列表 -->
      <div class="history-list">
        <span class="history-item" v-for="(str, index) in history" :key="index" @click="historyFn(str)">{{ str }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { searchSuggestionAPI } from '@/api'
// import { Toast } from 'vant'
import { setStorage, getStorage } from '@/utils/storage'

export default {
  name: 'Search',
  data () {
    return {
      kw: '', // 搜索关键字
      timer: null, // 防抖定时器
      searchSuggestionList: [], // 搜索建议数组
      history: JSON.parse(getStorage('his')) || [] // 搜索历史
    }
  },
  methods: {
    // 防抖 请求搜索建议
    inputFn () {
      // 先来个防抖 延时执行代码，事件再次触发前，清除上一个定时器
      clearTimeout(this.timer) // 必须写在判断外面
      if (this.kw.length === 0) {
        this.searchSuggestionList = []
      } else {
        this.timer = setTimeout(async () => {
          // if (this.kw.length === 0) return
          // async 要写在外层函数， 而不是最外层
          const res = await searchSuggestionAPI(this.kw)
          // console.log(res)
          if (res.data.data.options[0] === null) {
            // Toast('无数据返回')
            console.log('无联想关键字')
          } else {
            this.searchSuggestionList = res.data.data.options
          }
        }, 300)
      }
    },
    // 搜索建议关键字高亮
    lightFn (str, kw) {
      // 关键字高亮 replace替换第一个 replaceAll替换所有 但只针对汉字
      const reg = new RegExp(kw, 'ig')
      return str.replace(reg, (match, p1, p2) => {
        // console.log(match, p1, p2)
        return `<span style="color: red;">${match}</span>`
      })
    },
    // 输入框搜索事件
    searchFn () {
      // 跳转路由前，把当前页面的事做完
      if (this.kw.length > 0) {
        this.history.push(this.kw) // 存储进搜索历史数组
        // this.$router.push({
        //   name: 'SearchResult',
        //   params: {
        //     kw: this.kw
        //   }
        // }) 动态路由传参 不可以使用path+params 但可以使用name+params
        setTimeout(() => {
          this.$router.push(`/search_result/${this.kw}`) // 也可使用拼接
        }, 0)
      }
    },
    // 联想菜单
    suggestFn (str) {
      // 坑： 路由跳转 watch执行前 ，定时器包裹跳转，让跳转最后执行
      this.history.push(this.kw) // 存储进搜索历史数组
      setTimeout(() => {
        this.$router.push(`/search_result/${this.kw}`)
      }, 0)
    },
    // 搜索历史
    historyFn (str) {
      this.$router.push(`/search_result/${str}`)
    },
    // 清空搜索历史
    deleteFn () {
      // localStorage.removeItem('his') 不用清空本地存储 因为有监听器
      this.history = []
    }
  },
  watch: {
    history: {
      deep: true,
      handler () {
        // set 无序的不重复的集合 ES6新增
        const theSet = new Set(this.history)
        const arr = Array.from(theSet) // Array.from() 方法对一个类似数组或可迭代对象创建一个新的，浅拷贝的数组实例。
        setStorage('his', JSON.stringify(arr)) // 本地存储只存字符串
      }
    }
  }
}
</script>

<style scoped lang="less">
.search-header {
  height: 46px;
  display: flex;
  align-items: center;
  background-color: #007bff;
  overflow: hidden;
  /*后退按钮*/
  .goback {
    padding-left: 14px;
  }
  /*搜索组件*/
  .van-search {
    flex: 1;
  }
}
/*搜索建议列表样式 */
.sugg-list {
  .sugg-item {
    padding: 0 15px;
    border-bottom: 1px solid #f8f8f8;
    font-size: 14px;
    line-height: 50px;
    // 实现省略号的三行代码
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
/**搜索历史 */
.search-icon {
  font-size: 16px;
  line-height: inherit;
}

.history-list {
  padding: 0 10px;
  .history-item {
    display: inline-block;
    font-size: 12px;
    padding: 8px 14px;
    background-color: #efefef;
    margin: 10px 8px 0px 8px;
    border-radius: 10px;
  }
}
</style>
