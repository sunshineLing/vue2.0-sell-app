<template>
    <div>
        <div class="goods">
            <div class="menu-wrapper" ref="menuWrapper">
                <ul class="menu-list">
                    <li v-for="(item,index) in goods" :key="index" class="menu-item" :class="{'current':currentIndex === index}" @click="selectMenu(index,$event)">
                        <span class="text border-1px"><span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}</span>
                    </li>
                </ul>
            </div>
            <div class="foods-wrapper" ref="foodsWrapper">
                <ul>
                    <li v-for="item in goods" class="food-list" ref="foodList">
                        <h1 class="title">{{item.name}}</h1>
                        <ul>
                            <li v-for="food in item.foods" class="food-item border-1px" @click="selectFood(food, $event)">
                                <div class="icon">
                                    <img width="57" height="57" :src="food.icon" alt="">
                                </div>
                                <div class="content">
                                    <h2 class="name">{{food.name}}</h2>
                                    <p class="desc">{{food.description}}</p>
                                    <div class="extra">
                                        <span>月售{{food.sellCount}}份</span>
                                        <span>好评率{{food.rating}}%</span>
                                    </div>
                                    <div class="price">
                                        <span class="now"><i class="currency">￥</i>{{food.oldPrice}}</span>
                                        <span class="old" v-show="food.oldPrice"><i class="currency">￥</i>{{food.price}}</span>
                                    </div>
                                    <div class="cartcontrol-warpper">
                                        <cartcontrol @add="addFood" :food="food"></cartcontrol>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            <shopcart :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice" ref="shopcart"></shopcart>
        </div>
        <food :food="selectedFood" ref="foodEl" @add="addFood"></food>
    </div>
</template>

