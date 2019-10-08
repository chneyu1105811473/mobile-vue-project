<template>
    <div class="tagDetailContainer">
      <div class="sticky" ref="topContainer">
        <div class="topContainer" :style="{'background-image':`url(${bgImg||$defaultCover})`}">
          <div class="iconfont goBack" @click="goBackFn">&#xe65b;</div>
          <!-- <div class="iconfont goBack" @click="goBackFn">&times;</div> -->
          <div class="tagDetail">
              <h1 class="ellipsis tagName">#{{tagName}}</h1>
              <div class="tagInfo">
                  <span>{{tagDetail.postAmount|formateNum}} Posts</span>
                  <span>{{tagDetail.followAmount|formateNum}} Followers</span>
              </div>
          </div>
          <div class="btnContainer">
              <div :class="{'followBtn':true,'following':tagDetail.isFollowed}" @click="changeTagFollowType(tagDetail)">{{tagDetail.isFollowed?'Following':'Follow'}}</div>
          </div>
        </div>
        <div class="tabs">
          <div class="title" :class="{'active':active===0}" @click="active = 0">Trending</div>
          <div class="title" :class="{'active':active===1}" @click="active = 1">Around you</div>
        </div>
      </div>
      <div class="nearByContent">

      <div v-show="active === 0">
        <div class="trendingItem" v-show="trending24Hours.length>0">
          <p class="trendingTitle">Within 24 hours</p>
          <tag-trending :fileList="trending24Hours"/>
        </div>
        <div class="trendingItem">
          <p class="trendingTitle">Trending history</p>
          <post-list
          :fileList="trendingHistory"
          :finished="finished"
          :disabled="true"
          @onLoading="getMoreFilesFn"
          />
        </div>
      </div>

      <post-list
      :fileList="arroundList"
      :finished="finished2"
      :disabled="true"
      class="marginTop"
      v-show="active === 1"
      @onLoading="getMoreFilesFn2"
      />

      </div>
    </div>
</template>
<script>
import {Toast} from 'vant'
import PostList from '@//components/PostList'
import TagTrending from './components/TagTrending'
import {getTagDetailWithTrending, getTagDetail, tagNearBy} from '@/api/api'
import changeTagFollowType from '@/mixins/changeTagFollowTypeMix'
import toLogin from '@/mixins/toLoginMix'

