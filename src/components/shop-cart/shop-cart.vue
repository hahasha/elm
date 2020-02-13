<template>
  <div>
    <div class="shopcart">
      <div class="content" @click="toggleList">
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{'highlight':totalCount>0}">
              <i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
            </div>
            <div class="num" v-show="totalCount>0">
              <bubble :num="totalCount"></bubble>
            </div>
          </div>
          <div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}</div>
          <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
        </div>
        <div class="content-right">
          <div class="pay" :class="payClass" @click="pay">
            {{payDesc}}
          </div>
        </div>
      </div>
      <div class="ball-container">
        <div v-for="(ball, index) in balls" :key="index">
          <transition 
            @before-enter="beforeDrop"
            @enter="dropping"
            @after-enter="afterDrop"
          >
            <div class="ball" v-show="ball.isShow">
              <div class="inner inner-hook"></div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Bubble from '@/components/bubble/bubble'

const BALLS_LEN = 10
const innerClsHook = 'inner-hook'

function createBalls() {
  let balls = []
  for(let i = 0; i < BALLS_LEN; i++){
    const ball = {
      isShow : false
    }
    balls.push(ball)
  }
  return balls
}

export default {
  name: 'shop-cart',
  data() {
    return {
      balls: createBalls(),
      listFold: this.fold   // 因为不能直接修改props里面的值fold，因此赋值给data
    }
  },
  props: {
    selectedFoods: {
      type: Array,
      default() {
        return []
      }
    },
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    },
    fold: {
      type: Boolean,
      default: true
    },
    sticky: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    totalCount() {
      let count = 0
      this.selectedFoods.forEach(food => {
        count += food.count
      })
      return count
    },
    totalPrice() {
      let totalPrice = 0
      this.selectedFoods.forEach(food => {
        totalPrice += food.price * food.count
      })
      return totalPrice
    },
    payDesc() {
      let desc = ''
      if(this.totalPrice === 0) {
        desc = `¥${this.minPrice}元起送`
      } else if(this.totalPrice < this.minPrice) {
        desc = `还差¥${this.minPrice - this.totalPrice}元起送`
      } else {
        desc = '去结算'
      }
      return desc
    },
    payClass() {
      if(!this.totalPrice || this.totalPrice < this.minPrice) {
        return 'not-enough'
      } else {
        return 'enough'
      }
    }
  },
  created() {
    this.dropBalls = []
  },
  methods: {
    drop(el) {
      for(let i = 0; i < BALLS_LEN; i++) {
        const ball = this.balls[i]
        if(!ball.isShow) {
          ball.isShow = true   //当触发drop事件时修改小球的显示状态
          ball.el = el   //保存点击的dom元素的状态（用于获取点击的位置）
          this.dropBalls.push(ball)    //将小球放入即将飞入购物车的dropBalls数组
          return   //终止循环，即每次触发drop事件仅从购物车隐藏的小球池中拿出一个放入等待执行动画的dropBalls数组中
        }
      }
    },
    beforeDrop(el) {
      const ball = this.dropBalls[this.dropBalls.length - 1]
      const rect = ball.el.getBoundingClientRect()
      const x = rect.left - 32
      const y = -(window.innerHeight - rect.top - 22)
      el.style.display = ''  //显示隐藏的小球
      el.style.transform = el.style.webkitTransform = `translate3d(0,${y}px,0)`
      const inner = el.getElementsByClassName(innerClsHook)[0]
      inner.style.transform = inner.style.webkitTransform = `translate3d(${x}px,0,0)`
    },
    dropping(el, done) {
      this._reflow = document.body.offsetHeight  //触发回流重绘
      el.style.transform = el.style.webkitTransform = `translate3d(0,0,0)`
      const inner = el.getElementsByClassName(innerClsHook)[0]
      inner.style.transform = inner.style.webkitTransform = `translate3d(0,0,0)`
      /**
       *  enter: function (el, done) {
       *  // ...
       *   done()
       *  },
       * 当只用 JavaScript 过渡的时候，在 enter 和 leave 中必须使用 done 进行回调。
       * 否则，它们将被同步调用，过渡会立即完成。
       */
      el.addEventListener('transitionend', done)  
    },
    afterDrop(el) {
      const ball = this.dropBalls.shift()
      if(ball) {
        ball.isShow = false
        el.style.display = 'none'   // 如果你不主动设置的话，Vue的动画钩子会在结束后把它设置为 none (会出现延迟消失的情况)
      }
    },
    toggleList() {
      if(this.listFold) {  // 如果购物车列表为fold状态
        if(!this.totalCount) {
          return
        }
        this.listFold = false
        this._showShopCartList()
        this._showShopCartSticky()
      } else {
        // this.listFold = true
        this._hideShopCartList()
      }
    },
    _showShopCartList() {
      // const instance = this.$createAaBb(config, [renderFn, single]) 
      // 缓存组件实例 this.shopCartListComp = this.shopCartListComp || ……
      this.shopCartListComp = this.shopCartListComp || this.$createShopCartList({   
        $props: {
          selectedFoods : 'selectedFoods'  //字符串形式才能实现响应式
        },
        $events: {
          hide: () => {
            this.listFold = true
          },
          leave: () => {
            this._hideShopCartSticky()
          },
          add: (target) => {
            this.shopCartStickyComp.drop(target)
          }
        }
      })
      this.shopCartListComp.show()
    },
    _hideShopCartList() {
      const comp = this.sticky ? this.$parent.list : this.shopCartListComp
      comp.hide()
    },
    _showShopCartSticky() {
      this.shopCartStickyComp = this.shopCartStickyComp || this.$createShopCartSticky({
        $props: {
          selectedFoods: 'selectedFoods',
          deliveryPrice: 'deliveryPrice',
          minPrice: 'minPrice',
          fold: 'listFold',
          list: this.shopCartListComp
        }
      })
      this.shopCartStickyComp.show()
    },
    _hideShopCartSticky() {
      this.shopCartStickyComp.hide()
    },
    pay(e) {
      if(this.totalPrice < this.minPrice) {
        return 
      }
      this.$createDialog({
        title: '支付',
        content: `您一共需要支付${this.totalPrice}元`
      }).show()
      e.stopPropagation()
    }
  },
  components: {
    Bubble
  },
  watch: {
    fold(newVal) {
      this.listFold = newVal
    },
    totalCount(newVal) {
      if(!this.fold && newVal === 0) {
        this._hideShopCartList()
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/mixin"
  @import "~common/stylus/variable"

  .shopcart
    height: 100%
    .content
      display: flex
      background: $color-background
      font-size: 0
      color: $color-light-grey
      .content-left
        flex: 1
        .logo-wrapper
          display: inline-block
          vertical-align: top
          position: relative
          top: -10px
          margin: 0 12px
          padding: 6px
          width: 56px
          height: 56px
          box-sizing: border-box
          border-radius: 50%
          background: $color-background
          .logo
            width: 100%
            height: 100%
            border-radius: 50%
            text-align: center
            background: $color-dark-grey
            &.highlight
              background: $color-blue
            .icon-shopping_cart
              line-height: 44px
              font-size: $fontsize-large-xxx
              color: $color-light-grey
              &.highlight
                color: $color-white
          .num
            position: absolute
            top: 0
            right: 0
        .price
          display: inline-block
          vertical-align: top
          margin-top: 12px
          line-height: 24px
          padding-right: 12px
          box-sizing: border-box
          border-right: 1px solid rgba(255, 255, 255, 0.1)
          font-weight: 700
          font-size: $fontsize-large
          &.highlight
            color: $color-white
        .desc
          display: inline-block
          vertical-align: top
          margin: 12px 0 0 12px
          line-height: 24px
          font-size: $fontsize-small-s
      .content-right
        flex: 0 0 105px
        width: 105px
        .pay
          height: 48px
          line-height: 48px
          text-align: center
          font-weight: 700
          font-size: $fontsize-small
          &.not-enough
            background: $color-dark-grey
          &.enough
            background: $color-green
            color: $color-white
    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 200
        transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background: $color-blue
          transition: all 0.4s linear
</style>
