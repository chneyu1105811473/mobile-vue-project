<template>
    <div id="container">
        <div id="map"></div>
        <div class="mapMax" @click="mapToMax = !mapToMax">
          <img :src="!mapToMax?icMapLarge:icMapSmall" alt="map zoom icon">
        </div>
        <div class="visitedCountryList">
          <swiper :options="swiperOptions">
            <swiper-slide class="slider">
              <div class="globalView iconfont" @click="changeMapZoom">&#xe604;</div>
            </swiper-slide>
            <swiper-slide v-for="(item,index) in visitedCountryList" :key="index" class="slider">
              <div class="countryItem" @click="goCountryPost(item)">
                <div class="flag" :class="item.countryFlag"></div>
                <span>{{item.isoCountryCode}}</span>
              </div>
            </swiper-slide>
          </swiper>

        </div>
        <div class="sliderBox" v-show="postList.length">
          <swiper-wall :fileList="postList"/>
        </div>
    </div>
</template>

<script>
import icMapNor from '@/assets/img/icMapNor@2x.png'
import icMapZoom from '@/assets/img/icMapZoom@2x.png'
import mapboxgl from 'mapbox-gl'
import SwiperWall from '@/components/swiper/SwiperWall'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import {profileMapPost, profileHistoryPost} from '@/api/api'
import toLogin from '@/mixins/toLoginMix'
import {Toast} from 'vant'

export default {
  name: 'Footprint',
  mixins: [toLogin],
  props: ['isMapMax', 'visitedCountryList', 'footHeight'],
  components: {SwiperWall, swiper, swiperSlide},
  data () {
    return {
      postList: [],
      lng: 113,
      lat: 22,
      markers: null,
      icMapLarge: icMapNor,
      icMapSmall: icMapZoom,
      swiperOptions: {
        // some swiper options/callbacks
        // 所有的参数同 swiper 官方 api 参数
        direction: 'horizontal',
        slidesPerView: 'auto',
        height: 'auto',
        freeMode: true
      }
    }
  },
  computed: {
    mapToMax: {
      get () {
        return this.isMapMax
      },
      set (val) {
        this.$emit('maxMap', val)
      }
    },
    accessToken () {
      return this.$store.state.accessToken
    },
    API_URL () {
      return this.$store.state.API_URL
    },
    userId () {
      return this.$route.params.userId
    },
    postNum () {
      return this.$store.state.userInfo.timeLineNum
    }
  },
  watch: {
    mapToMax () {
      setTimeout(() => {
        this.map.resize()
      }, 0)
    }
  },
  mounted () {
    this.initMap()
  },
  methods: {
    initMap () {
      mapboxgl.accessToken = this.accessToken
      mapboxgl.config.API_URL = this.API_URL
      this.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/devilhw/cjxobd5ws14jn1coueblhrvho',
        center: [this.lng, this.lat],
        zoom: 3,
        minZoom: 3,
        maxZoom: 15,
        dragRotate: false,
        scrollZoom: false,
        pitchWithRotate: false,
        doubleClickZoom: false,
        touchZoomRotate: true
      })
      // 地图resize
      this.map.on('load', () => {
        this.map.resize()
      })
      this.map.on('dragend', () => {
        this.getXploPostFn()
      })
      // 加载post数据
      this.getHistoryPost()
    },
    async getHistoryPost () {
      const query = {
        userId: this.userId,
        page: 1,
        pageSize: this.postNum
      }
      await profileHistoryPost(query).then(res => {
        if (res.data.code === '200') {
          this.postList.splice(0, this.postList.length, ...res.data.result.resultData)
          this.genarateFeatures(this.postList)
        } else {
          Toast({
            message: res.data.message
          })
        }
      }).catch(err => {
        this.toLogin(err)
      })
    },
    async getXploPostFn () {
      const len = this.postList.length
      this.rightLatLng = this.map.getBounds().getNorthEast()
      this.leftLatLng = this.map.getBounds().getSouthWest()
      // 更改最小距离
      this.minDistance = len > 0 ? this.postList[len - 1].distance : 0
      const query = {
        userId: this.userId,
        leftLongitude: this.leftLatLng.lng,
        leftLatitude: this.leftLatLng.lat,
        rightLongitude: this.rightLatLng.lng,
        rightLatitude: this.rightLatLng.lat
      }
      await profileMapPost(query).then(res => {
        if (res.data.code === '200') {
          this.postList.splice(0, this.postList.length, ...res.data.result)
        } else {
          Toast({
            message: res.data.message
          })
        }
      }).catch(err => {
        this.toLogin(err)
      })
    },
    genarateFeatures (list) {
      this.features = []
      this.currentLat = 0
      this.currentLog = 0
      list.map(item => {
        if (Math.abs(this.currentLat - item.latitude) < 1 && Math.abs(this.currentLog - item.longitude) < 1) {
          this.features[this.features.length - 1].push(item)
        } else {
          this.features.push([item])
        }
        this.currentLat = item.latitude
        this.currentLog = item.longitude
      })
      // console.log(list, this.features)
      this.showMapImg()
    },
    showMapImg () {
      this.features.forEach(feature => {
        // 地图显示post图片
        const img = feature[0].thumbnails[0].src
        let el = document.createElement('div')
        let num = document.createElement('div')
        el.className = 'imageMarker'
        num.className = 'numberMarker'
        num.innerHTML = feature.length
        el.style.backgroundImage = `url(${img})`
        el.style.backgroundSize = 'cover'
        el.style.position = 'relative'
        el.style.width = '1rem'
        el.style.height = '1rem'
        num.style.cssText = 'text-align:center;right:0;top:0;background-color:rgb(52,100,255);color:#fff;font-size:12px'
        num.style.position = 'absolute'
        num.style.transform = 'translate(50%,-50%)'
        num.style.width = '0.4rem'
        num.style.height = '0.4rem'
        num.style.borderRadius = '50%'
        num.style.fontSize = '0.24rem'
        el.appendChild(num)
        el.addEventListener('click', () => {
          this.postList.splice(0, this.postList.length, ...feature)
        })
        // add marker to the map
        new mapboxgl.Marker(el)
          .setLngLat([feature[0].longitude, feature[0].latitude])
          .addTo(this.map)
        this.markers = document.getElementsByClassName('imageMarker')[0]
      })
    },
    goCountryPost (item) {
      // 地图飞到相应的位置 //sw,ne(lng,lat)
      const bbox = [[item.minLongitude, item.minLatitude], [item.maxLongitude, item.maxLatitude]]
      const _this = this
      this.map.fitBounds(bbox, {
        linear: true,
        easing (t) {
          if (t >= 1) {
            setTimeout(() => {
              _this.getXploPostFn()
            }, 100)
          }
          return t
        }
      })
    },
    changeMapZoom () {
      this.map.setZoom(3)
      this.getXploPostFn()
    }
  }
}
</script>

