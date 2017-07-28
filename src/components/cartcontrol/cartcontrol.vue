<template>
  <div class="cartcontrol">
      <!--给减少按钮增加平移动画-->
      <transition name="move">
        <div v-show="food.count" class="cart-decrease" @click.stop.prevent="decreaseCart($event)">
            <span class="inner icon-remove_circle_outline"></span>
        </div>
      </transition> 
      <div v-show="food.count" class="cart-count">{{food.count}}</div>
      <div class="cart-add icon-add_circle" @click.stop.prevent="addCart($event)"></div>
  </div>
</template>

<script>
    import Vue from 'vue'
    export default {
        created () {
        },
        methods: {
            addCart (event) {   // 如果不是自己派生的点击事件
                if (!event._constructed) {
                    return
                }
                if (!this.food.count) {
                    Vue.set(this.food, 'count', 1)  // 为food新增一个属性
                } else {
                    this.food.count ++
                }
                this.$emit('add', event.target) // 父子组件传值，在子组件触发
            },
            decreaseCart (event) {
                if (!event._constructed) {
                    return
                }
                if (this.food.count) {
                    this.food.count --
                }
            }
        },
        props: {
            food: {
                type: Object
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
   .cartcontrol
        font-size: 0
        .cart-decrease
            display: inline-block
            padding: 6px
            opacity: 1
            transform: translate3d(0, 0, 0) // 动画结束的位置，3d开启硬件加速
            .inner
                display: inline-block
                line-height: 24px
                font-size: 24px
                color: rgb(0, 160, 220)
                transition: all 0.4s linear
            &.move-enter-active, &.move-leave-active
                transition: all 0.4s linear //动画开始和结束时的状态
            &.move-enter, &.move-leave-active
                opacity: 0  // 进入和离开动画的时候
                transform: translate3d(24px, 0, 0)  // 从24px的地方滚动过来
                .inner
                    transform: rotate(180deg)
        .cart-count
            display: inline-block
            vertical-align: top
            width: 12px
            padding: 6px
            line-height: 24px
            text-align: center
            font-size: 10px
            color: rgb(147, 153, 159)
        .cart-add
            display: inline-block
            padding: 6px
            line-height: 24px
            font-size: 24px
            color: rgb(0, 160, 220)
</style>