// vant注册
import Vue from 'vue'
import {
  NavBar, Form, Image as VanImage, Field, Button, Tabbar, TabbarItem, Icon, Tab, Tabs, Cell, List, PullRefresh,
  ActionSheet, Popup, Badge, Row, Col, Search, Divider, Tag, CellGroup, Dialog, DatetimePicker, Loading, Lazyload
} from 'vant' // 引入vant组件

Vue.use(Lazyload, {
  preLoad: 0.8, // 屏幕高度范围0-1
  error: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2F7374131f156b044cbfa811b9709cdd32586afb8d3a5c-vlAgpg_fw658&refer=http%3A%2F%2Fhbimg.b0.upaiyun.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1656557583&t=f3cbc00bc310f0974f913861089cb1b5'
})
Vue.use(Loading)
Vue.use(DatetimePicker)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(CellGroup)
Vue.use(Divider)
Vue.use(VanImage)
Vue.use(Search)
Vue.use(Badge)
Vue.use(Row)
Vue.use(Col)
Vue.use(Popup)
Vue.use(ActionSheet)
Vue.use(PullRefresh)
Vue.use(List)
Vue.use(Cell)
Vue.use(Tab)
Vue.use(Tabs)
Vue.use(Icon)
Vue.use(Tabbar)
Vue.use(TabbarItem)
Vue.use(Button)
Vue.use(Form)
Vue.use(Field)
Vue.use(NavBar)
