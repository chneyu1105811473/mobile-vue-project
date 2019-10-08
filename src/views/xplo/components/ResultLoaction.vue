<template>
    <div class="locations">
      <template v-for="(item,index) in list">
        <div class="placeItem" :key="index" @click="goPlace(item.center)">
          <div class="icon"></div>
          <div class="name van-ellipsis">{{item.place_name}}</div>
        </div>
      </template>
      <!-- EmptyPage -->
      <empty-page v-if="isEmpty"/>
    </div>
</template>

<script>
import EmptyPage from '@/components/EmptyPage'

export default {
  name: 'ResultLoaction',
  components: {EmptyPage},
  props: {
    list: {
      default: function () {
        return []
      },
      type: Array
    }
  },
  data () {
    return {
      isEmpty: false
    }
  },
  watch: {
    list: {
      handler (val) {
        this.isEmpty = !(val.length)
      },
      immediate: true
    }
  },
  methods: {
    goPlace (obj) {
      this.$emit('select', obj)
    }
  }
}
</script>

<style lang="stylus" scoped>
.locations
    height 100%
    background-color rgba(255,255,255,.8)
    border-radius 0.24rem
.placeItem
    display flex
    align-items center
    padding 0.2rem
    box-sizing border-box
.icon
    min-width 0.4rem
    width 0.4rem
    height 0.4rem
    background url(../../../assets/img/icSpacecraft@2x.png) 0 0 no-repeat / contain
    margin-right 0.4rem
.name
    font-family SFUIDisplay-Medium
    color rgb(51,51,51)
    font-size 0.28rem
</style>
