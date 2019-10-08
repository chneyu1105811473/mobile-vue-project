<template>
  <div class="xplo" :style="{'height':winHeight+'px'}">
    <div class="xploMap" :style="{'height':height+'%'}">
      <div id="map"/>
    </div>
    <!-- slide -->
    <map-zoom-slide @dragSlideEnd="dragSlideEndFn" :zoom="zoom"/>
    <!-- home btn -->
    <div class="goHome" @click="goHome">
      <img :src="homeIcon" alt="home">
    </div>
    <!-- chat room -->
    <popup
    :overlay="false"
    :style="{'height':isUp?max+'px': min+'px'}"
    position="bottom"
    round
    v-model="showChatRooms"
    ref="XploPop"
     >
      <xplo-pop
      :locationList="locationList"
      :recommendList="recommendList"
      :tagList="tagList"
      :finished="isFinished"
      :up="isUp"
      :country="country"
      @blur="onBlur"
      @start="touchstartFn"
      @move="touchmoveFn"
      @end="touchendFn"
      @change="changeCode"
      >
        <!-- slide icon -->
        <template slot="icon">
          <div class="slideIcon"></div>
        </template>
        <!-- history list -->
        <template slot="viewedLocations">
          <viewed-loaction
          :finished="finishedLoc"
          :list="viewedLoactions"
          @load="onload"
          @select="onSelect" />
        </template>
        <!-- result list -->
        <template slot="resultLocations">
          <result-loaction
          :list="resultLoactions"
          @select="onSelect"/>
        </template>
      </xplo-pop>
    </popup>

    <!-- place record -->
    <popup style="height:90%" position="bottom" round :overlay="false" v-model="showLocation" get-container="#app">
      <place-pop
      :location="recordLocationData"
      :addMarker="showLocation"
      @close="showLocation = false;showChatRooms = true;"
      @action="actionFn"
      />
    </popup>
    <!-- footer -->
    <footer-tab :currentTab="currentTab" :zIndex="2999" v-show="!showLocation"/>
  </div>
</template>

<script>
import {Popup, Toast} from 'vant'
import {
  getXploPost,
  getChatroomListWithCorner,
  getChatroomListWithRadius,
  getRecommendChatroomList,
  getRecommendTagsByCountrycode,
  searchLocation,
  recordLocation
} from '@/api/api'
import mapboxgl from 'mapbox-gl'
import FooterTab from '@/components/FooterTab'
import XploPop from './components/XploPop'
import MapZoomSlide from './components/MapZoomSlide'
import viewedLoaction from './components/ViewedLoaction'
import resultLoaction from './components/ResultLoaction'
import placePop from './components/RecordPlacePop'
import toLogin from '@/mixins/toLoginMix'
import userLocation from '@/mixins/userLocationMix'
import { mapGetters, mapState } from 'vuex'
import axios from 'axios'
import homeIcon from '@/assets/img/ic_home@2x.png'
import codeData from '@/assets/data/randomCountry'

