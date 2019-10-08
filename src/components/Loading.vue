<template>
  <div class="loading">
    <div class="circle"/>
    <lottie :options="defaultOptions"/>
  </div>
</template>

<script>
import Lottie from 'vue-lottie'
import animationData from '@/assets/data/loading.json'

export default {
  name: 'Loading',
  components: {Lottie},
  data () {
    return {
      defaultOptions: {
        animationData: animationData
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.loading
  position fixed
  top 0
  left 0
  width 100%
  height 100%

.circle
  position absolute
  top 50%
  left 50%
  transform translate(-50%,-50%)
  width 1.6rem
  height 1.6rem
  background-color rgba(0,0,0,.9)
  border-radius 100%
</style>
