<template>
    <div>
        <transition name="move">
            <div class="food" v-show="showFlag" ref="food">
                <div class="food-content">
                    <!--1.0 图片-->
                    <div class="image-header">
                        <img :src="food.image" alt="">
                        <div class="back" @click="hide">
                             <i class="icon-arrow_lift"></i>
                        </div>            
                    </div>
                    <!--2.0 内容详情-->
                    <div class="content">
                        <h1 class="title">{{food.name}}</h1>
                        <div class="detail">
                            <span class="sell-count">月售{{food.sellCount}}份</span>
                            <span class="rating">好评率{{food.rating}}%</span>
                        </div>
                        <div class="price">
                            <span class="now">￥{{food.oldPrice}}</span>
                            <span class="old" v-show="food.oldPrice">￥{{food.price}}</span>
                        </div>
                        <!--购物车增减按钮-->
                        <div class="cartcontrol-wrapper">
                            <cartcontrol :food="food"></cartcontrol>
                        </div>
                        <!--加入购物车按钮-->
                        <transition name="fade">
                            <div @click="addFirst($event)" class="buy" v-show="!food.count || food.count===0">加入购物车</div>
                        </transition>
                    </div>
                    <!--3.0 split组件-->
                    <split v-show="food.info"></split>
                    <!--4.0 商品介绍-->
                    <div class="info" v-show="food.info">
                        <h1 class="title">商品信息</h1>
                        <p class="text">{{food.info}}</p>
                    </div>
                    <!--5.0 split组件-->
                    <split></split>
                    <!--6.0 商品评价-->
                    <div class="rating">
                        <h1 class="title">商品评价</h1>
                        <!--6.1 评价选择组件-->
                        <ratingselect @select="selectRating" @toggle="toggleContent" :ratings="food.ratings" :selectType="selectTypeNum" :onlyContent="onlyContent" :desc="desc"></ratingselect>
                        <!--6.2 评价列表-->
                        <div class="rating-wrapper">
                            <ul v-show="food.ratings && food.ratings.length">
                                <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings" class="rating-item border-1px">
                                    <div class="user">
                                        <span class="name">{{rating.username}}</span>
                                        <img class="avatar" width="12" height="12" :src="rating.avatar">
                                    </div>
                                    <div class="time">{{rating.rateTime | formatDate}}</div>
                                    <p class="text">
                                        <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>
                                        {{rating.text}}
                                    </p>
                                </li>
                            </ul>
                            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div> 
</template>

