<template>
  <div id="app">
    <v-header></v-header>
    <router-view />
  </div>
</template>

<script>
import VHeader from '@/components/v-header/v-header'
export default {
  created(){
    this._getSeller()
  },
  methods: {
    _getSeller() {

    }
  },
  components: {
    VHeader
  }
}
</script>

<style lang="stylus" scoped>
</style>
