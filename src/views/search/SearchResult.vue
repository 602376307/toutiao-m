<template>
  <div>
    <!-- 搜索结果页-头部导航 -->
    <div class="search-result-container">
      <!-- 点击实现后退效果 -->
      <van-nav-bar
        title="搜索结果"
        left-arrow
        @click-left="$router.go(-1)"
        fixed
      />
      <van-list
        v-model="loading"
        :finished="finished"
        :immediate-check="false"
        :offset="50"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <ArticleItem
          v-for="obj in ArticleItemList"
          :key="obj.art_id"
          :artObj="obj"
          :isShow="false"
          @click.native="detailFn(obj.art_id)"
        ></ArticleItem>
      </van-list>
    </div>
  </div>
</template>

<script>
import { searchResultAPI } from '@/api'
import ArticleItem from '@/components/ArticleItem.vue'
export default {
  name: 'SearchResult',
  props: {},
  components: {
    ArticleItem
  },
  data () {
    return {
      page: 1, // 搜索结果页数
      q: this.$route.params.kw, // 关键字，从路由中取
      ArticleItemList: [],
      loading: false, // 控制加载更多的状态
      finished: false
      // refreshing: false // 控制下拉刷新
    }
  },
  created () {
    this.searchResult()
  },
  methods: {
    async searchResult () {
      const res = await searchResultAPI({ page: this.page, q: this.q })
      // console.log(res)
      this.ArticleItemList = [...this.ArticleItemList, ...res.data.data.results]
      if (res.data.data.results.length === 0) {
        this.finished = true
      }
      this.loading = false
    },
    onLoad () {
      if (this.ArticleItemList.length > 0) {
        this.page++
        this.searchResult()
      }
    },
    detailFn (id) {
      this.$router.push({
        path: `/detail?art_id=${id}`
      })
    }
  }
}
</script>

<style lang="less" scoped>
.search-result-container {
  padding-top: 46px;
}
/deep/ .van-icon-arrow-left {
  color: #fff;
}
</style>