export default {
  name: 'TagDetail',
  components: {TagTrending, PostList},
  mixins: [changeTagFollowType, toLogin],
  props: ['rootId'],
  data () {
    return {
      tagDetail: {
        name: ''
      },
      trending24Hours: [],
      trendingHistory: [],
      arroundList: [],
      minDistance: 0,
      active: 0,
      finished: false,
      finished2: false,
      page: 1,
      pageSize: 30,
      bgImg: ''
    }
  },
  computed: {
    tagId () {
      return this.$route.params.tagId || this.rootId
    },
    tagName () {
      return this.tagDetail.name.charAt(0).toUpperCase() + this.tagDetail.name.slice(1)
    }
  },
  created () {
    this.getTagDetailFn()
    this.tagNearByFn()
  },
  mounted () {
    const sticky = this.$refs.topContainer
    sticky.parentNode.style.paddingTop = sticky.offsetHeight + 'px'
    sticky.parentNode.style.boxSizing = 'border-box'
  },
  methods: {
    getTagDetailFn () {
      const query = {
        tagId: this.tagId
      }
      getTagDetail(query).then(res => {
        if (res.data.code === '200') {
          this.tagDetail = res.data.result
        } else {
          Toast({
            message: res.data.message
          })
        }
      }).catch(err => {
        this.toLogin(err)
      })
    },
    getTagDetailWithTrendingFn () {
      const query = {
        tagId: this.tagId,
        page: this.page,
        pageSize: this.pageSize
      }
      getTagDetailWithTrending(query).then(res => {
        if (res.data.code === '200') {
          this.trending24Hours = res.data.result['24LikeMost']
          this.trendingHistory.splice(this.trendingHistory.length, 0, ...res.data.result['trendingHistory'].resultData)
          this.bgImg = this.trending24Hours.length ? this.trending24Hours[0].thumbnails[0].src : this.trendingHistory[0].thumbnails[0].src
          this.page++
          if (this.page > res.data.result['trendingHistory'].totalPageNum) {
            this.finished = true
          } else {
            this.finished = false
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
    getMoreFilesFn () {
      this.getTagDetailWithTrendingFn()
    },
    getMoreFilesFn2 () {
      this.tagNearByFn()
    },
    tagNearByFn () {
      const data = {
        'latitude': localStorage.getItem('lat') * 1 || 130,
        'longitude': localStorage.getItem('lng') * 1 || 20,
        'levelType': null,
        'maxDistance': null,
        'minDistance': this.minDistance,
        'pageSize': this.pageSize,
        'tagIdList': [this.tagId]
      }
      tagNearBy(data).then(res => {
        if (res.data.code === '200') {
          this.arroundList.splice(this.arroundList.length, 0, ...res.data.result.resultData)
          this.minDistance = this.arroundList[this.arroundList.length - 1].distance
          if (!res.data.result.hasNext) {
            this.finished2 = true
          } else {
            this.finished2 = false
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
    goBackFn () {
      if (this.$route.params.tagId) {
        this.$router.go(-1)
      } else {
        this.$emit('close', true)
      }
    }
  }
}
</script>
<style scoped>
.tagDetailContainer{
  height: 100%;
  position: relative;
  background-color: #fff;
}
.nearByContent{
  height:100%;
  overflow-y:auto;
}
.goBack{
  position: absolute;
  top: .2rem;
  left: .1rem;
  color: #fff;
  font-size: .54rem;
  z-index: 3;
}
.sticky{
  position: absolute;
  top:0;
  width:100%;
}
.topContainer{
    position: relative;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    overflow: hidden;
    background-color: #e9eef7;
    transition:all 1s;
}
.topContainer::after{
    content: "";
    position: absolute;
    width:150%;
    height:150%;
    left:50%;
    top:50%;
    transform: translate(-50%,-50%);
    background: inherit;
    filter: blur(0.15rem);
}
.topContainer::before{
    content: "";
    position: absolute;
    width:150%;
    height:150%;
    left:50%;
    top:50%;
    transform: translate(-50%,-50%);
    background: inherit;
    filter: blur(0.15rem);
}
.tagDetail{
    position: relative;
    margin: 1rem 0.4rem .6rem;
    color: #fff;
    z-index: 2;
}
.tagName{
  font-size: 0.72rem;
}
.tagInfo{
    font-size:0.36rem;
    display: flex;
    justify-content: space-between;
}
.btnContainer{
    position: absolute;
    top:1.1rem;
    right: 0.5rem;
    z-index: 2;
}
.trendingItem{
  margin-top: .2rem;
}
.trendingTitle{
    color:rgb(51,51,51);
    font-size: 0.24rem;
    text-indent: 0.2rem;
    margin: 0;
}
.marginTop{
    margin-top:0.05rem;
}
.followBtn{
  display: flex;
  justify-content: center;
  align-items: center;
  color:#fff;
  width:1.8rem;
  height: 0.7rem;
  font-size: 0.28rem;
  border-radius:0.35rem;
  background:linear-gradient(to right, rgb(52,147,212),rgb(54,100,167));
}
.followBtn.following{
  height: 0.68rem;
  color:rgb(54,100,167);
  background: transparent;
  border:0.01rem solid rgb(54,100,167);
}
.ellipsis{
  width: 4rem;
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow:ellipsis;
}
.tabs{
  width: 100%;
  height: 0.88rem;
  display: flex;
  align-items: center;
  border-bottom: 0.02rem solid rgb(231,231,231);
}
.tabs .title{
  position: relative;
  height:100%;
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color:rgb(153,153,153);
  font-family: SFUIDisplay-Regular;
  font-size: 0.28rem;
  font-weight:bold;
}
.tabs .title.active{
  color: rgb(66,93,144);
}
.tabs .title::after{
  position: absolute;
  content: "";
  bottom: 0;
  left: 50%;
  right: 50%;
  height: 0.04rem;
  background-color: rgb(66,93,144);
}
.tabs .title.active::after{
  left: 38%;
  right: 38%;
  transition-duration:0.3s;
  transition-timing-function:ease-in-out;
}
</style>