<style scoped>
img{
  object-fit: cover;
}
#container{
  height: 100%;
  overflow: hidden;
}
#map{
  width:100%;
  height: 100%;
}
.sliderBox{
  position: absolute;
  width:100%;
  bottom:0;
  padding-bottom: 1.2rem;
  padding-bottom: calc(1.2rem + constant(safe-area-inset-bottom)) ;
  padding-bottom: calc(1.2rem + env(safe-area-inset-bottom));
  box-sizing: border-box;
  background-color: rgba(0,0,0,.2);
}
.mapMax{
  position: absolute;
  top:1rem;
  right: 0.1rem;
  width: .9rem;
  height: .9rem;
  border-radius: 50%;
}
.imageMarker {
  display: block;
  border: none;
  padding: 0;
}
.visitedCountryList{
  position:absolute;
  width:100%;
  top:0;
  padding:0.15rem 0;
  box-sizing:border-box;
  font-family:SFUIDisplay-Medium;
  color:rgb(66,93,144);
  font-size:0.24rem;
  background-color:rgba(255,255,255,.28);
}
.countryItem{
  display:flex;
  margin-right:0.5rem;
  justify-content:flex-start;
  align-items:center;
}
.countryItem .flag{
  min-width:0.56rem;
  width:0.56rem;
  height:0.5rem;
  margin-right:0.1rem;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.globalView{
  margin-left:0.2rem;
  margin-top:0.02rem;
  font-size: 0.38rem;
  margin-right:0.2rem;
}
.slider{
  width:auto;
  vertical-align:middle;
}
</style>