<script>
    import BScroll from 'better-scroll'
    import shopcart from '../shopcart/shopcart.vue'
    import cartcontrol from '../cartcontrol/cartcontrol.vue'
    import food from '../food/food.vue'
    const ERR_OK = 0
    export default {
        data () {
            return {
                goods: [],
                listHeight: [],  // 存储饰品栏每一个区块的高度
                scrollY: 0,
                selectedFood: {}  // 选中的food
            }
        },
        created () {
            this.getGoodsData()
            this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special']
        },
        methods: {
            getGoodsData () {
                this.$http.get('/api/goods').then((res) => {
                  if (res.body.errno === ERR_OK) {
                    this.goods = res.body.data
                    this.$nextTick(() => {
                        this._initScroll()  // 初始化Scroll插件
                        this._calculateHeight() // 初始化插件的时候计算高度
                    })
                  }
                })
            },
            selectMenu (index, event) {
                if (!event._constructed) {  // 阻止pc端的默认点击事件，只是用自己派发的
                    return
                }
                let foodList = this.$refs.foodList
                let el = foodList[index]
                this.foodsScroll.scrollToElement(el, 300)
            },
            // 选中food,因为要进入food的详情，所以要把被点击的这个food取到，通过事件传递过来
            selectFood (food, event) {
                if (!event._constructed) {
                    return
                }
                this.selectedFood = food
                // 点击food元素的时候，获取到子组件food元素，并调用子组件里面的show方法
                this.$refs.foodEl.show()
            },
            _initScroll () {
                // 菜单栏下拉刷新
                this.meunScroll = new BScroll(this.$refs.menuWrapper, {
                    click: true // 因为bscroll的原理就是监听touch事件，阻止掉默认的点击事件，需要更改参数
                })
                // 食品区块下拉刷新
                this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
                    click: true,
                    probeType: 3    // 滚动的时候试试派发scroll事件，检测实时滚动的位置
                })

                // 滚动时，实时检测位置
                this.foodsScroll.on('scroll', (pos) => {
                    this.scrollY = Math.abs(Math.round(pos.y))  // pos.y是一个负值
                })
            },
            _calculateHeight () {
                let foodList = this.$refs.foodList
                let height = 0
                this.listHeight.push(height)
                // 遍历所有区块的高度，存入高度数组
                for (var i = 0; i < foodList.length; i++) {
                    let item = foodList[i]
                    height += item.clientHeight // 每一个区块距离视窗的高度加上上一个区块自身的高度
                    this.listHeight.push(height)
                }
            },
            // 接收cartcontrol里面传递过来的事件对象
            addFood (target) {
                this._drop(target)
            },
            _drop (target) {
                // 体验优化，异步执行下落动画
                this.$nextTick(() => {
                    this.$refs.shopcart.drop(target)
                })
            }
        },
        computed: {
            currentIndex () {   // 计算当前左前菜单的索应位置
                for (let i = 0; i < this.listHeight.length; i++) {
                    let height1 = this.listHeight[i]
                    let height2 = this.listHeight[i + 1]
                    if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
                        return i    // 判断如果落在第一个的高度和第二个的高度之间，则应该落在第一个区块里面
                    }
                }
                return 0
            },
            selectFoods () {    // 找到所有被选择的food
                let foods = []
                this.goods.forEach((good) => {
                    good.foods.forEach((food) => {
                        if (food.count) {
                            foods.push(food)
                        }
                    })
                })
                return foods
            }
        },
        components: {
            shopcart,
            cartcontrol,
            food
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
    .goods
        display: flex
        position: absolute
        top: 175px
        bottom: 46px
        width: 100%
        overflow: hidden
        .menu-wrapper
            flex: 0 0 80px
            width: 80px
            background-color: #f3f5f7
            .menu-list
                    margin: 0
                    .menu-item
                        display: table
                        padding: 0 12px
                        width: 56px
                        height: 54px
                        line-height: 14px
                        &.current
                            position: relative
                            z-index: 10
                            font-weight: 700
                            background-color: #fff
                            margin-top: -1px
                            .text
                                border-none()
                        .icon
                            display: inline-block
                            margin-right: 4px
                            vertical-align: middle
                            width: 12px
                            height: 12px
                            background-size: 12px 12px
                            background-repeat: no-repeat
                            &.decrease
                                bg-image('decrease_3')
                            &.discount
                                bg-image('discount_3')
                            &.guarantee
                                bg-image('guarantee_3')
                            &.invoice
                                bg-image('invoice_3')
                            &.special
                                bg-image('special_3')
                        .text
                            display: table-cell
                            width: 56px 
                            vertical-align: middle
                            border-1px(rgba(7, 17, 21, 0.1))
                            font-size: 12px   
        .foods-wrapper
            flex: 1
            .food-list
                .title 
                    padding-left: 14px
                    height: 26px
                    font-size: 12px
                    line-height: 26px
                    color: rgb(147, 153, 159)
                    border-left: 2px solid #d9dde1
                    background-color: #f3f5f7
                .food-item
                    display: flex
                    padding: 18px
                    border-1px(rgba(7, 17, 27, 0.1))  
                    &:last-child
                        border-none()
                    .icon
                        flex: 0 0 57px
                        margin-right: 10px
                    .content
                        position: relative
                        flex: 1                    
                        .name
                            margin: 2px 0 8px 0
                            font-size: 14px
                            line-height: 14px
                            color: rgb(7, 17, 27)
                        .desc
                            margin-bottom: 8px
                            font-size: 10px
                            line-height: 10px
                            color: rgb(147, 153, 159)
                        .extra
                            margin-bottom: 8px
                            span
                                font-size: 10px
                                line-height: 10px
                                color: rgb(147, 153, 159)
                                &:last-child
                                    margin-left: 12px 
                        .price
                            .now
                                font-size: 14px
                                font-weight: 700
                                color: rgb(240, 20, 20)
                                line-height: 24px
                                .currency
                                    font-size: 10px
                                    font-weight: normal
                                    font-style: normal
                            .old
                                text-decoration: line-through
                                font-size: 10px
                                font-weight: 700
                                color: rgb(147, 153, 159)
                                .currency
                                    font-size: 10px
                                    font-weight: normal
                                    font-style: normal
                        .cartcontrol-warpper
                            position: absolute
                            right: 0
                            bottom: -5px            
</style>