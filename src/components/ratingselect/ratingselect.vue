<template>
    <div class="ratingselect">
        <!--1.0 评价的三个切换块-->
        <div class="rating-type" border-1px>
            <span @click="select(2,$event)" class="block positive" :class="{'active':selectType===2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
            <span @click="select(0,$event)" class="block positive" :class="{'active':selectType===0}">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
            <span @click="select(1,$event)" class="block negative" :class="{'active':selectType===1}">{{desc.negative}}<span class="count">{{negatives.length}}</span></span>
        </div>
        <!--2.0 评价内容选择区-->
        <div @click="toggleContent" class="switch" :class="{'on':onlyContent}">
            <span class="icon-check_circle"></span>
            <span class="text">只看有内容的评价</span>
        </div>
    </div>
</template>

<script>
    const POSITIVE = 0  // 正向评价为0
    const NEGATIVE = 1  // 负向评价为1
    const ALL = 2   // 所有评价为2

    export default {
        methods: {
            toggleContent (event) {
                if (!event._constructed) {
                    return
                }
                this.$emit('toggle')    // 向food父组件传值
            },
            select (type, $event) {
                if (!event._constructed) {
                    return
                }
                this.$emit('select', type)  // 传值到food组件，完成点击当前按钮激活状态
            }
        },
        computed: {
            // 计算正向评价的总条数，根据rateType来过滤
            positives () {
                return this.ratings.filter((rating) => {
                    return rating.rateType === POSITIVE
                })
            },
            // 计算负向评价的总条数
            negatives () {
                return this.ratings.filter((rating) => {
                    return rating.rateType === NEGATIVE
                })
            }
        },
        props: {
            ratings: {
                type: Array,
                default () {
                    return []
                }
            },
            selectType: {
                type: Number,
                default: ALL  // 默认选择的类型是2，显示全部内容
            },
            onlyContent: {  // 是否只显示有内容的评价
                type: Boolean,
                default: false
            },
            desc: {
                type: Object,
                default () {
                    return {
                        all: '全部',
                        positive: '推荐',
                        negative: '吐槽'
                    }
                }
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import '../../common/stylus/mixin.styl'
   .ratingselect
    .rating-type
      padding: 18px 0
      margin: 0 18px
      border-1px(rgba(7, 17, 27, 0.1))
      font-size: 0
      .block
        display: inline-block
        padding: 8px 12px
        margin-right: 8px
        line-height: 16px
        border-radius: 1px
        font-size: 12px
        color: rgb(77, 85, 93)
        &.active
          color: #fff
        .count
          margin-left: 2px
          font-size: 8px
        &.positive
          background: rgba(0, 160, 220, 0.2)
          &.active  // 被选中的时候
            background: rgb(0, 160, 220)
        &.negative
          background: rgba(77, 85, 93, 0.2)
          &.active
            background: rgb(77, 85, 93)
    .switch
      padding: 12px 18px
      line-height: 24px
      border-bottom: 1px solid rgba(7, 17, 27, 0.1)
      color: rgb(147, 153, 159)
      font-size: 0
      &.on
        .icon-check_circle
          color: #00c850
      .icon-check_circle
        display: inline-block
        vertical-align: top
        margin-right: 4px
        font-size: 24px
      .text
        display: inline-block
        vertical-align: top
        font-size: 12px
</style>