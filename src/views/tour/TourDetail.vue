<template>
    <div class="tourDetail">
      <!-- header -->
        <nav-bar>
          <span slot="left" class="leftIcon iconfont" @click="goBack">&#xe65b;</span>
          <span slot="title">{{title}}</span>
          <span slot="right" class="iconfont rightIcon" @click="isEdit = true">&#xe60f;</span>
        </nav-bar>
        <!-- list -->
        <tour-detail-item
        :list="list"
        :finished="finished"
        @loading="onLoad"
        @deletePost="onDeletePost"
        />
        <!-- footer -->
        <footer-tab :currentTab="currentTab"/>
        <!-- setting pop -->
        <popup position="bottom" v-model="isEdit">
          <EditTourPop @close="onClose"/>
        </popup>
        <!-- emptyPage -->
        <empty-page v-if="isEmpty" />
    </div>
</template>

<script>
import {Popup, Toast} from 'vant'
import {tourDetail, tourPost, saveOrDeleteTour} from '@/api/api'
import TourDetailItem from './components/DetailItem'
import EditTourPop from './components/EditPop'
import FooterTab from '@/components/FooterTab'
import NavBar from '@/components/NavBar'
import EmptyPage from '@/components/EmptyPage'
import toLoginMix from '@/mixins/toLoginMix'

export default {
  name: 'TourDetail',
  components: {Popup, FooterTab, TourDetailItem, EditTourPop, NavBar, EmptyPage},
  mixins: [toLoginMix],
  data () {
    return {
      currentTab: 4,
      isSticky: false,
      finished: false,
      title: '',
      list: [],
      isEdit: false,
      isEmpty: false
    }
  },
  created () {
    this.getTourInfo()
  },
  methods: {
    goBack () { // 回到tour list列表
      this.$router.push({
        name: 'Tour'
      })
    },
    getTourInfo () {
      const query = this.$route.params
      tourDetail(query).then(res => {
        if (res.data.code === '200') {
          this.tourInfo = res.data.result
          this.title = this.tourInfo.tourDto.name
        } else {
          Toast({
            message: res.data.message
          })
        }
      })
    },
    onLoad () {
      tourPost(this.$route.params).then(res => {
        if (res.data.code === '200') {
          this.list = res.data.result.resultData
          this.finished = true
        } else {
          Toast({
            message: res.data.message
          })
        }
        this.isEmpty = !(this.list.length)
      }).catch((err) => {
        this.toLogin(err)
      })
    },
    onClose () {
      this.isEdit = false
    },
    onDeletePost (postIdList, index) {
      const data = {
        operationType: 0, // 1:新增，0，删除
        postIdList: postIdList,
        tourId: this.$route.params.tourId
      }
      saveOrDeleteTour(data).then(res => {
        if (res.data.code === '200') {
          // 成功之后去除已经删除的post
          this.list.splice(index, 1)
        }
        Toast({
          message: res.data.message
        })
        this.isEmpty = !(this.list.length)
      }).catch(err => {
        this.toLogin(err)
      })
    }
  }
}
</script>

<style scoped>
.tourDetail{
  height:100%;
  min-height:100%;
}
.leftIcon{
  font-size: 0.5rem;
}
.rightIcon{
  color: rgb(51,51,51);
  font-size: 0.54rem;
  margin-right: -.2rem;
}
</style>
