<template>
    <div class="tourList">
        <!-- header -->
        <nav-bar>
          <span slot="left" class="iconfont leftIcon" @click="goBack">&#xe65b;</span>
          <span slot="title">Album</span>
          <span slot="right" class="iconfont rightIcon" @click="isNewTour = true">&#xe612;</span>
        </nav-bar>
        <!-- list -->
        <tour-list-item :list="list" :finished="finished" @loading="onLoad"/>
        <!-- footer -->
        <footer-tab :currentTab="currentTab"/>
        <!-- popup -->
        <popup v-model="isNewTour">
          <new-tour-pop :isCreateTour="true" @close="isNewTour = false" />
        </popup>
        <!-- isEmpty -->
        <empty-page v-if="isEmpty" />
    </div>
</template>

<script>
import {Popup, Toast} from 'vant'
import {profileMoreTours} from '@/api/api'
import toLoginMix from '@/mixins/toLoginMix'
import TourListItem from './components/TourItem'
import NewTourPop from '@/components/popup/NewTourPop'
import FooterTab from '@/components/FooterTab'
import NavBar from '@/components/NavBar'
import EmptyPage from '@/components/EmptyPage'

export default {
  name: 'TourList',
  components: {Popup, FooterTab, NewTourPop, TourListItem, NavBar, EmptyPage},
  mixins: [toLoginMix],
  data () {
    return {
      list: [],
      currentTab: 4,
      isNewTour: false,
      finished: false,
      page: 1,
      pageSize: 10,
      tourType: 1,
      isEmpty: false
    }
  },
  computed: {
    userId () {
      return localStorage.getItem('id')
    }
  },
  methods: {
    getTourList () {
      const query = {
        userId: this.userId,
        tourType: this.tourType,
        page: this.page,
        pageSize: this.pageSize
      }
      profileMoreTours(query).then(res => {
        if (res.data.code === '200') {
          this.list.splice(this.list.length, 0, ...res.data.result.resultData)
          this.page++
          if (this.page > res.data.result.totalPageNum) {
            this.finished = true
          } else {
            this.finished = false
          }
        } else {
          Toast({
            message: res.data.message
          })
        }
        this.isEmpty = !(this.list.length)
      }).catch(err => {
        this.toLogin(err)
      })
    },
    goBack () {
      this.$router.push({
        name: 'ProfileDetail',
        params: {
          userId: localStorage.getItem('id') * 1
        }
      })
    },
    onLoad () {
      this.getTourList()
    }
  }

}
</script>

<style scoped>
.leftIcon{
  font-size: 0.5rem;
}
.rightIcon{
  font-size: 0.4rem;
  color: rgb(51,51,51);
}
</style>
