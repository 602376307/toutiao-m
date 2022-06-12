<template>
  <div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :immediate-check="false"
        :offset="50"
        @load="onLoad"
      >
        <ArticleItem
          v-for="obj in articleList"
          :key="obj.art_id"
          :artObj="obj"
          :isShow="true"
          @dislikeArticleEV="dislikeFn"
          @reportArticleEV="reportFn"
          @click.native="detailFn(obj.art_id)"
        ></ArticleItem>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import ArticleItem from '../../../components/ArticleItem.vue'
import { getArticleListAPI, dislikeArticleAPI, reportArticleAPI } from '@/api'
import { Toast, Notify } from 'vant'
export default {
  components: {
    ArticleItem
  },
  props: {
    channelId: Number
  },
  data () {
    return {
      articleList: [],
      loading: false, // 底部加载状态
      finished: false, // 底部加载完毕
      theTime: new Date().getTime(),
      isLoading: false // 顶部下拉刷新
    }
  },
  created () {
    this.getArticleList()
  },
  methods: {
    async getArticleList () {
      const res = await getArticleListAPI({
        channel_id: this.channelId,
        timestamp: this.theTime
      })
      // console.log(res)
      this.articleList = [...this.articleList, ...res.data.data.results]
      this.theTime = res.data.data.pre_timestamp
      this.loading = false
      if (res.data.data.pre_timestamp === null) {
        this.finished = true
      }
      this.isLoading = false
    },
    // 网页刚打开onLoad也会执行
    async onLoad () { // 底部刷新
      if (this.articleList.length === 0) {
        return
      }
      this.getArticleList()
    },
    // 顶部下拉刷新
    onRefresh () {
      this.articleList = []
      this.theTime = new Date().getTime()
      this.getArticleList()
      Toast('刷新成功')
    },
    // 反馈-不感兴趣
    async dislikeFn (id) {
      try {
        const res = await dislikeArticleAPI(id)
        console.log(res)
        Notify({ type: 'success', message: '反馈成功' })
      } catch (error) {
      //   Notify({ type: 'danger', message: '反馈失败' })
      }
    },
    // 反馈-举报文章
    async reportFn (id, index) {
      try {
        const res = await reportArticleAPI(id, index)
        console.log(res)
        Notify({ type: 'success', message: '举报成功' })
      } catch (error) {
      //   Notify({ type: 'danger', message: '举报失败' })
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

<style>
</style>
