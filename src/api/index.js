import request from '@/utils/request'
import { getStorage } from '@/utils/storage'
// import { getToken } from '@/utils/token'
// axios内部，会把参数对象转成json字符串格式，会自动携带请求参数application/json

// export * from 即导入也向外导出
/**
 * 登录
 * **/
export const loginAPI = data => request({
  url: '/v1_0/authorizations',
  method: 'POST',
  data
})

// 刷新token
export const updateTokenAPI = () => request({
  url: '/v1_0/authorizations',
  method: 'PUT',
  headers: {
    Authorization: `Bearer ${getStorage('refresh_token')}`
  }
})

/**
 * 获取所有频道
 * **/
export const getAllChannelsAPI = () => request({
  url: '/v1_0/channels'
})

/**
 * 获取用户的频道
 * **/
export const getUserChannelsAPI = () => request({
  url: '/v1_0/user/channels'
})

/**
 * 设置用户频道 重置式
 * **/
export const updateChannelsAPI = channels => request({
  url: '/v1_0/user/channels',
  method: 'PUT',
  data: {
    channels
  }
})

/**
 * 删除用户的频道
 * **/
export const deleteChannelsAPI = id => request({
  url: `/v1_0/user/channels/${id}`,
  method: 'DELETE'
})

/**
 * 获取文章推荐列表
 * **/
export const getArticleListAPI = ({ channel_id, timestamp }) => request({
  url: '/v1_0/articles',
  params: {
    channel_id,
    timestamp
  }
})

/**
 * 文章反馈 不感兴趣
 * **/
export const dislikeArticleAPI = targetId => request({
  url: '/v1_0/article/dislikes',
  method: 'POST',
  data: {
    target: targetId
  }
})

/**
 * 文章反馈 举报文章
 * **/
export const reportArticleAPI = (targetId, type) => request({
  url: '/v1_0/article/reports',
  method: 'POST',
  data: {
    target: targetId,
    type: type,
    remark: ''
  }
})

/**
 * 文章内容详情
 * **/
export const ArticleDetailAPI = id => request({
  url: `/v1_0/articles/${id}`
})

// 文章 --  对文章点赞
export const likeArticleAPI = id => request({
  url: '/v1_0/article/likings',
  method: 'POST',
  data: {
    target: id
  }
})

// 文章 --  取消文章点赞
export const unLikeArticleAPI = id => request({
  url: `/v1_0/article/likings/${id}`,
  method: 'DELETE'
})

// 评论 --- 获取评论
export const getCommentsAPI = ({ id, offset = null, limit = 10 }) => request({
  url: '/v1_0/comments',
  params: { // axios的params 键值对的值为空，则会忽略，不携带进url的？后面
    type: 'a', // 只做对文章的评论
    source: id,
    offset,
    limit
  }
})

// 评论---对评论点赞
export const likeCommentAPI = id => request({
  url: '/v1_0/comment/likings',
  method: 'POST',
  data: {
    target: id
  }
})

// 评论---取消对评论点赞
export const unLikeCommentAPI = id => request({
  url: `/v1_0/comment/likings/${id}`,
  method: 'DELETE'
})

// 评论 --- 对文章进行评论
export const commentAPI = ({ id, content, art_id = null }) => {
  // null只有params才忽略,因此需要自己处理
  const obj = {
    target: id,
    content
  }
  if (art_id !== null) { // 如果不为空，则obj有三个参数
    obj.art_id = art_id
  }
  return request({
    url: '/v1_0/comments',
    method: 'POST',
    data: obj
  })
}

/**
 * 搜索 搜索建议
 * **/
export const searchSuggestionAPI = q => request({
  url: '/v1_0/suggestion',
  params: {
    q
  }
})

/**
 * 搜索 搜索结果
 * **/
export const searchResultAPI = ({ page = 1, per_page = 10, q }) => request({
  url: '/v1_0/search',
  params: {
    page,
    per_page,
    q
  }
})

// 用户---关注用户
export const followUserAPI = id => request({
  url: '/v1_0/user/followings',
  method: 'POST',
  data: {
    target: id
  }
})

// 用户---取消关注用户
export const unFollowUserAPI = id => request({
  url: `/v1_0/user/followings/${id}`,
  method: 'DELETE'
})

// 用户--获取用户个人资料--编辑资料页
export const getUserInfoAPI = () => request({
  url: '/v1_0/user/profile'
})

// 用户--获取用户基本信息--个人资料页
export const userAPI = () => request({
  url: '/v1_0/user'
})

// 用户--更新头像
export const updateUserPhotoAPI = fd => request({
  url: '/v1_0/user/photo',
  method: 'PATCH',
  data: fd // 直接用外面传进来的表单对象
  // 如果你的请求体内容是表单对象, 浏览器会自动携带请求头Content-Type为multipart/form-data
})

// 用户-更新个人资料
export const updateUserInfoAPI = data => request({
  url: '/v1_0/user/profile',
  method: 'PATCH',
  data
})
