<template>
  <div>
    <!-- 组件缓存   include exclude -->
    <keep-alive exclude="Search,ArticleDetail,SearchResult,UserEdit">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
// import { getAllChannelsAPI } from '@/api'
export default {
  // async created () {
  //   try {
  //     const res = await getAllChannelsAPI()
  //     console.log(res)
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }
}
</script>

<style>

</style>
