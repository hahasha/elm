<template>
  <div class="shop-cart-sticky" v-show="visible">
    <shop-cart
      :selectedFoods = "selectedFoods"
      :deliveryPrice = "deliveryPrice"
      :minPrice = "minPrice"
      :fold = "fold"
      :sticky = true
      ref="shopCart"
    >
    </shop-cart>
  </div>
</template>

<script>
  import ShopCart from 'components/shop-cart/shop-cart'
  import popupMixins from '@/common/mixins/popup'

  export default {
    mixins: [popupMixins],
    name: 'shop-cart-sticky',
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
      list: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    methods: {
      drop(target) {
        this.$refs.shopCart.drop(target)
      }
    },
    components: {
      ShopCart
    }
  }
</script>

<style lang="stylus" scoped>
  .shop-cart-sticky
    position: absolute
    left: 0
    bottom: 0
    z-index: 999
    width: 100%
    height: 48px
</style>
