<template>
  <div id="app">
    <!--1.0 头部-->
    <v-header :seller="seller"></v-header>
    <!--2.0 tab栏-->
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>       
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评价</router-link> 
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link> 
      </div>
    </div>
    <!--3.0 路由的出口-->
    <!--路由匹配的组件将渲染在这里-->
    <!--缓存组件-->
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import header from './components/header/header.vue'

const ERR_OK = 0

export default {
  name: 'app',
  data () {
    return {
      seller: {}
    }
  },
  created () {
    this.getSellerData()
  },
  methods: {
    getSellerData () {
      const url = '/api/seller'
      this.$http.get(url).then((res) => {
        if (res.body.errno === ERR_OK) {
          this.seller = res.body.data
          console.log(this.seller)
        }
      })
    }
  },
  components: {
    'v-header': header
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
// 引用1像素样式文件
@import './common/stylus/mixin.styl'
  #app
    .tab
      display: flex
      width: 100%
      height: 40px
      line-height: 40px
      border-1px(rgba(7, 17, 21, 0.1))
      .tab-item
        flex: 1
        text-align: center
        &>a
          display: block
          font-size: 14px
          text-decoration: none
          color: rgb(77, 85, 93)
          &.active
            color: rgb(240, 20, 20)
</style>

\n