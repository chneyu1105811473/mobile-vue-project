<template>
    <div class="myfeed">
      <div class="header">My Feed</div>
      <!-- 下拉刷新 自定义加载图片 -->
      <pull-refresh
      v-model="isLoading"
      @refresh="onRefresh"
      >
        <template slot="pulling">
          <lottie :key="1" :height="50"  :width="100" :options="defaultOptions1"/>
        </template>
        <template slot="loosing">
          <lottie :key="2" :height="50"  :width="100" :options="defaultOptions1" v-on:animCreated="handleAnimation"/>
        </template>
        <template slot="loading">
          <lottie :key="3" :height="50"  :width="100" :options="defaultOptions2"/>
        </template>
        <list
        v-model="loading"
        :finished="finished"
        @load="onload"
        >
          <template slot="loading">
            <lottie :height="50"  :width="100" :options="defaultOptions2"/>
          </template>
          <template v-for="(item,index) in postList">
            <my-feed-item
            :item="item"
            :key="index"
            @openComment = "openCommentPage"
            />
          </template>
        </list>
      <!-- 如果数组为空，则需要引导用户关注people -->
        <no-data-page v-if="isEmpty"/>
        <recommend-people v-if="finished || isEmpty"/>
        <p class="bottom" v-if="finished || isEmpty">
          —— Already at the bottom ——
        </p>
      </pull-refresh>
      <!-- <div class="postIcon" @click="goPost"/> -->
      <!-- comment pop -->
      <popup
      round
      position="bottom"
      style="height:80%"
      v-model="isComment"
      @open="showComment = true"
      @closed="showComment = false"
      >
          <comment
          v-if="showComment||isComment"
          :commentType="commentType"
          :rootId="rootId"
          @close="isComment = false"
          />
      </popup>
      <!-- 底部导航 -->
      <footer-tab :currentTab="currentTab" />
    </div>
</template>
<script>
import {List, PullRefresh, Popup, Toast} from 'vant'
import {myFeed} from '@/api/api'
import footerTab from '@/components/FooterTab'
import MyFeedItem from './components/MyFeedItem'
import Comment from '@/views/comment/Comment'
import LikeList from '@/views/post/LikeList'
import TagDetail from '@/views/tag/TagDetail'
import NoDataPage from './components/NoDataPage'
import RecommendPeople from './components/RecommendPeople'
import toLogin from '@/mixins/toLoginMix'
import Lottie from 'vue-lottie'
import animationData2 from '@/assets/data/refresh02.json'
import animationData1 from '@/assets/data/refresh01.json'

export default {
  name: 'MyFeed',
  mixins: [toLogin],
  components: {
    List,
    Popup,
    Comment,
    LikeList,
    TagDetail,
    footerTab,
    MyFeedItem,
    PullRefresh,
    Lottie,
    NoDataPage,
    RecommendPeople
  },
  data () {
    return {
      currentTab: 0,
      postList: [],
      loading: false,
      finished: false,
      crazyLikeArray: [],
      isLoading: false,
      isRefresh: false,
      isComment: false,
      showComment: false,
      commentType: 0,
      rootId: 0,
      isEmpty: false,
      defaultOptions1: {
        animationData: animationData1
      },
      defaultOptions2: {
        animationData: animationData2
      }
    }
  },
  watch: {
    $route (newRoute, oldRoute) {
      if (oldRoute.name.includes('Posting')) {
        // 如果从发帖页面回来，需要自动刷新页面！
        this.onRefresh()
      }
    }
  },
  activated () {
    this.onRefresh()
  },
  methods: {
    myFeedFn () {
      const query = {
        lastDate: this.lastDate,
        pageSize: 10,
        lastPostId: this.lastPostId,
        lastShareTourId: this.lastShareTourId
      }
      myFeed(query).then(res => { // 返回type 0是post 1是tour
        if (res.data.code === '200') {
          this.loading = false
          this.isLoading = false
          if (res.data.result.resultData.length) {
            res.data.result.resultData.forEach(item => {
              item.isSeeMore = false
            })

            if (this.isRefresh) {
              this.postList.splice(0, this.postList.length, ...res.data.result.resultData)
            } else {
              this.postList.splice(this.postList.length, 0, ...res.data.result.resultData)
            }
            this.isRefresh = false
          }
          if (res.data.result.currentRemainNum <= 0) {
            this.finished = true
          } else {
            this.finished = false
            const len = this.postList.length - 1
            if (this.postList[len].type === 0) {
              this.lastDate = this.postList[len].data.updateTime
              this.lastPostId = this.postList[len].data.id
              this.lastShareTourId = null
            } else {
              this.lastDate = this.postList[len].data.tourShareDto.updateTime
              this.lastPostId = null
              this.lastShareTourId = this.postList[len].data.tourShareDto.tourId
            }
          }
        } else {
          Toast({
            message: res.data.message
          })
        }
        this.isEmpty = !(this.postList.length)
      }).catch(err => {
        this.toLogin(err)
      })
    },
    onload () {
      this.myFeedFn()
    },
    onRefresh () {
      // 进行数据更新
      this.isRefresh = true
      this.lastDate = null
      this.lastPostId = null
      this.lastShareTourId = null
      this.myFeedFn()
    },
    goPost () {
      this.$router.push({
        name: 'PostEdit'
      })
    },
    openCommentPage (id, type) {
      this.rootId = id
      this.commentType = type
      this.isComment = true
    },
    handleAnimation (anim) {
      this.anim = anim
      this.anim.pause()
    }
  }
}
</script>

<style scoped>
/* postIcon */
.postIcon{
  position: fixed;
  bottom: 1.5rem;
  right: 0.1rem;
  width: 1.4rem;
  height: 1.4rem;
  background-image: url('../../assets/img/btnMyfeedPublicpost@2x.png');
  background-size: contain;
  z-index: 1;
}
.header{
  padding-top: 0.2rem;
  text-align: center;
  font-size: 0.36rem;
  color: rgb(51,51,51);
  font-family: SFUIDisplay-Medium;
}
.bottom{
  text-align: center;
  font-size: 0.28rem;
  color: rgb(153,153,153);
}
</style>
