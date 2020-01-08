<template>
    <div class="tab">
        <cube-tab-bar
          :data="tabs"
          v-model="selectedLabel"
          :show-slider="true"
          :useTransition="false"
          ref="tabBar"
          class="border-bottom-1px"
        >
            <cube-tab
              v-for="(item, index) in tabs"
              :key="index"
              :label="item.label"
            ></cube-tab>
        </cube-tab-bar>
        <div class="slide-wrapper">
            <cube-slide
              :data="tabs"
              :loop="false"
              :auto-play="false"
              :showDots="false"
              :initialIndex="index"
              ref="slide"
              @scroll="onScroll"
              @change="onChange"
            >
                <cube-slide-item v-for="(item, index) in tabs" :key="index">
                    <component ref="component" :is="item.component" :data="item.data"></component>
                </cube-slide-item>
            </cube-slide>
        </div>
    </div>
</template>

<script>
export default {
  name: 'tab',
  data () {
    return {
      index: this.initialIndex
    }
  },
  props: {
    tabs: {
      type: Array,
      default () {
        return []
      }
    },
    initialIndex: {
      type: Number,
      default () {
        return 0
      }
    }
  },
  computed: {
    selectedLabel: {
      get () {
        return this.tabs[this.index].label
      },
      set (newVal) {
        this.index = this.tabs.findIndex((item) => {
          return item.label === newVal
        })
      }
    }
  },
  methods: {
    onScroll (pos) {
    //   const tabBarWidth = this.$refs.tabBar.$el.clientWidth
    //   const slideWidth = this.$refs.slide.slide.scrollerWidth
    //   const transform = -pos.x / slideWidth * tabBarWidth
    //   this.$refs.tabBar.setSliderTransform(transform)
    },
    onChange (currentIndex) {
      this.index = currentIndex
    //   const instance = this.$refs.component[currentIndex]
    //   if (instance && instance.fetch) {
    //     instance.fetch()
    //   }
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .tab
    display: flex
    flex-direction: column
    height: 100%
    >>> .cube-tab
      padding: 10px 0
    .slide-wrapper
      flex: 1
      overflow: hidden
</style>
