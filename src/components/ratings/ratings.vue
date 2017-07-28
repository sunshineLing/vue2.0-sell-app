<template>
    <div class="ratings" ref="ratings">
        <div class="ratings-content">
            <!--1.0 评分概况-->
            <div class="overview">
                <div class="overview-left">
                    <h1 class="score">{{seller.score}}</h1>
                    <div class="title">综合评分</div>
                    <div class="rank">高于周边商家{{seller.rankRate}}%</div>
                </div>
                <div class="overview-right">
                    <div class="score-wrapper">
                        <span class="title">服务态度</span>
                        <star :size="36" :score="seller.serviceScore"></star>
                        <span class="score">{{seller.serviceScore}}</span>
                    </div>
                    <div class="score-wrapper">
                        <span class="title">商品评分</span>
                        <star :size="36" :score="seller.foodScore"></star>
                        <span class="score">{{seller.foodScore}}</span>
                    </div>
                    <div class="delivery-wrapper">
                        <span class="title">送达时间</span>
                        <span class="delivery">{{seller.deliveryTime}}分钟</span>
                    </div>
                </div>
            </div>
            <!--2.0 split组件-->
            <split></split>
            <!--3.0 ratingSelect组件-->
            <ratingSelect @toggle="toggleContent" @select="selectRating" :selectType="selectTypeNum" :onlyContent="onlyContent" :desc="desc" :ratings="ratings"></ratingSelect>
            <!--4.0 评价列表-->
            <div class="rating-wrapper">
                <ul>
                    <li v-for="rating in ratings" v-show="needShow(rating.rateType, rating.text)" class="rating-item border-1px">
                        <!--用户图像-->
                        <div class="avatar">
                            <img :src="rating.avatar" alt="" width="28" height="28">
                        </div>
                        <!-- 右边的评价内容-->
                        <div class="content">
                            <!--用户信息-->
                            <h1 class="name">{{rating.username}}</h1>
                            <!--评价星级-->
                            <div class="star-wrapper">
                                <star :size="24" :score="rating.score"></star>
                                <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}</span>
                            </div>
                            <!-- 评价内容-->
                            <p class="text">{{rating.text}}</p>
                            <!-- 推荐内容-->
                            <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                                <span class="icon-thumb_up"></span>
                                <span class="item" v-for="item in rating.recommend">{{item}}</span>
                            </div>
                            <!--发布时间-->
                            <div class="time">
                                {{rating.rateTime | formatDate}}
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import BScroll from 'better-scroll'
    import star from '../star/star.vue'
    import split from '../split/split.vue'
    import ratingSelect from '../ratingselect/ratingselect.vue'
    import {formatDate} from '../../common/js/date.js'  // 引入日期方法

    // const POSITIVE = 0  // 正向评价为0
    // const NEGATIVE = 1  // 负向评价为1
    const ALL = 2   // 所有评价为2
    const ERR_OK = 0

    export default {
        data () {
            return {
                ratings: [],
                selectTypeNum: ALL,
                onlyContent: false,
                desc: {
                    all: '全部',
                    positive: '满意',
                    negative: '不满意'
                }
            }
        },
        created () {
            this.getRatingsData()   // 组件被创建的时候获取ratings数据
        },
        methods: {
            getRatingsData () {
                const url = '/api/ratings'
                this.$http.get(url).then((res) => {
                    if (res.body.errno === ERR_OK) {
                        this.ratings = res.body.data
                        // ratings组件被创建，数据一获取到的时候就初始化bscroll
                        this.$nextTick(() => {
                            this.scroll = new BScroll(this.$refs.ratings, {
                                click: true
                            })
                        })
                    }
                })
            },
            // 筛选数据，根据返回值判断当前数据是否显示
            needShow (type, text) {
                if (this.onlyContent && !text) {
                    return false
                } else if (this.selectTypeNum === ALL) {
                    return true
                } else {
                    return this.selectTypeNum === type  // 判断当前项目的类型和被选择的项目是不是一样的，是的就显示，不是就不显示
                }
            },
            // 点击组件里面的只显示内容按钮时，触发只显示内容或全部显示事件，传值
            toggleContent () {
                this.onlyContent = !this.onlyContent
                // 数据更新，页面重新更新
                this.$nextTick(() => {
                    this.scroll.refresh()
                })
            },
            // 子组件点击全部、满意、不满意的按钮时，需要父组件里面的数据更新
            selectRating (type) {
                this.selectTypeNum = type
                this.$nextTick(() => {
                    this.scroll.refresh()
                })
            }
        },
        // 日期过滤方法
        filters: {
            formatDate (time) {
                let date = new Date(time)   // 先转换成date类型的对象
                return formatDate(date, 'yyyy-MM-dd hh:mm')
            }
        },
        components: {
            star,
            split,
            ratingSelect
        },
        props: {
            seller: {   // app.vue里面传递过来的
                type: Object
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import '../../common/stylus/mixin.styl'
    .ratings
        position: absolute
        top: 174px
        bottom: 0
        left: 0
        width: 100%
        overflow: hidden
        .overview
            display: flex
            padding: 18px 0
            .overview-left
                flex: 0 0 137px
                padding: 6px 0
                width: 137px
                border-right: 1px solid rgba(7, 17, 27, 0.1)
                text-align: center
                @media only screen and (max-width: 320px)
                    flex: 0 0 120px
                    width: 120px
                .score
                    margin-bottom: 6px
                    line-height: 28px
                    font-size: 24px
                    color: rgb(255, 153, 0)
                .title
                    margin-bottom: 8px
                    font-size: 12px
                    line-height: 18px
                    color: rgb(7, 17, 27)
                .rank
                    margin-bottom: 6px
                    font-size: 10px
                    line-height: 10px
                    color: rgb(7, 17, 27)
            .overview-right
                flex: 1
                padding: 8px 0 6px 24px
                @media only screen and (max-width: 320px)   // 仅仅当屏幕最大尺寸为320px时适用
                    padding-left: 6px 
                .score-wrapper
                    .star
                        &.star-36
                            margin: 0 6px
                .score-wrapper
                    margin-bottom: 8px
                    font-size: 0
                    .title
                        display: inline-block
                        line-height: 18px
                        vertical-align: top
                        font-size: 12px
                        color: rgb(7, 17, 27)
                    .star
                         display: inline-block
                         margin: 0 12px
                         vertical-align: top
                         .star-item
                            margin-right: 6px  // 调整星星之间的空袭
                    .score
                         display: inline-block
                         line-height: 18px
                         vertical-align: top
                         font-size: 12px
                         color: rgb(255, 153, 0)
                .delivery-wrapper
                    font-size: 12px
                    line-height: 18px
                    .title
                        color: rgb(7, 17, 27)
                    .delivery
                        margin-left: 10px
                        color: rgb(147, 153, 159)
        .rating-wrapper
            padding: 0 18px
            .rating-item
                display: flex
                padding: 18px 0
                border-1px(rgba(7, 17, 27, 0.1))
                .avatar
                    flex: 0 0 28px
                    width: 28px
                    margin-right: 12px
                    img
                        border-radius: 50%
                .content
                    position: relative
                    flex: 1
                    .name
                        margin-bottom: 4px
                        line-height: 12px
                        font-size: 10px
                        color: rgb(7, 17, 27)
                    .star-wrapper
                        margin-bottom: 6px
                        font-size: 0
                        .star
                            display: inline-block
                            margin-right: 6px
                            vertical-align: top
                        .delivery
                            display: inline-block
                            vertical-align: top
                            line-height: 12px
                            font-size: 10px
                            color: rgb(147, 153, 159)
                    .text
                        margin-bottom: 8px
                        line-height: 18px
                        color: rgb(7, 17, 27)
                        font-size: 12px
                    .recommend
                        line-height: 16px
                        font-size: 0
                        .icon-thumb_up, .item
                            display: inline-block
                            margin: 0 8px 4px 0
                            font-size: 9px
                        .icon-thumb_up
                            color: rgb(0, 160, 220)
                        .item
                            padding: 0 6px
                            border: 1px solid rgba(7, 17, 27, 0.1)
                            border-radius: 1px
                            color: rgb(147, 153, 159)
                            background: #fff
                    .time
                        position: absolute
                        top: 0
                        right: 0
                        line-height: 0
                        font-size: 10px
                        color: rgb(147, 153, 159)
</style>