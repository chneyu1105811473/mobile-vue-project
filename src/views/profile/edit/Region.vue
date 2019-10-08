<template>
<div class="regionSetting" :style="{'height':winHeight+'px'}">
    <div class="header">
      <div class="btnBack iconfont" @click="goBack">&#xe65b;</div>
      <div class="title">Where are you from?</div>
    </div>
    <div id="map"></div>
</div>
</template>
<script>
import locateIcon from '@/assets/img/publicMapIconLocate.png'
import mapboxgl from 'mapbox-gl'
import userLocation from '@/mixins/userLocationMix'
import axios from 'axios'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'RegionSetting',
  mixins: [userLocation],
  data () {
    return {}
  },
  computed: {
    ...mapState([
      'accessToken',
      'mapBaseUrl',
      'API_URL'
    ]),
    ...mapGetters([
      'winHeight'
    ])
  },
  mounted () {
    this.initMap()
  },
  methods: {
    initMap () {
      mapboxgl.accessToken = this.accessToken
      mapboxgl.config.API_URL = this.API_URL
      const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/chenyu1105811473/cjr5zq4lp36qr2snxtig1e8kj',
        center: [this.lng, this.lat],
        zoom: 1.2
      })
      // 添加当前位置图标
      map.on('load', (e) => {
        // map.resize()
        map.loadImage(locateIcon, (err, image) => {
          if (err) throw err
          map.addImage('locate', image)
          map.addLayer({
            'id': 'points',
            'type': 'symbol',
            'source': {
              'type': 'geojson',
              'data': {
                'type': 'FeatureCollection',
                'features': [{
                  'type': 'Feature',
                  'geometry': {
                    'type': 'Point',
                    'coordinates': [this.lng, this.lat]
                  }
                }]
              }
            },
            'layout': {
              'icon-image': 'locate'
            }
          })
        })
      })
      // Center the map on the coordinates of any clicked symbol from the 'symbols' layer.
      map.on('click', (e) => {
        const lngLat = e.lngLat
        // 调用mapbox反编码接口
        axios.get(`${this.mapBaseUrl}/${lngLat.lng},${lngLat.lat}.json?access_token=${this.accessToken}`)
          .then(res => {
            const placeArr = res.data.features
            this.country = placeArr[placeArr.length - 1].properties.short_code
            this.$store.state.userInfo.country = this.country
            // 设置选择国家样式
            const country = placeArr[placeArr.length - 1].place_name
            map.setFilter('ne-10m-admin-0-countries-169mfg', ['==', 'BRK_NAME', country])
            map.setFilter('country-label', ['==', 'name_en', country])
          })
      })
    },
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>
<style scoped>
.btnBack{
  position: absolute;
  top: .2rem;
  left: .3rem;
  color: #3a5385;
  font-size: .6rem;
  font-weight: bold;
  z-index: 999;
}
.title{
  position: absolute;
  top: .3rem;
  width: 100%;
  text-align: center;
  font-size: 0.4rem;
  z-index: 2;
}
#map{
    width:100%;
    height: 100%;
}
.settingBtn{
    position: relative;
    margin-top: -1.5rem;
}
</style>
