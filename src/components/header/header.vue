<template>
    <div class="header">
        <div class="content-wrapper">
            <div class="avatar">
                <img width="64" height="64" :src="seller.avatar" alt="">
            </div>
            <div class="content">
                <div class="title">
                    <span class="brand"></span>
                    <span class="name">{{seller.name}}</span>
                </div>
                <div class="description">
                    {{seller.description}}/{{seller.deliveryTime}}分钟送达
                </div>
                <div v-if="seller.supports" class="support">
                    <span class="icon" :class="classMap[seller.supports[0].type]"></span>    
                    <span class="text">{{seller.supports[0].description}}</span>
                </div>
            </div>
            <div v-if="seller.supports" class="support-count" @click="showDetail">
                <span class="count">{{seller.supports.length}}个</span>
                <i class="icon-keyboard_arrow_right"></i>
            </div>
        </div>
        <div class="bulletin-wrapper" @click="showDetail">
            <span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
            <i class="icon-keyboard_arrow_right"></i>
        </div>
        <div class="background">
            <img :src="seller.avatar" alt="">
        </div>
        <transition name="fade">
            <div v-show="detailShow" class="detail">
                <div class="detail-wrapper clearfix">
                    <div class="detail-main">
                        <h1 class="name">{{seller.name}}</h1>
                        <div class="star-wrapper">
                            <star :size="48" :score="seller.score"></star>
                        </div> 
                        <div class="title">
                            <div class="line"></div>
                            <div class="text">优惠信息</div>
                            <div class="line"></div>
                        </div>
                        <ul v-if="seller.supports" class="supports">                    <li v-for="(item,index) in seller.supports" :key="index" class="support-item">
                                <span class="icon" :class="classMap[seller.supports[index].type]"></span>
                                <span class="text">{{seller.supports[index].description}}</span>
                            </li>
                        </ul>
                        <div class="title">
                            <div class="line"></div>
                            <div class="text">商家公告</div>
                            <div class="line"></div>
                        </div> 
                        <div class="bulletin">
                            <p class="content">{{seller.bulletin}}</p>
                        </div>     
                    </div>
                </div>
                <div class="detail-close" @click="hideDetail">
                    <i class="icon-close"></i>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import star from '../star/star.vue' // 引用star组件
export default {
    data () {
        return {
            detailShow: false
        }
    },
    created () {
        this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special']
    },
    methods: {
        // 点击>按钮或公告栏，弹出浮层
        showDetail () {
            this.detailShow = true
        },
        hideDetail () {
            this.detailShow = false
        }
    },
    components: {
        star
    },
    props: {
        seller: {
            type: Object
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixin.styl'
    .header
        position: relative
        color: #fff
        background-color: rgba(7, 17, 27, 0.5)
        overflow: hidden
        .content-wrapper
            position: relative
            padding: 24px 12px 18px 24px
            font-size: 0
            .avatar
                display: inline-block
                vertical-align: top
                img 
                    border-radius: 2px
            .content
                display: inline-block
                margin-left: 16px
                font-size: 14px
                .title
                    margin: 2px 0 8px 0
                    .brand
                        display: inline-block
                        vertical-align: top
                        width: 30px
                        height: 18px
                        bg-image('brand')
                        background-repeat: no-repeat
                        background-size: 30px 18px
                    .name
                        margin-left: 6px
                        font-size: 16px
                        font-weight: bold
                        line-height: 18px
                .description
                    margin-bottom: 10px
                    font-size: 12px
                    line-height: 12px
                .support
                    .icon
                        display: inline-block
                        vertical-align: middle
                        margin-right: 4px
                        width: 12px
                        height: 12px
                        background-size: 12px 12px 
                        background-repeat: no-repeat
                        &.decrease
                            bg-image('decrease_1')
                        &.discount
                            bg-image('discount_1')
                        &.guarantee
                            bg-image('guarantee_1')
                        &.invoice
                            bg-image('invoice_1')
                        &.special
                            bg-image('special_1')
                    .text
                        font-size: 10px
                        line-height: 12px
            .support-count 
                position: absolute
                right: 12px
                bottom: 18px
                padding: 0 8px
                height: 24px
                line-height: 24px
                text-align: center
                font-size: 10px
                border-radius: 14px
                background-color: rgba(0, 0, 0, 0.2)
                .icon-keyboard_arrow_right
                    vertical-align: middle
                    margin-left: 2px                 
        .bulletin-wrapper
            position: relative
            padding: 0 24px 0 12px
            height: 28px
            line-height: 28px
            background-color: rgba(7, 17, 27, 0.2)
            white-space: nowrap
            text-overflow: ellipsis
            overflow: hidden
            .bulletin-title
                display: inline-block
                vertical-align: top
                margin-top: 8px
                margin-right: 4px
                width: 22px
                height: 12px
                bg-image('bulletin')
                background-size: 22px 12px
                background-repeat: no-repeat
            .bulletin-text 
                vertical-align: top  
                font-size: 10px 
            .icon-keyboard_arrow_right 
                position: absolute
                right: 12px;
                top: 8px
                font-size: 10px  
        .background
            position: absolute
            top: 0
            left: 0
            width: 100%
            height: 100%
            filter: blur(10px)
            z-index: -1
            img 
                width: 100%
                height: 100%
        .fade-enter-active, .fade-leave-active
            transition: all 1s ease
        .fade-enter, .fade-leave-to
            opacity: 0
            background-color: rgba(7, 17, 27, 0)
        .detail
            position: fixed
            z-index: 100
            top: 0
            left: 0
            width: 100%
            height: 100%
            overflow: auto
            background-color: rgba(7, 17, 27, 0.8)
            backdrop-filter: blur(10px)
            // filter: blur(10px)
            .detail-wrapper 
                min-width: 100%
                height: 100%
                .detail-main
                    margin-top: 64px
                    padding-bottom: 64px
                    .name
                        font-size: 16px
                        font-weight: 700
                        line-height: 16px
                        text-align: center
                        color: #fff
                    .star-wrapper
                        margin-top: 16px
                        padding: 2px 0
                        text-align: center
                    .title 
                        display: flex
                        margin: 28px auto 24px auto
                        width: 80%
                        .line
                            flex: 1
                            position: relative
                            border-bottom: 1px solid rgba(255, 255, 255, 0.2)
                        .text 
                           padding: 0 12px
                           font-size:  14px
                           font-weight: 700
                    .supports
                        width: 80%
                        margin: 0 auto
                        .support-item
                            padding: 0 12px
                            margin-bottom: 12px
                            font-size: 0
                            &:last-child
                                margin-bottom: 0
                            .icon
                                display: inline-block
                                margin-right: 6px
                                width: 16px
                                height: 16px
                                vertical-align: top
                                background-size: 16px 16px
                                background-repeat: no-repeat
                                &.decrease
                                    bg-image('decrease_2')
                                &.discount
                                    bg-image('discount_2')
                                &.guarantee
                                    bg-image('guarantee_2')
                                &.invoice
                                    bg-image('invoice_2')
                                &.special
                                    bg-image('special_2')
                            .text
                                line-height: 16px
                                font-size: 12px
                                color: #fff
                    .bulletin
                        width: 80%
                        margin: 0 auto
                        padding: 0 12px
                        .content
                            font-size: 12px
                            line-height: 24px            
            .detail-close
                position: relative
                width: 32px
                height: 32px
                margin: -32px  auto 0 auto
                clear: both
                font-size: 32px               
</style>