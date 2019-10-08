<template>
  <div class="searchLocation">
    <div class="locationItem" v-for="(item,index) in list" :key="index" @click="recordLocation(item)">
      <div class="footprint iconfont">&#xe689;</div>
      <div class="location">
          <div class="text">{{item.text}}</div>
          <div class="placeName">{{item.place_name}}</div>
      </div>
    </div>
    <!-- EmptyPage -->
    <empty-page v-show="isEmpty"/>
  </div>
  <!-- </PullRefresh> -->
</template>

<script>
import EmptyPage from '@/components/EmptyPage'

export default {
  name: 'TrendingSearchLocation',
  components: {EmptyPage},
  props: {
    list: {
      default: function () {
        return []
      },
      type: Array
    }},
  computed: {
    isEmpty () {
      return !(this.list.length)
    }
  },
  methods: {
    recordLocation (item) {
      this.$store.commit('updateRecordLocation', {
        icon: '',
        location: item.place_name,
        locationShort: item.place_name,
        longitude: item.center[0],
        latitude: item.center[1] })
      this.$router.push('/xplo')
    }
  }

}
</script>

<style lang="stylus" scoped>
.searchLocation
  padding-bottom 1.2rem
  padding-bottom calc(1.2rem + constant(safe-area-inset-bottom))
  padding-bottom calc(1.2rem + env(safe-area-inset-bottom))
  box-sizing border-box

.locationItem
    font-family SFUIDisplay-Medium
    padding 0.2rem
    display flex
.location
    margin-left 0.1rem
.location .text
    font-size 0.28rem
    margin-bottom 0.2rem
.location .placeName
    font-size 0.24rem
    color rgb(153,153,153)
.footprint
    color rgb(26,140,253)
</style>