export default {
  name: 'Xplo',
  components: {
    FooterTab,
    Popup,
    XploPop,
    MapZoomSlide,
    viewedLoaction,
    resultLoaction,
    placePop},
  mixins: [toLogin, userLocation],
  data () {
    return {
      page: 1,
      pageSize: 15,
      lng: 113,
      lat: 22,
      hasNext: true,
      finished: false,
      finishedLoc: false,
      currentTab: 2,
      height: 100,
      showChatRooms: true,
      showLocation: false,
      isUp: false,
      slideY: 0,
      isRefresh: false,
      isSeeMore: false,
      isFinished: false,
      postList: [], // 用来装附近post
      locationList: [], // 用来装chatroomlist
      recommendList: [], // 用来装chatroomlist
      viewedLoactions: [], // 用来装访问过的地址
      resultLoactions: [], // 用来装搜索mapbox的地址
      homeIcon: homeIcon,
      tagList: [],
      country: {},
      codeData: codeData,
      count: 0
    }
  },
  mounted () {
    this.initMap()
    this.searchLocationList()
  },
  computed: {
    ...mapGetters([
      'winHeight'
    ]),
    ...mapState({
      API_URL: 'API_URL',
      mapBaseUrl: 'mapBaseUrl',
      accessToken: 'accessToken',
      recordLocationData: 'recordLocationData'
    }),
    zoom: {
      get () {
        return this.$store.state.zoom
      },
      set (val) {
        this.$store.commit('updateZoom', val)
      }
    },
    max () {
      return window.innerHeight * 0.9 + this.slideY
    },
    min () {
      return window.innerHeight * 0.4 + this.slideY
    }
  },
  activated () {
    this.page = 1
    this.viewedLoactions = []
    this.searchLocationList()
    if (this.map) {
      this.map.resize()
    }
  },
  watch: {
    '$route' (newRouter, OldRouter) {
      const recordPlaces = ['PostDetail', 'TrendingSearch']
      if (recordPlaces.includes(OldRouter.name) && this.recordLocationData.location) {
        this.showLocation = true
        this.showChatRooms = false
      } else {
        this.showLocation = false
        this.showChatRooms = true
        this.$store.commit('updateRecordLocation', {location: '', icon: '', latitude: this.lat, longitude: this.lng})
      }
    },
    zoom (val) {
      this.map.setZoom(val)
    }
  },
  methods: {
    initMap () {
      mapboxgl.accessToken = this.accessToken
      mapboxgl.config.API_URL = this.API_URL
      this.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/devilhw/cjxobd5ws14jn1coueblhrvho',
        center: [this.lng, this.lat],
        zoom: this.zoom,
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
      this.map.on('click', () => {
        clearInterval(this.timer)
        clearTimeout(this.timeout)
        this.el.style.backgroundPosition = `0 0`
      })
      // 小熊家 marker(固定)
      this.setHomeMarker()
      // 小熊 marker(可移动)
      this.setMarker()
      // 获取tag
      this.getCountryCode()
      // 获取聊天室列表
      this.getChatRoomList()
    },
    setHomeMarker () {
      let el = document.createElement('div')
      el.id = 'homeMarker'
      let img = new Image()
      img.src = homeIcon
      img.style.cssText = 'width:40px;'
      el.appendChild(img)
      // create the marker
      new mapboxgl.Marker({element: el, draggable: false})
        .setLngLat([this.lng, this.lat])
        .addTo(this.map)
    },
    setMarker () {
      // 创建div
      if (!this.el) {
        this.el = document.createElement('div')
        this.el.id = 'marker'
        this.el.style.cssText = 'width:180px;height:180px;'
        this.el.style.backgroundRepeat = 'no-repeat'
        this.el.style.backgroundImage = `url(${this.$bear})`
        this.el.style.backgroundSize = '540px 2520px'
        this.el.style.backgroundPosition = `0 0`
      }
      // create the marker
      this.marker = new mapboxgl.Marker({element: this.el, draggable: true})
        .setLngLat([this.lng, this.lat])
        .addTo(this.map)
      this.bearAppear()
      this.marker.on('drag', this.dragFn)
      this.marker.on('dragend', this.dragendFn)
    },
    dragFn () {
      clearTimeout(this.timeout)
      clearInterval(this.timer)
      this.el.style.backgroundPosition = `0 0`
      this.showChatRooms = false
      this.hasNext = true
      this.isRefresh = true
      this.levelType = null
    },
    dragendFn () {
      this.showChatRooms = true
      this.isUp = false
      let lng = this.marker.getLngLat().lng
      let lat = this.marker.getLngLat().lat
      this.map.setCenter([lng, lat])
      this.bearSleep()
      // 获取code
      this.getCountryCode()
      // 获取聊天室列表
      this.getChatRoomList()
    },
    bearSleep () {
      clearTimeout(this.timeout)
      clearInterval(this.timer)
      this.timeout = setTimeout(() => {
        var index = 0
        this.timer = setInterval(() => {
          this.el.style.backgroundPosition = `0 ${-index * 180}px`
          index++
          if (index > 12) {
            index = 7
          }
        }, 250)
      }, 5000)
    },
    bearAppear () {
      clearTimeout(this.timeout)
      clearInterval(this.timer)
      var index = 0
      this.timer = setInterval(() => {
        this.el.style.backgroundPosition = `-180px ${-index * 180}px`
        index++
        if (index > 13) {
          this.showChatRooms = true
          this.isUp = false
          this.bearSleep()
        }
      }, 250)
    },
    bearDisappear (center) {
      const disappear = new Promise((resolve) => {
        var index = 0
        this.showChatRooms = false
        clearInterval(this.timer)
        clearTimeout(this.timeout)
        this.timer = setInterval(() => {
          this.el.style.backgroundPosition = `-360px ${-index * 180}px`
          index++
          if (index > 8) {
            clearInterval(this.timer)
            clearTimeout(this.timeout)
            resolve({code: '200', message: 'bear disappear'})
          }
        }, 250)
      })
      disappear.then(res => {
        if (res.code === '200') {
          this.mapFlyFn(center)
        }
      })
    },
    getCornerList () {
      this.rightLatLng = this.map.getBounds().getNorthEast()
      this.leftLatLng = this.map.getBounds().getSouthWest()
      const data = {
        lat_sw: this.leftLatLng.lat,
        lng_sw: this.leftLatLng.lng,
        lat_ne: this.rightLatLng.lat,
        lng_ne: this.rightLatLng.lng,
        limit: 3
      }
      getChatroomListWithCorner(data).then(res => {
        if (res.data.code === '200') {
          if (!res.data.result.resultData || !res.data.result.resultData.length) { return false }
          if (this.isSeeMore) {
            this.locationList.splice(this.locationList.length, 0, ...res.data.result.resultData)
          } else {
            this.locationList = res.data.result.resultData
          }
          if (res.data.result.totalNum <= res.data.result.currentPageSize) {
            this.isFinished = true
          } else {
            this.isFinished = false
          }
        } else {
          Toast({
            message: res.data.message
          })
        }
        this.isSeeMore = false
      }).catch(err => {
        this.toLogin(err)
      })
    },
    getRoundList () {
      const data = {
        latitude: this.lat,
        longitude: this.lng,
        radius: 100000, // 100km
        limit: 3
      }
      getChatroomListWithRadius(data).then(res => {
        if (res.data.code === '200') {
          if (!res.data.result.resultData || !res.data.result.resultData.length) { return false }
          if (this.isSeeMore) {
            this.locationList.splice(this.locationList.length, 0, ...res.data.result.resultData)
          } else {
            this.locationList = res.data.result.resultData
          }
          if (res.data.result.totalNum <= res.data.result.currentPageSize) {
            this.isFinished = true
          } else {
            this.isFinished = false
          }
        } else {
          Toast({
            message: res.data.message
          })
        }
        this.isSeeMore = false
      }).catch(err => {
        this.toLogin(err)
      })
    },
    getRecommendList () {
      getRecommendChatroomList().then(res => {
        if (res.data.code === '200') {
          if (!res.data.result.resultData || !res.data.result.resultData.length) { return false }
          this.recommendList = res.data.result.resultData
        } else {
          Toast({
            message: res.data.message
          })
        }
      }).catch(err => {
        this.toLogin(err)
      })
    },
    getChatRoomList () {
      // 根据ios测试结论：当zoom超过7.0，按圆形进行搜索；若小于7.0，按方形检索。
      this.zoom = this.map.getZoom()
      if (this.zoom > 7) {
        // 按方形检索
        this.getCornerList()
      } else {
        // 按圆形检索
        this.getRoundList()
      }
      this.getXploPostFn()
      this.getRecommendList()
    },
    async getXploPostFn () {
      if (!this.hasNext) {
        return
      }
      const len = this.postList.length
      this.rightLatLng = this.map.getBounds().getNorthEast()
      this.leftLatLng = this.map.getBounds().getSouthWest()
      // 更改最小距离
      this.minDistance = len > 0 ? this.postList[len - 1].distance : 0
      const query = {
        longitude: this.lng,
        latitude: this.lat,
        minDistance: this.minDistance,
        leftLongitude: this.leftLatLng.lng,
        leftLatitude: this.leftLatLng.lat,
        rightLongitude: this.rightLatLng.lng,
        rightLatitude: this.rightLatLng.lat,
        pageSize: this.pageSize,
        levelType: this.levelType
      }
      await getXploPost(query).then(res => {
        if (res.data.code === '200') {
          if (!this.isRefresh) {
            this.postList.splice(len, 0, ...res.data.result.resultData)
          } else {
            this.postList.splice(0, len, ...res.data.result.resultData)
          }
          this.isRefresh = false
          this.hasNext = res.data.result.hasNext
          this.levelType = this.postList.length ? res.data.result.levelType : null
          if (this.hasNext) {
            this.finished = false
          } else {
            this.finished = true
          }
        } else {
          Toast({
            message: res.data.message
          })
        }
      }).catch(err => {
        this.toLogin(err)
      })
    },
    mapFlyFn (center, zoom) {
      const self = this
      this.map.flyTo({
        center: center,
        zoom: zoom || 5,
        curve: 0.5,
        speed: 3,
        easing (t) {
          if (t === 1) {
            self.marker.setLngLat(center)
            self.bearAppear()
            self.hasNext = true
            self.isRefresh = true
            self.levelType = null
            setTimeout(() => {
              self.getChatRoomList()
            })
          }
          return t
        }
      })
    },
    dragSlideEndFn () {
      this.hasNext = true
      this.isRefresh = true
      this.levelType = null
      // 获取聊天室列表
      this.getChatRoomList()
    },
    async searchLocationList () {
      // 判断是否带token
      if (!localStorage.getItem('Authorization')) {
        return false
      }
      const query = {
        page: this.page,
        pageSize: this.pageSize,
        locationShort: this.searchText
      }
      await searchLocation(query).then(res => {
        if (res.data.code === '200') {
          this.viewedLoactions.splice(this.viewedLoactions.length, 0, ...res.data.result.resultData)
          this.page++
          if (this.page > res.data.result.totalPageNum) {
            this.finishedLoc = true
          } else {
            this.finishedLoc = false
          }
        } else {
          Toast({
            message: res.data.message
          })
        }
      }).catch((err) => {
        this.toLogin(err)
      })
    },
    getCountryCode (cb) {
      const center = this.country.coordinate || this.map.getCenter()
      // 调用mabox Search
      axios.get(`${this.mapBaseUrl}/${center.lng},${center.lat}.json?types=country&access_token=${this.accessToken}`)
        .then(res => {
          if (res.status === 200) {
            const len = res.data.features.length - 1
            console.log(res.data.features[len])
            this.country.code = res.data.features[len]['properties'].short_code
            this.country.country = res.data.features[len]['place_name']
            if (cb) {
              cb(res.data.features[0].center)
            }
          } else {
            Toast({
              message: 'Something went wrong,please try latter.'
            })
          }
        }).then(() => {
          console.log('country', this.country)
          this.getTagList()
        })
    },
    getTagList () {
      const data = {
        countryCode: this.country.code
      }
      getRecommendTagsByCountrycode(data).then(res => {
        console.log(res)
        if (res.data.code === '200') {
          this.tagList = res.data.result.tagDetailDtos
        } else {
          Toast({
            message: 'Something went wrong,please try latter.'
          })
        }
      }).catch(err => {
        this.toLogin(err)
      })
      this.country.coordinate = null
    },
    onload () {
      this.searchLocationList()
    },
    onBlur (val) {
      if (!val) {
        return false
      }
      // 调用mabox Search
      axios.get(`${this.mapBaseUrl}/${val}.json?access_token=${this.accessToken}&limit=20`)
        .then(res => {
          if (res.status === 200) {
            this.resultLoactions = res.data.features
          } else {
            Toast({
              message: 'Something went wrong,please try latter.'
            })
          }
        })
    },
    recordLocationFn () {
      // 地址打卡
      const obj = {
        locationName: this.recordLocationData.location,
        locationShort: this.recordLocationData.locationShort,
        longitude: this.recordLocationData.longitude,
        latitude: this.recordLocationData.latitude,
        bounds: false
      }
      recordLocation(obj).then(res => {
        if (!res.data.code === '200') {
          Toast({
            message: res.data.message
          })
        }
      }).catch((err) => {
        this.toLogin(err)
      })
    },
    actionFn () {
      this.showLocation = false
      this.bearDisappear([this.recordLocationData.longitude, this.recordLocationData.latitude])
      this.recordLocationFn()
    },
    onSelect (val) {
      this.bearDisappear(val)
    },
    goHome () {
      this.bearDisappear([this.lng, this.lat])
    },
    touchstartFn () {
      this.$refs.XploPop.$el.style.transition = 'none'
    },
    touchmoveFn (val) {
      this.slideY = val
    },
    touchendFn (val) {
      this.$refs.XploPop.$el.style.transition = '.3s ease-out'
      this.isUp = val > 10
      this.slideY = 0
    },
    changeCode () {
      this.count++
      const len = this.codeData.length - 1
      if (this.count > len) this.count = 0
      this.country = this.codeData[this.count]
      this.getCountryCode(this.bearDisappear)
    }
  }
}
</script>

<style scoped>
.xplo{
  position:relative;
  height: 100%;
}
/* mapbox marker */
.xploMap{
  position: relative;
  width:100%;
}
#map{
  position: absolute;
  top:0;
  width:100%;
  height: 100%;
  z-index: 2;
}
.goHome{
  position: absolute;
  left: 0.2rem;
  bottom: 41%;
  width: 0.5rem;
  height: 0.5rem;
  z-index: 2;
}
.slideIcon{
  margin: 0.2rem auto;
  height: 0.08rem;
  background-color:rgb(176,177,185);
  width: 0.8rem;
  border-radius: 0.08rem;
}
</style>
