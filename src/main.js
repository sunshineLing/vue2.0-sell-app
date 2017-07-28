// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// 引入路由模块
import VueRouter from 'vue-router'
// 导入htttp请求模块
import VueResource from 'vue-resource'

// 导入Vue项目要渲染的第一个页面的文件
import App from './App.vue'

// 使用基于Vue的第三方包
Vue.use(VueRouter)  // 使用路由
Vue.use(VueResource)  // 使用http模块

Vue.config.productionTip = false

// 统一导入css
import './common/stylus/index.styl'

// 路由的设置
// 导入组件
import seller from './components/seller/seller.vue'
import goods from './components/goods/goods.vue'
import ratings from './components/ratings/ratings.vue'

// 创建并设置路由
const router = new VueRouter({
  routes: [
    {path: '/', redirect: '/goods'}, // 重定向到sell
    // {path: '/', component: goods},
    {path: '/seller', component: seller},
    {path: '/ratings', component: ratings},
    {path: '/goods', component: goods}
  ],
  linkActiveClass: 'active'
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  router: router,
  components: { App }
})

// 页面初始化使就进入goods路径
// router.push({path: '/goods'})