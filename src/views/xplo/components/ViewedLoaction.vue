<template>
    <div class="locations">
      <list
      v-model="loading"
      :finished="finished"
      @load="onload"
      >
        <template slot="loading">
          <lottie :height="50"  :width="100" :options="defaultOptions2"/>
        </template>
        <div class="locationItem" v-for="(item,index) in list" :key="index" @click="goPlace([item.longitude,item.latitude])">
          <div class="footprint"></div>
          <div class="location">
            <div class="name">{{item.locationShort|locationFormate}}</div>
            <div class="time">{{item.operationTime|createTime}}</div>
          </div>
        </div>
      </list>
      <!-- EmptyPage -->
      <empty-page v-if="isEmpty"/>
    </div>
</template>

<script>
import {List} from 'vant'
import Lottie from 'vue-lottie'
import EmptyPage from '@/components/EmptyPage'
import animationData2 from '@/assets/data/refresh02.json'

export default {
  name: 'ViewedLoaction',
  components: {Lottie, List, EmptyPage},
  props: {
    list: {
      default: function () {
        return []
      },
      type: Array
    },
    finished: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      loading: false,
      isEmpty: false,
      defaultOptions2: {
        animationData: animationData2
      }
    }
  },
  watch: {
    list: {
      handler (val) {
        this.loading = false
        this.isEmpty = !(val.length)
      },
      immediate: true
    }
  },
  methods: {
    onload () {
      this.$emit('load', true)
    },
    goPlace (obj) {
      this.$emit('select', obj)
    }
  }
}
</script>

<style lang="stylus" scoped>
.locations
    min-height 100%
    background-color rgba(255,255,255,.8)
    border-radius 0.24rem
.locationItem
    font-family SFUIDisplay-Medium
    padding 0.2rem
    display flex
.location
    margin-left 0.4rem
.location .name
    color rgb(51,51,51)
    font-size 0.28rem
    margin-bottom 0.2rem
.location .time
    font-size 0.24rem
    color rgb(153,153,153)

.footprint
    position relative
    min-width 0.4rem
    width 0.4rem
    height 0.4rem
    background url(../../../assets/img/icFootsprint@2x.png) 0 0 no-repeat / contain
.footprint::after
    position: absolute;
    top: 140%;
    left 0.1rem
    content ''
    height 0.3rem
    width 0
    border 0.02rem dashed rgb(204,204,204)
</style>
