<template>
    <div class="star" :class="starType">
        <span v-for="(itemClass,index) in itemClasses" key="index" :class="itemClass" class="star-item"></span>
    </div>
</template>

<script>
    const LENGTH = 5
    const CLS_ON = 'on'
    const CLS_OFF = 'off'
    const CLS_HALF = 'half'

    export default {
        props: {
            size: {   // 接收24/36类的尺寸
                type: Number
            },
            score: {
                type: Number
            }
        },
        computed: {
            starType () {
                return 'star-' + this.size
            },
            itemClasses () {    // itemClasses通过计算属性动态绑定
                let result = []
                let score = Math.floor(this.score * 2) / 2  // 将分数转化为整数4分/4.5分/5分
                let hasDecimal = score % 1 !== 0  // 判断是否是小数
                let integer = Math.floor(score) // 对分数取整，
                for (let i = 0; i < integer; i++) {
                    result.push(CLS_ON)
                }
                if (hasDecimal) {
                    result.push(CLS_HALF)   // 如果有小数的话，即4.5，那么半星只会是在完整的星星的后面
                }
                while (result.length < LENGTH) {    // 比如3.5这样长度不足5
                    result.push(CLS_OFF)
                }
                return result
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import '../../common/stylus/mixin.styl'
    .star
        font-size: 0
        .star-item
            display: inline-block
            background-repeat: no-repeat
        &.star-48
            .star-item
                width: 20px
                height: 20px
                margin-right: 22px
                background-size: 20px 20px
                &:last-child   // 最后一个没有
                    margin-right: 0
                &.on
                    bg-image('star48_on')
                &.half
                    bg-image('star48_half')
                &.off
                    bg-image('star48_off')
        &.star-36 
            .star-item
                width: 15px
                height: 15px
                margin-right: 16px
                background-size: 15px 15px
                &:last-child   // 最后一个没有
                    margin-right: 0
                &.on
                    bg-image('star36_on')
                &.half
                    bg-image('star36_half')
                &.off
                    bg-image('star36_off') 
        &.star-24 
            .star-item
                width: 10px
                height: 10px
                margin-right: 3px
                background-size: 10px 10px
                &:last-child   // 最后一个没有
                    margin-right: 0
                &.on
                    bg-image('star24_on')
                &.half
                    bg-image('star24_half')
                &.off
                    bg-image('star24_off')         
</style>