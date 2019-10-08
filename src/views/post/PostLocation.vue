<template>
    <div class="postLocation">
      <nav-bar v-show="!isSearch">
          <span slot="left" class="iconfont leftIcon" @click="goBack">&#xe65b;</span>
          <span slot="title" class="title">Location</span>
          <!-- <span slot="right" @click="post">Done</span> -->
      </nav-bar>
      <collapse v-model="activeNames" v-show="!isSearch">
        <collapse-item name="1" class="panel">
          <div slot="title">
            <div class="locationContainer">
              <div class="locationImg"></div>
              <div class="locationText">
                <span class="iconfont locIcon">&#xe601;</span>
                <span>{{location}}</span>
              </div>
            </div>
          </div>
          <div class="locationList">
            <div @click.stop.prevent="goSearchLocation">
              <search :placeholder="placeholder"></Search>
            </div>
            <div class="locationItem" v-for="(item,index) in locationList" :key="index" @click="selLocationFn(item)">
              <span class="iconfont locIcon">&#xe601;</span>
              <span>{{item.place_name}}</span>
            </div>
          </div>
        </collapse-item>
      </collapse>

      <div class="seachContainer" v-show="isSearch">
        <div class="btnBack iconfont" @click="closeSearch">&#xe65b;</div>
        <div class="searchBox">
          <input v-model="searchText" :placeholder="placeholder">
        </div>
        <div class="clearIcon" @click="clearFn">
          <icon name="cross" color="rgb(176,177,185)" size="0.4rem" />
        </div>
        <div class="placeBox" ref="placeBox">
          <div class="placeItem" v-for="(item,index) in placeList" :key="index" @click="selLocationFn(item)">
              <span class="iconfont locIcon">&#xe601;</span>
              <div v-if="item.place_name">
                <p class="poiTitle">{{item.place_name.split(',')[0]}}</p>
                <p class="poiText">{{item.place_name.slice(item.place_name.indexOf(',')+2)}}</p>
              </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import Search from '@/components/Search'
import NavBar from '@/components/NavBar'
import {Collapse, CollapseItem, Icon} from 'vant'
import userLocation from '@/mixins/userLocationMix'
import mapboxgl from 'mapbox-gl'
import axios from 'axios'
import {mapState} from 'vuex'

export default {
  name: 'PostLocationSel',
  components: {Collapse, CollapseItem, NavBar, Icon, Search},
  mixins: [userLocation],
  data () {
    return {
      activeNames: ['1'],
      location: '',
      locationList: [],
      placeList: [],
      placeholder: 'Search for nearby locations',
      searchText: '',
      isSearch: false,
      searchTypes: 'poi'
    }
  },
  created () {
    this.getLocation()
    this.getLocationList()
  },
  watch: {
    searchText (val) {
      this.getSearchLoc()
    }
  },
  computed: mapState([
    'postData',
    'accessToken',
    'mapBaseUrl'
  ]),
  methods: {
    getLocation () {
      // 调用mapbox反编码接口
      axios.get(`${this.mapBaseUrl}/${this.lng},${this.lat}.json?access_token=${this.accessToken}`)
        .then(res => {
          const features = res.data.features
          this.location = features[0].place_name
        })
    },
    getLocationList () {
      const lngLatBound = new mapboxgl.LngLat(this.lng, this.lat).toBounds(5000).toArray()
      axios.get(`${this.mapBaseUrl}/${this.postData.cityName}.json?bbox=${lngLatBound[0][0]},${lngLatBound[0][1]},${lngLatBound[1][0]},${lngLatBound[1][1]}&country=${this.postData.isocountryCode}&limit=5&access_token=${this.accessToken}`)
        .then(res => {
          if (res.status === 200) {
            this.locationList = res.data.features
          }
        })
    },
    getSearchLoc () {
      axios.get(`${this.mapBaseUrl}/${this.searchText} ${this.postData.cityName}.json?limit=10&types=${this.searchTypes}&country=${this.postData.isocountryCode}&access_token=${this.accessToken}`).then(res => {
        if (res.status === 200) {
          console.log(res)
          this.placeList = res.data.features
          this.$refs.placeBox.style.display = 'block'
        }
      })
    },
    selLocationFn (item) {
      this.$store.state.postData.location = item.place_name
      this.$store.state.postData.longitude = item.center[0]
      this.$store.state.postData.latitude = item.center[1]
      this.$router.replace({
        name: 'Publish'
      })
    },
    goSearchLocation () {
      if (!this.isSearch) {
        this.isSearch = true
      }
    },
    getSearchText (val) {
      this.searchText = val
    },
    clearFn () {
      this.searchText = ''
    },
    closeSearch () {
      this.isSearch = false
    },
    goBack () {
      this.$router.replace({
        name: 'Publish'
      })
    }
  }
}
</script>

<style scoped>
.btnBack{
  position: absolute;
  top: .2rem;
  left: .2rem;
  font-size: .5rem;
  z-index: 999;
}
input{
  width: 100%;
  height: 100%;
}
.locationContainer{
  display: flex;
}
.locationImg{
  margin-right: 0.2rem;
  min-width: 1.2rem;
  width: 1.2rem;
  height: 1.2rem;
  background-position:0 0;
  background-repeat:no-repeat;
  background-image: url('../../assets/img/publicLightIconLocation@2x.png');
  background-size: cover;
}
.locIcon{
  font-size: 0.28rem;
  color: #3a5385;
  margin-right: .1rem;
}
.locationText{
  display: flex;
  align-items: flex-start;
  font-size: 0.28rem;
}
.locationItem{
  display: flex;
  padding: 0.4rem 0;
  color: rgb(51,51,51);
}
.clearIcon{
  position: fixed;
  top:0.3rem;
  right: 0.2rem;
}
.searchBox{
  position: fixed;
  top: 0;
  width: 100%;
  padding: 0.25rem 1rem;
  box-sizing: border-box;
  border:0.02rem solid rgb(239,239,244);
  background-color: #fff;
}
.searchInput input{
  font-size: 0.28rem;
  font-family: SFUIDisplay-Regular;
}
.placeBox{
  padding: 0 0.2rem;
}
.placeItem{
  display: flex;
  align-items: baseline;
  padding: 0.2rem 0;
  color: rgb(51,51,51);
}
.poiTitle{
  font-size: 0.28rem;
  font-family: SFUIDisplay-Medium;
  font-weight: bold;
  margin:0.1rem 0;
}
.poiText{
  margin: 0;
  font-size: 0.24rem;
}
.leftIcon{
  font-size: 0.5rem;
}
.title{
  font-family: SFUIDisplay-Medium;
  /* color: rgb(102,102,102); */
}
</style>
