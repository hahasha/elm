<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab-wrapper">
      <tab :tabs="tabs"></tab>
    </div>
  </div>
</template>

<script>
import VHeader from '@/components/v-header/v-header'
import Goods from '@/components/goods/goods'
import Ratings from '@/componnets/ratings/ratings'
import Seller from '@/components/seller/seller'
import Tab from '@/components/tab/tab'
import { getSeller } from '@/api/api'
export default {
  data () {
    return {
      seller: {}
    }
  },
  computed: {
    tabs () {
      return [
        {
          lable: '商品',
          value: goods,
          component: Goods,
          data: {
            seller: this.seller
          }
        },
        {
          lable: '评价',
          value: ratings,
          component: Ratings,
          data: {
            seller: this.seller
          },
        },
        {
          lable: '商家',
          value: seller,
          component: Seller,
          data: {
            seller: this.seller
          }
        }
      ]
    }
  },
  created () {
    this._getSeller()
  },
  methods: {
    _getSeller () {
      getSeller().then((res) => {
        this.seller = res
      })
    }
  },
  components: {
    VHeader,
    Goods,
    Ratings,
    Seller,
    Tab
  }
}
</script>

<style lang="stylus" scoped>
  #app
    .tab-wrapper
      position: fixed
      top: 136px
      left: 0
      right: 0
      bottom: 0
</style>
