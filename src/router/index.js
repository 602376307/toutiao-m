import Vue from 'vue'
import VueRouter from 'vue-router'
import { getToken } from '@/utils/token.js'
// import Login from '@/views/login'
// import Layout from '@/views/layout'
// import Home from '@/views/home'
// import User from '@/views/user'
// import Search from '@/views/search'
// import SearchResult from '@/views/search/SearchResult'
// import ArticleDetail from '@/views/ArticleDetail'
// import UserEdit from '@/views/user/UserEdit'
// import Chat from '@/views/Chat'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/layout'
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "Login" */ '@/views/login')
    // 路由独享守卫
    // beforeEnter: (to, from, next) => {
    //   // ?.可选链操作符，前面对象没有length时，返回undefined
    //   // 需求：已登录，不能去登录页
    //   if (getToken()?.length > 0) {
    //     // next(false) // 阻止跳转
    //     next('/layout/home')
    //   } else {
    //     next()
    //   }
    // }
  },
  {
    path: '/layout',
    component: () => import(/* webpackChunkName: "Layout" */ '@/views/layout'),
    redirect: '/layout/home',
    children: [
      {
        path: 'home',
        component: () => import(/* webpackChunkName: "Home" */ '@/views/home'),
        meta: {
          scrollT: 0 // 储存滚动条位置
        }
      },
      {
        path: 'user',
        component: () => import(/* webpackChunkName: "User" */ '@/views/user')
      }
    ]
  },
  {
    path: '/search',
    component: () => import(/* webpackChunkName: "Search" */ '@/views/search')
  },
  {
    path: '/search_result/:kw',
    component: () => import(/* webpackChunkName: "SearchResult" */ '@/views/search/SearchResult'),
    name: 'SearchResult'
  },
  {
    path: '/detail',
    component: () => import(/* webpackChunkName: "ArticleDetail" */ '@/views/ArticleDetail')
  },
  {
    path: '/user_editor',
    component: () => import(/* webpackChunkName: "UserEdit" */ '@/views/user/UserEdit')
  },
  {
    path: '/chat',
    component: () => import(/* webpackChunkName: "Chat" */ '@/views/Chat')
  }

]

const router = new VueRouter({
  routes
})

// 路由全局守卫
router.beforeEach((to, from, next) => {
  // ?.可选链操作符，前面对象没有length时，返回undefined
  // 需求：已登录，不能去登录页
  if (getToken()?.length > 0 && to.path === '/login') {
    // next(false) 中断当前导航，如果用户手动改变url地址，url会自动重置到from路由对应地址 // 阻止跳转
    // console.log(from)
    // 因此不用next(false) ，会导致后退按钮无效bug
    // 跳回首页
    next('/layout/home')
  } else {
    next()
  }
})

export default router
