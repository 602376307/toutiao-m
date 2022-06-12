<template>
  <div>
    <!-- 评论列表 -->
    <div
      class="cmt-list"
      :class="{
        'art-cmt-container-1': isShowCmtInput,
        'art-cmt-container-2': !isShowCmtInput,
      }"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多评论了"
        @load="onLoad"
        :immediate-check="false"
        :offset="50"
      >
      <!-- 评论的 Item 项 -->
        <div class="cmt-item" v-for="(obj, i) in commentList" :key="obj.com_id">
          <!-- 头部区域 -->
          <div class="cmt-header">
            <!-- 头部左侧 -->
            <div class="cmt-header-left">
              <img :src="obj.aut_photo" alt="" class="avatar" />
              <span class="uname">{{ obj.aut_name }}</span>
            </div>
            <!-- 头部右侧 -->
            <div class="cmt-header-right">
              <van-icon
                name="like"
                size="16"
                color="red"
                @click="isLikeFn(false, i, obj.com_id)"
                v-if="obj.is_liking"
              />
              <van-icon
                name="like-o"
                size="16"
                color="gray"
                @click="isLikeFn(true, i, obj.com_id)"
                v-else
              />
            </div>
          </div>
          <!-- 主体区域 -->
          <div class="cmt-body">
            {{ obj.content }}
          </div>
          <!-- 尾部区域 -->
          <div class="cmt-footer">{{ timeAgo(obj.pubdate) }}</div>
        </div>
      </van-list>
    </div>

    <!-- 发表评论 -->
    <!-- 底部添加评论区域 - 1 -->
    <div class="add-cmt-box van-hairline--top" v-if="isShowCmtInput">
      <van-icon name="arrow-left" size="0.48rem" @click="$router.back()" />
      <div class="ipt-cmt-div" @click="isShowCmtInput = false">发表评论</div>
      <div class="icon-box">
        <van-badge :content="commentTotal === 0 ? '' : commentTotal" max="99">
          <van-icon
            name="comment-o"
            size="0.53333334rem"
            @click="commentClickFn"
          />
        </van-badge>
        <van-icon name="star-o" size="0.53333334rem" />
        <van-icon name="share-o" size="0.53333334rem" />
      </div>
    </div>

    <!-- 底部添加评论区域 - 2 -->
    <div class="cmt-box van-hairline--top" v-else>
      <!-- 失去焦点事件 -->
      <textarea
        placeholder="友善评论、理性发言、阳光心灵"
        v-model.trim="conmmentText"
        v-fofo
        @blur="blurFn"
      ></textarea>
      <van-button
        type="default"
        @click="sendFn"
        :disabled="conmmentText.length === 0"
        >发布</van-button
      >
    </div>
  </div>
</template>

