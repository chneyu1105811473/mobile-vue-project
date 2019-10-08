<template>
    <div class="trending">
        <div class="searchBox" ref="searchBox">
            <search v-model="searchText" placeholder="Search"/>
            <span @click="goTrending">Cancel</span>
        </div>
        <tabs
        v-model="active"
        :line-width="lineWidth"
        :line-height="lineHeight"
        :swipeable="true"
        :border="false"
        @change="changeTab"
        color="rgb(51,51,51)"
        >
          <tab title="People">
              <peopleList :searchText="searchText"/>
          </tab>
          <tab title="Tag">
              <TagList :searchText="searchText"/>
          </tab>
          <tab title="Location ">
              <LocationList :list="placeList"/>
          </tab>
        </tabs>
        <footer-tab :currentTab="currentTab"/>
    </div>
</template>

<script>
import {Tabs, Tab} from 'vant'
import FooterTab from '@/components/FooterTab'
import Search from '@/components/SearchInput'
import tourList from './components/TrendingSearchTour'
import peopleList from './components/TrendingSearchPeople'
import TagList from './components/TrendingSearchTags'
import LocationList from './components/TrendingSearchLocation'
import axios from 'axios'

export default {
  name: 'TrendingSearch',
  components: {FooterTab, Search, Tabs, Tab, tourList, peopleList, TagList, LocationList},
  data () {
    return {
      currentTab: 1,
      lineWidth: 125,
      lineHeight: 1,
      searchText: '',
      placeList: []
    }
  },
  mounted () {
    const searchBox = this.$refs.searchBox
    searchBox.parentNode.style.paddingTop = '1rem'
    searchBox.parentNode.style.boxSizing = 'borderBox'
  },
  computed: {
    active: {
      get () {
        return this.$route.query.active * 1 || 0
      },
      set () {}
    },
    accessToken () {
      return this.$store.state.accessToken
    },
    mapBaseUrl () {
      return this.$store.state.mapBaseUrl
    }
  },
  watch: {
    searchText (val) {
      if (this.index === 2 && val) {
        this.searchPlace()
      }
    }
  },
  methods: {
    goTrending () {
      this.$router.push({
        name: 'Trending'
      })
    },
    searchPlace () {
      // 调用mabox Search
      axios.get(`${this.mapBaseUrl}/${this.searchText}.json?access_token=${this.accessToken}&limit=20`)
        .then(res => {
          if (res.status === 200) {
            this.placeList = res.data.features
          }
        })
    },
    changeTab (val) {
      this.index = val
      if (this.index === 2 && this.searchText) {
        this.searchPlace()
      }
    }
  }
}
</script>

<style scoped>
  .trending{
    color: rgb(51,51,51);
  }
  .searchBox{
    position: fixed;
    top: 0;
    width: 100%;
    height: 1rem;
    display: flex;
    align-items: center;
    padding: 0.2rem;
    box-sizing:border-box;
    font-size: 0.24rem;
    background-color: #fff;
    z-index: 999;
  }
  .searchBox .searchInput{
    width: 100%;
    margin-right: 0.2rem;
  }
</style>
