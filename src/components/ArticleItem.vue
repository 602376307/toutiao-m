<template>
  <!-- 一条文章单元格 -->
  <div>
    <van-cell>
      <!-- 标题区域的插槽 -->
      <template #title>
        <div class="title-box">
          <!-- 标题 -->
          <span>{{artObj.title}}</span>
          <!-- 一张图 -->
          <img v-if="artObj.cover.type === 1" class="thumb" alt="" v-lazy="artObj.cover.images[0]">
          <!-- <img v-if="artObj.cover.type === 1" class="thumb" alt="" :src="artObj.cover.images[0]"> -->
          <!-- <van-image v-if="artObj.cover.type === 1" class="thumb" :src="artObj.cover.images[0]" alt="">
            <template v-slot:error>加载失败</template>
          </van-image> -->
        </div>
        <div class="thumb-box" v-if="artObj.cover.type > 1">
        <!-- 大于一张图 -->
          <img class="thumb"
          v-for="(item,index) in artObj.cover.images"
          v-lazy="item"
          :key="index"
          >
          <!-- <img class="thumb"
          v-for="(item,index) in artObj.cover.images"
          :src="item"
          :key="index"
          > -->
          <!-- <van-image class="thumb" :src="item"
          v-for="(item,index) in artObj.cover.images"
          :key="index">
            <template v-slot:error>加载失败</template>
          </van-image> -->
        </div>
      </template>
      <!-- label 区域的插槽 -->
      <template #label>
        <div class="label-box">
          <div>
            <span>{{ artObj.aut_name }}</span>
            <span>{{ artObj.comm_count }}</span>
            <span>{{ timeAgo(artObj.pubdate) }}</span>
          </div>
          <!-- 反馈按钮 阻止事件冒泡-->
          <van-icon name="cross" @click.stop="show = true" v-if="isShow"/>
        </div>
      </template>
    </van-cell>
    <!-- 动作面板弹窗 -->
    <van-action-sheet v-model="show" :actions="actions" @select="onSelect" @cancel="cancelFn" @close="closeFn" :cancel-text="cancelText" get-container="body" />
  </div>

</template>

<script>
import { timeAgo } from '@/utils/data.js'
import { firstActions, secondActions } from '@/api/report.js'

export default {
  props: {
    artObj: Object,
    isShow: Boolean // 反馈按钮显示与隐藏
  },
  data () {
    return {
      show: false, // 反馈页面显示与隐藏
      actions: firstActions, // 一级反馈菜单
      cancelText: '取消'
    }
  },
  methods: {
    timeAgo,
    onSelect (action, index) {
      if (action.name === '反馈垃圾内容') {
        this.cancelText = '返回'
        this.actions = secondActions
      } else if (action.name === '不感兴趣') {
        this.$emit('dislikeArticleEV', this.artObj.art_id)
        this.show = false
      } else {
        this.$emit('reportArticleEV', this.artObj.art_id, action.value)
        this.show = false
      }
    },
    cancelFn () {
      if (this.cancelText === '返回') {
        this.actions = firstActions
        this.show = true
        this.cancelText = '取消'
      }
    },
    closeFn () {
      this.cancelText = '取消'
      this.actions = firstActions
    }
  }
}
</script>

<style scoped lang="less">
/* 标题样式 */
.title-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

/* label描述样式 */
.label-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 文章信息span */
.label-box span{
    margin: 0 3px;
    &:first-child{
        margin-left: 0;
    }
}

/* 图片的样式, 矩形黄金比例：0.618 */
.thumb {
  width: 113px;
  height: 70px;
  background-color: #f8f8f8;
  object-fit: cover;
}

/* 三图, 图片容器 */
.thumb-box {
  display: flex;
  justify-content: space-between;
}
</style>