<script>
import {
  getCommentsAPI,
  likeCommentAPI,
  unLikeCommentAPI,
  commentAPI
} from '@/api'
import { timeAgo } from '@/utils/data.js'
import { Toast } from 'vant'
export default {
  data () {
    return {
      offset: null, // 获取评论数据的偏移量
      commentList: [], // 返回的评论列表数据
      commentTotal: 0,
      isShowCmtInput: true, // 控制底部评论互斥显示
      conmmentText: '', // 发布的评论内容
      loading: false,
      finished: false,
      end_id: null, // 所有评论或回复的最后一个id
      last_id: null // 本次返回结果的最后一个评论id
    }
  },
  created () {
    this.getComments()
  },
  methods: {
    async getComments () {
      const res = await getCommentsAPI({ id: this.$route.query.art_id })
      console.log(res)
      this.commentList = res.data.data.results
      this.commentTotal = res.data.data.total_count
      this.end_id = res.data.data.end_id
      this.last_id = res.data.data.last_id
    },
    timeAgo,
    // 给评论点赞事件
    async isLikeFn (Boolean, i, id) {
      // 可以直接传obj进来 简单明了
      // 点赞
      if (Boolean) {
        this.commentList[i].is_liking = true
        const res = await likeCommentAPI(id)
        console.log(res)
      } else {
        this.commentList[i].is_liking = false
        const res = await unLikeCommentAPI(id)
        console.log(res)
      }
    },
    // toggleShowFn () {
    //   this.isShowCmtInput = false
    // }
    // 点击评论图标，滚动至评论区
    commentClickFn () {
      // 需要单独做动画效果
      // const articleHeight = document.querySelector('.article-container').scrollHeight
      // window.scrollTo(0, articleHeight)
      // 真实DOM都在document(所以不再一个vue文件内), 也是可以获取的
      // console.log(1)
      document.querySelector('.like-box').scrollIntoView({
        behavior: 'smooth'
      })
    },
    blurFn () {
      // 点击发布评论就触发失焦事件，v-if移除标签，导致无法获取v-model绑定的内容。因此加定时器移入异步任务
      setTimeout(() => {
        this.isShowCmtInput = true
      }, 0)
    },
    // 发布评论
    async sendFn () {
      const res = await commentAPI({
        id: this.$route.query.art_id,
        content: this.conmmentText
      })
      // console.log(res)
      if (res.status === 201) {
        Toast('发布成功')
        this.conmmentText = ''
        // this.getComments()
        this.commentList.unshift(res.data.data.new_obj)
        this.commentTotal++
        this.commentClickFn()
      }
    },
    // 底部自动加载更多
    async onLoad () {
      if (this.end_id === null || this.end_id === this.last_id) {
        this.finished = true
      } else {
        const res = await getCommentsAPI({ id: this.$route.query.art_id, offset: this.last_id })
        this.commentList = [...this.commentList, ...res.data.data.results]
        this.commentTotal = res.data.data.total_count
        this.end_id = res.data.data.end_id
        this.last_id = res.data.data.last_id
        this.loading = false
        if (this.end_id === this.last_id) {
          this.finished = true
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.cmt-list {
  padding: 10px;
  .cmt-item {
    padding: 15px 0;
    + .cmt-item {
      border-top: 1px solid #f8f8f8;
    }
    .cmt-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .cmt-header-left {
        display: flex;
        align-items: center;
        .avatar {
          width: 40px;
          height: 40px;
          background-color: #f8f8f8;
          border-radius: 50%;
          margin-right: 15px;
        }
        .uname {
          font-size: 12px;
        }
      }
    }
    .cmt-body {
      font-size: 14px;
      line-height: 28px;
      text-indent: 2em;
      margin-top: 6px;
      word-break: break-all;
    }
    .cmt-footer {
      font-size: 12px;
      color: gray;
      margin-top: 10px;
    }
  }
}
/*美化 - 文章详情 - 底部的评论页面 */
// 外层容器
.art-cmt-container-1 {
  padding-bottom: 46px;
}
.art-cmt-container-2 {
  padding-bottom: 80px;
}

// 发布评论的盒子 - 1
.add-cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 46px;
  line-height: 46px;
  padding-left: 10px;
  .ipt-cmt-div {
    flex: 1;
    border: 1px solid #efefef;
    border-radius: 15px;
    height: 30px;
    font-size: 12px;
    line-height: 30px;
    padding-left: 15px;
    margin-left: 10px;
    background-color: #f8f8f8;
  }
  .icon-box {
    width: 40%;
    display: flex;
    justify-content: space-evenly;
    line-height: 0;
  }
}

.child {
  width: 20px;
  height: 20px;
  background: #f2f3f5;
}

// 发布评论的盒子 - 2
.cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding-left: 10px;
  box-sizing: border-box;
  background-color: white;
  textarea {
    flex: 1;
    height: 66%;
    border: 1px solid #efefef;
    background-color: #f8f8f8;
    resize: none;
    border-radius: 6px;
    padding: 5px;
  }
  .van-button {
    height: 100%;
    border: none;
  }
}
/deep/ .add-cmt-box .van-icon-arrow-left {
  color: #000;
}
</style>
