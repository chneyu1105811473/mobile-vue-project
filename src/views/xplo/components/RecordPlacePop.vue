<template>
    <div class="placePop">
      <div class="header">
        <div class="backBtn iconfont" @click="closePop">&#xe774;</div>
      </div>
      <div id="place"/>
      <div class="placeContainer">
          <div class="placeName">
              <div class="location iconfont">{{location.location|locationFormate}}</div>
              <div class="distance iconfont">{{distance}} KM away from me</div>
          </div>
          <div class="searchBtn" @click="goDestination">Go</div>
      </div>
    </div>
</template>

<script>
import mapboxgl from 'mapbox-gl'
import { mapState } from 'vuex'
import Distance from '@turf/distance'

export default {
  name: 'PlacePop',
  props: {
    location: {
      default: function () {
        return {
          icon: '',
          latitude: 22,
          longitude: 113,
          location: 'Peking Garden Restaurant 3/F',
          locationName: 'Peking Garden Restaurant',
          locationShort: 'Kowloon,Hong Kong'
        }
      },
      type: Object
    },
    addMarker: {
      default: false,
      type: Boolean
    }
  },
  mounted () {
    this.initMap()
  },
  computed: {
    ...mapState({
      API_URL: 'API_URL',
      accessToken: 'accessToken',
      recordLocation: 'recordLocation'
    }),
    lng () {
      return localStorage.getItem('lng') * 1 || 113
    },
    lat () {
      return localStorage.getItem('lat') * 1 || 22
    },
    distance () {
      const from = [this.lng, this.lat]
      const to = [this.location.longitude, this.location.latitude]
      return Distance(from, to, {units: 'kilometers'}).toFixed(2)
    }
  },
  watch: {
    addMarker (val) {
      if (val) {
        this.map.setCenter([this.location.longitude, this.location.latitude])
        this.setMarker()
      }
    }
  },
  methods: {
    initMap () {
      mapboxgl.accessToken = this.accessToken
      mapboxgl.config.API_URL = this.API_URL
      this.map = new mapboxgl.Map({
        container: 'place',
        style: 'mapbox://styles/devilhw/cjxobd5ws14jn1coueblhrvho',
        center: [this.location.longitude, this.location.latitude],
        zoom: 4,
        minZoom: 3,
        maxZoom: 15,
        dragRotate: false,
        scrollZoom: false,
        pitchWithRotate: false,
        doubleClickZoom: false,
        touchZoomRotate: false
      })
      // 阻止用户移动地图
      this.map.dragPan.disable()
      this.setMarker()
    },
    setMarker () {
      const recordMarker = document.getElementById('record_marker')
      if (recordMarker) {
        recordMarker.parentNode.removeChild(recordMarker)
      }
      // 创建div
      let el = document.createElement('div')
      el.id = 'record_marker'
      if (this.location.icon) {
        el.style.backgroundImage = `url(${this.location.icon})`
        el.style.backgroundSize = 'cover'
        el.style.width = '1rem'
        el.style.height = '1rem'
        el.style.borderRadius = '0.1rem'
      } else {
        el.className = 'iconfont'
        el.innerHTML = '&#xe689;'
        el.style.color = 'rgb(66,94,144)'
        el.style.fontSize = '30px'
      }
      // create the marker
      this.marker = new mapboxgl.Marker({element: el, draggable: false})
        .setLngLat([this.location.longitude, this.location.latitude])
        .addTo(this.map)
    },
    closePop () {
      this.$emit('close', true)
    },
    goDestination () {
      this.$emit('action', true)
    }
  }
}
</script>

<style lang="stylus" scoped>
.placePop
    position relative
    height 100%
    overflow: hidden;

.header
    position absolute
    top 0
    left 0
    width 100%
    height 1.3rem
    z-index 1
    background linear-gradient(rgba(38,38,45,0.6),rgba(39,42,48,0))
.backBtn
    position absolute
    top 0.2rem
    height 0.4rem
    font-size 0.64rem
    color #ffffff
    font-weight bold
    z-index 1

#place
    position absolute
    top 0
    left 0
    width 100%
    height 100%
    background-color #ccc
.placeContainer
    position absolute
    padding 0.6rem 0.4rem
    box-sizing border-box
    left 0
    bottom 0
    width 100%
    height 3rem
    background-color rgba(255,255,255,.3)
.placeContainer .placeName
    font-family SFUIDisplay-Regular
    color rgb(51,51,51)
    font-size 0.28rem
.placeName .location,.placeName .distance
    margin-bottom 0.8rem
    display flex
    align-items center
.location::before
    content '\e601'
    color rgb(51,51,51)
    font-size 0.48rem
    margin-right 0.3rem
.distance::before
    content '\e642'
    color rgb(51,51,51)
    font-size 0.48rem
    margin-right 0.3rem

.searchBtn
    position absolute
    right 0.48rem
    top 0
    transform translateY(-50%)
    display flex
    justify-content center
    align-items center
    font-family SFUIDisplay-Medium
    font-size  0.4rem
    color #fff
    width 1rem
    height 1rem
    border 0.04rem solid #ffffff
    background-color rgb(26,140,253)
    border-radius 100%
    overflow hidden
</style>
