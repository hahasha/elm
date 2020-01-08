<template>
    <div class="goods">
        <cube-tab-bar v-model="selectedLabel" class="tab-bar">
            <cube-tab v-for="(item, index) in goods" :label="item.name" :key="index" class="tab-item"></cube-tab>
        </cube-tab-bar>
    </div>
</template>

<script>
import { getGoods } from '@/api/api'
export default {
  name: 'goods',
  data () {
    return {
      goods: [],
      selectedLabel: ''
    }
  },
  created () {
    this._getGoods()
  },
  methods: {
    _getGoods () {
      getGoods().then((res) => {
        this.goods = res
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.tab-bar
  position fixed
  top 0
  left 0
  display flex
  flex-direction column
  background #f3f5f7
  overflow-y auto
  .tab-item
    width 160px
    height 108px
    line-height 108px
</style>
