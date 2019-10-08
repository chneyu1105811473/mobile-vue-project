<template>
    <div class="container">
      <div class="fixed" ref="sticky">
        <div class="searchBox">
          <search placeholder="Search" :readonly="true" @click.native="goTrendingSearch"/>
        </div>
        <div class="trendingType">
          <div class="postType">
            <div class="title" :class="{'active':active === 0}" @click="active = 0">Hottest</div>
            <div class="title" :class="{'active':active === 1}" @click="active = 1">Recent</div>
          </div>
          <div class="IconType iconfont" @click.stop="isList = !isList">
            {{isList?'&#xe6c0;':'&#xe6a9;'}}
          </div>
        </div>
      </div>

      <div class="postContainer" v-show="active === 0">
         <trending-tab
         :fileList="trendingHottests"
         :finished="finished_0"
         :isList="isList"
         @load="onLoad"
         @refresh="refresh"
         @openComment="onOpen"/>
      </div>

      <div class="postContainer" v-show="active === 1">
         <trending-tab
         :fileList="trendingRecent"
         :finished="finished_1"
         :isList="isList"
         @load="onLoad"
         @refresh="refresh"
         @openComment="onOpen"/>
      </div>
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

      <footer-tab :currentTab="currentTab"/>
    </div>
</template>

<script>
import {Popup, Toast} from 'vant'
import {trendingHottest, trendingLatest} from '@/api/api'
import FooterTab from '@/components/FooterTab'
import Search from '@/components/SearchInput'
import trendingTab from './components/trendingTab'
import Comment from '@/views/comment/Comment'
import toLogin from '@/mixins/toLoginMix'

export default {
  name: 'Trending',
  components: {FooterTab, Search, Popup, Comment, trendingTab},
  mixins: [toLogin],
  data () {
    return {
      currentTab: 1,
      trendingHottests: [],
      trendingRecent: [],
      finished_0: false,
      finished_1: false,
      page_0: 1,
      pageSize: 15,
      active: 0,
      isList: false,
      isRefresh: false,
      rootId: null,
      commentType: 0,
      isComment: false,
      showComment: false
    }
  },
  mounted () {
    const sticky = this.$refs.sticky
    sticky.parentNode.style.paddingTop = sticky.offsetHeight + 'px'
    sticky.parentNode.style.boxSizing = 'border-box'
  },
  watch: {
    active () {
      if (!this.trendingHottests.length || !this.trendingRecent.length) {
        this.onLoad()
      }
    }
  },
  methods: {
    goTrendingSearch () {
      this.$router.push({
        name: 'TrendingSearch'
      })
    },
    getTrendingHottest () {
      // 获取treding post列表数据
      const query = {
        page: this.page_0,
        pageSize: this.pageSize
      }
      trendingHottest(query).then(res => {
        if (res.data.code === '200') {
          if (res.data.result.resultData) {
            if (this.isRefresh) {
              this.trendingHottests.splice(0, this.trendingHottests.length, ...res.data.result.resultData)
            } else {
              this.trendingHottests.splice(this.trendingHottests.length, 0, ...res.data.result.resultData)
            }
            this.isRefresh = false
          }
          this.page_0++
          if (this.page_0 > res.data.result.totalPageNum) {
            this.finished_0 = true
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
    getTrendingLatest () {
      // 获取treding post列表数据
      const query = {
        pageSize: this.pageSize,
        updateTime: this.updateTime
      }
      trendingLatest(query).then(res => {
        if (res.data.code === '200') {
          if (this.isRefresh) {
            this.trendingRecent.splice(0, this.trendingRecent.length, ...res.data.result.resultData)
            this.isRefresh = false
          } else {
            this.trendingRecent.splice(this.trendingRecent.length, 0, ...res.data.result.resultData)
          }
          this.updateTime = this.trendingRecent[this.trendingRecent.length - 1].updateTime
          if (res.data.result.currentPageSize >= res.data.result.totalNum) {
            this.finished_1 = true
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
    onLoad () { // 0 表示最新，1 表示最热
      if (this.active === 0) {
        this.getTrendingHottest()
      } else {
        this.getTrendingLatest()
      }
    },
    refresh () {
      this.isRefresh = true
      this.updateTime = null
      if (this.active === 0) {
        this.page_0 = 1
      }
      this.onLoad()
    },
    onOpen (id) {
      this.rootId = id
      this.isComment = true
    }
  }
}
</script>

<style scoped>
.container{
  position: relative;
  height: 100%;
}
.fixed{
  position: fixed;
  width: 100%;
  z-index:1;
  top: 0;
  margin:0 auto;
  background-color: #fff;
}
.searchBox{
  height: 0.8rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 0.8rem;
  padding: 0.2rem 0.2rem 0;
}
.postType{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.IconType.iconfont{
  font-size: 0.4rem;
  margin-left: .3rem;
}
.trendingType{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.2rem 0.2rem 0.1rem;
  box-sizing: border-box;
}
.title{
  position:relative;
  font-family: SFUIDisplay-Regular;
  padding: .1rem 0;
  margin-right:1rem;
  font-size: 0.28rem;
  font-weight:bold;
  color: rgb(153,153,153);
}
.title.active{
  color: rgb(51,51,51);
}
.title::after{
  position:absolute;
  content: "";
  height: 0.04rem;
  bottom:0;
  left:50%;
  right:50%;
}
.title.active::after{
  left:0.1rem;
  right:0.1rem;
  background-color: rgb(51,51,51);
  transition-duration:0.3s;
  transition-timing-function:ease-out;
}
.postContainer{
  height: 100%;
}
</style>