<script>
    import BScroll from 'better-scroll'
    import cartcontrol from '../cartcontrol/cartcontrol.vue'
    import split from '../split/split.vue'
    import ratingselect from '../ratingselect/ratingselect.vue'
    import Vue from 'vue'
    import {formatDate} from '../../common/js/date.js'  // 引入日期方法

    // const POSITIVE = 0  // 正向评价为0
    // const NEGATIVE = 1  // 负向评价为1
    const ALL = 2   // 所有评价为2

    export default {
        data () {
            return {
               showFlag: false,
               selectTypeNum: ALL,
               onlyContent: false,
               desc: {
                   all: '全部',
                   positive: '推荐',
                   negative: '吐槽'
               }
            }
        },
        created () {
        },
        methods: {
            // 定义food详情页面显示或隐藏的方法
            show () {
                this.showFlag = true
                this.selectType = ALL   // 每一次进入商品详情页面都初始化，显示全部内容
                this.onlyContent = false // 进入商品页面初始化显示有内容的评价
                this.$nextTick(() => {  // 实例化better-scroll方法，使food详情页面可以滚动
                    if (!this.scroll) {
                        this.scroll = new BScroll(this.$refs.food, {
                            click: true
                        })
                    } else {
                        this.scroll.refresh()
                    }
                })
            },
            // 定义hide事件，点击返回按钮时，关闭food页面
            hide () {
                this.showFlag = false
            },
            // 点击加入购物车按钮，添加商品
            addFirst (event) {
                if (!event._constructed) {
                    return
                }
                Vue.set(this.food, 'count', 1)
                this.$emit('add', event.target) // 父子组件传值，在子组件触发
            },
            // ratingselect点击仅显示有内容的评价的时候，按钮字体图标变黑，重新初始化better-scroll
            toggleContent () {
                this.onlyContent = !this.onlyContent
                this.$nextTick(() => {
                    this.scroll.refresh()
                })
            },
            // 选中全部或者推荐或者吐槽按钮的时候，会把值传给food组件，否则即使点击了，active也不会激活，因为active激活和父组件传过去的值有关系。刷新页面
            selectRating (type) {
                this.selectTypeNum = type
                this.$nextTick(() => {
                    this.scroll.refresh()
                })
            },
            // 绑定函数，计算点击吐槽或推荐时，评论列表里面显示的内容
            needShow (type, text) {
                if (this.onlyContent && !text) {    // 只显示有内容的评价，而没有文本，返回false，v-show不显示
                    return false
                }
                if (this.selectTypeNum === ALL) {  // 选择的是类型是全部时
                    return true
                } else {    // 选择的是推荐或吐槽的时候，判断当前的这条评论的类型是否和选择的类型一致，一致就显示，不一致就不显示
                    return type === this.selectTypeNum
                }
            }
        },
        // 时间过滤器方法
        filters: {
            formatDate (time) {
                let date = new Date(time)   // 先转换成date类型的对象
                return formatDate(date, 'yyyy-MM-dd hh:mm')
            }
        },
        components: {
            cartcontrol,
            split,
            ratingselect
        },
        props: {
            food: {
                type: Object
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import '../../common/stylus/mixin.styl'
    .food
        position: fixed
        top: 0
        left: 0
        bottom: 48px
        z-index: 30 // 需要比购物车和购物车的弹层的z-index小
        width: 100%
        background-color: #fff
        transform: translate3d(0, 0, 0)
        &.move-enter-active, &.move-leave-active
            transition: all 0.2s linear
        &.move-enter, &.move-leave-active
            transform: translate3d(100%, 0, 0)  // 动画开始的位置，从右到左飞入
        .food-content
            .image-header
                position: relative
                width: 100%
                height: 0
                padding-top: 100%   // 让图片的宽高一致，保持同等比例
                img
                    position: absolute
                    top: 0
                    left: 0
                    width: 100%
                    height: 100%
                .back
                    position: absolute
                    top: 10px
                    left: 0
                    .icon-arrow_lift
                        display: block
                        padding: 10px
                        font-size: 20px
                        color: #fff
            .content
                position: relative
                padding: 18px
                .title
                    margin-bottom: 8px
                    font-size: 14px
                    font-weight: 700
                    line-height: 14px
                    color: rgb(7, 17, 27)
                .detail
                    margin-bottom: 18px
                    font-size: 10px
                    line-height: 10px
                    color: rgb(147, 153, 159)
                    .sell-count
                        margin-right: 12px
                .price
                    font-weight: 700
                    line-height: 24px
                    .now
                        margin-right: 8px
                        font-size: 14px
                        color: rgb(240, 20, 20)
                    .old
                        text-decoration: line-through
                        font-size: 10px
                        color: rgb(147, 153, 159)
                .cartcontrol-wrapper
                    position: absolute
                    right: 12px
                    bottom: 12px
                .buy
                    position: absolute
                    display: block
                    right: 18px
                    bottom: 18px
                    padding: 0 12px
                    height: 24px
                    line-height: 24px
                    box-sizing: border-box
                    z-index: 10
                    border-radius: 12px
                    font-size: 10px                
                    color: #fff
                    background-color: rgb(0, 160, 220)
                    opacity: 1
                    &.fade-enter-active, &.fade-leave-active
                        transition: all 0.2s
                    &.fade-enter, &.fade-leave-active
                        opacity: 0
                        z-index: -1 
            .info 
                padding: 18px
                .title
                    margin-bottom: 6px
                    font-size: 14px
                    line-height: 14px
                    color: rgb(7, 17, 27)
                .text
                    line-height: 24px
                    padding: 0 8px
                    font-size: 12px
                    color: rgb(77, 85, 93) 
            .rating
                padding-top: 18px
                .title
                    margin-left: 18px
                    font-size: 14px
                    line-height: 14px
                    color: rgb(7, 17, 27)
                .rating-wrapper
                    padding: 0 18px
                    .rating-item
                        position: relative
                        padding: 16px 0
                        border-1px(rgba(7, 17, 27, 0.1))
                        .user
                            position: absolute
                            right: 0
                            top: 16px
                            line-height: 12px
                            font-size: 0
                            .name
                                display: inline-block
                                margin-right: 6px
                                vertical-align: top
                                font-size: 10px
                                color: rgb(147, 153, 159)
                            .avatar
                                border-radius: 50%
                        .time
                            margin-bottom: 6px
                            line-height: 12px
                            font-size: 10px
                            color: rgb(147, 153, 159)
                        .text
                            line-height: 16px
                            font-size: 12px
                            color: rgb(7, 17, 27)
                            .icon-thumb_up, .icon-thumb_down
                                margin-right: 4px
                                line-height: 16px
                                font-size: 12px
                            .icon-thumb_up
                                color: rgb(0, 160, 220)
                            .icon-thumb_down
                                color: rgb(147, 153, 159)
                    .no-rating
                        padding: 16px 0
                        font-size: 12px
                        color: rgb(147, 153, 159)
</style>