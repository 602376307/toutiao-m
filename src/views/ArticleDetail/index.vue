<template>
  <div>
    <!-- Header 区域 -->
    <van-nav-bar
      fixed
      title="文章详情"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- 加载图标 -->
    <!--                               或者artData.aut_name === undefined-->
    <van-loading color="#1989fa" v-if="Object.keys(artData).length === 0">加载中</van-loading>
    <div v-else>
      <!-- 文章信息区域 -->
      <div class="article-container">
        <!-- 文章标题 -->
        <h1 class="art-title">{{ artData.title }}</h1>

        <!-- 用户信息 -->
        <van-cell
          center
          :title="artData.aut_name"
          :label="formatDate(artData.pubdate)"
        >
          <template #icon>
            <img :src="artData.aut_photo" alt="" class="avatar" />
          </template>
          <template #default>
            <div>
              <van-button
                type="info"
                size="mini"
                @click="followUserFn(false)"
                v-if="artData.is_followed"
                >已关注</van-button
              >
              <van-button
                icon="plus"
                type="info"
                @click="followUserFn(true)"
                v-else
                size="mini"
                plain
                >关注</van-button
              >
            </div>
          </template>
        </van-cell>

        <!-- 分割线 -->
        <van-divider></van-divider>

        <!-- 文章内容 -->
        <div class="art-content" v-html="artData.content"></div>

        <!-- 分割线 -->
        <van-divider>End</van-divider>

        <!-- 点赞 -->
        <div class="like-box">
          <van-button
            icon="good-job"
            type="danger"
            size="small"
            @click="likeFn(false)"
            v-if="artData.attitude === 1"
            >已点赞</van-button
          >
          <van-button
            icon="good-job-o"
            type="danger"
            plain
            size="small"
            @click="likeFn(true)"
            v-else
            >点赞</van-button
          >
        </div>
      </div>

      <!-- 文章评论  -->
      <CommentList></CommentList>
    </div>
  </div>
</template>

<script>
import CommentList from './CommentList.vue'
import {
  ArticleDetailAPI,
  followUserAPI,
  unFollowUserAPI,
  likeArticleAPI,
  unLikeArticleAPI
} from '@/api'
import { timeAgo } from '@/utils/data.js'
import { Toast } from 'vant'
export default {
  name: 'ArticleDetail',
  components: {
    CommentList
  },
  data () {
    return {
      artData: {}, // 文章对象
      show: true // 控制加载显示隐藏
    }
  },
  created () {
    this.detail()
  },
  methods: {
    async detail () {
      const res = await ArticleDetailAPI(this.$route.query.art_id)
      // console.log(res.data.data.attitude)
      this.artData = res.data.data
    },
    formatDate: timeAgo, // 格式化时间 多久之前
    // 关注/取关 作者--点击事件
    async followUserFn (Boolean) {
      if (Boolean) {
        try {
          const res = await followUserAPI(this.artData.aut_id)
          if (res.status === 201) {
            this.artData.is_followed = true
            Toast('关注成功')
          }
        } catch (error) {
          Toast('关注失败')
          console.log('关注失败')
        }
      } else {
        try {
          const res = await unFollowUserAPI(this.artData.aut_id)
          if (res.status === 204) {
            this.artData.is_followed = false
            Toast('取消关注成功')
          }
        } catch (error) {
          Toast('取消关注失败')
          console.log('取消关注失败')
        }
      }
    },
    // 点赞/取消点赞
    async likeFn (Boolean) {
      // 如果没有点赞
      if (Boolean) {
        try {
          const res = await likeArticleAPI(this.artData.art_id)
          if (res.status === 201) {
            this.artData.attitude = 1
            Toast('点赞成功')
          }
        } catch (error) {
          Toast('点赞失败')
          console.log('点赞失败')
        }
        // 如果已经点赞
      } else {
        try {
          const res = await unLikeArticleAPI(this.artData.art_id)
          if (res.status === 204) {
            this.artData.attitude = -1
            Toast('取消点赞成功')
          }
        } catch (error) {
          Toast('取消点赞失败')
          console.log('取消点赞失败')
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.article-container {
  padding: 10px;
  margin-top: 46px;
}
.art-title {
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0;
}

.art-content {
  font-size: 12px;
  line-height: 24px;
  width: 100%;
  overflow-x: scroll;
  word-break: break-all;
  /deep/ img {
    width: 100%;
  }
  /deep/ pre {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}

.van-cell {
  padding: 5px 0;
  &::after {
    display: none;
  }
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f8f8f8;
  margin-right: 5px;
  border: none;
}

.like-box {
  display: flex;
  justify-content: center;
}
/deep/ .van-icon-arrow-left {
  color: #fff;
}
.van-loading {
  text-align: center;
  padding-top: 52px;
}
</style>
