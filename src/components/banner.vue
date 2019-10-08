<template>
    <!-- v-touch:hold="imagePreviewFn" -->
    <div
    id="banner"
    class="post-banner"
    :style="{'padding-bottom':bannerHeight}"
    ref="banner">
        <div class="banner-train" v-show="detailData.postFileDetailDtos.length>1">
          <div
          :key="index"
          class="train-item"
          v-for="(item,index) in detailData.postFileDetailDtos"
          :style="`width:${trainItemWidth[index]*100}%`"
          >
              <div class="action" ref="trainAction"></div>
          </div>
        </div>
        <!-- :autoplay="duration * 1000" -->
        <swipe
        :duration="300"
        indicator-color="#fff"
        ref="mySwiper"
        @change="changeFn">
          <swipe-item v-for='(item,index) in detailData.postFileDetailDtos' :key="index">
            <div class="fileContainer" ref="videoContainer">
              <!-- image -->
              <van-image
              :key="index"
              :src="item.thumbnails[3].src||$defaultCover"
              v-if='item.type === 0'>
                <template slot="loading">
                  <Loading type="spinner" size="24"/>
                </template>
                <template slot="error">
                  <img :src="$errorCover" alt="Error">
                </template>
              </van-image>
              <!-- video -->
              <video
              :src="item.videoUrl"
              :ref="`myVideo${index}`"
              :poster="item.thumbnails[3].src||$defaultCover"
              :muted="muted"
              :loop="true"
              preload="auto"
              class="video-player"
              playsinline=true
              webkit-playsinline=true
              x5-playsinline=true
              x5-video-player-type="h5"
              webview.allowsInlineMediaPlayback = YES
              v-if='item.type === 1'
              />
            </div>
            <div class="fileCover" @click="playOrStopVideo">
              <div class="playIcon iconfont" ref="playIcon" v-show="item.type === 1">&#xe60b;</div>
            </div>
          </swipe-item>
        </swipe>
        <div class="banner-icons">
          <div class="tagIcon" v-if="detailData.postFileDetailDtos[swiperIndex].postFileAtPeopleDtos.length" @click.self="tagIconClick(swiperIndex)"></div>
          <div class="volumn" v-if="hasVideo()" ref="volumnIcon" @click.stop.prevent="changeIcon"></div>
        </div>

        <!-- atPeopleList popup -->
        <popup position="bottom" v-model="showAtPeopleList">
          <at-people-list :list="detailData.postFileDetailDtos[swiperIndex].postFileAtPeopleDtos"/>
        </popup>
    </div>
</template>

<script>
import {Swipe, SwipeItem, popup, Loading} from 'vant'
import voiceOff from '@/assets/img/btn_voiceoff@2x.png'
import voiceOn from '@/assets/img/btn_voice@2x.png'
import AtPeopleList from '@/components/popup/AtPeopleList'

export default {
  name: 'Banner',
  props: {
    detailData: {
      default: function () {
        return {}
      },
      type: Object
    }
  },
  components: {Swipe, SwipeItem, popup, AtPeopleList, Loading},
  data () {
    return {
      swiperIndex: 0, // 轮播指示
      trainItemWidth: [], // 装文件对应的时长=>页面上对应的宽度
      action: null, // 用来装定时器
      baseDuration: 5, // 当返回参数duration为0的时候设置(秒)
      duration: 5,
      bannerHeight: 100 + '%',
      muted: true,
      isInViewport: false,
      showAtPeopleList: false
    }
  },
  watch: {
    swiperIndex (newVal, oldVal) {
      // 每次改变swiperIndex都需要重置currentVideo
      this.currentVideo = null
      if (newVal > oldVal) {
        this.swipeleft()
      } else {
        this.swiperight()
      }
      this.duration = this.detailData.postFileDetailDtos[newVal].duration || this.baseDuration
      this.autoplay(this.duration)
      this.$emit('deliverSwiperIndex', newVal)
      if (this.detailData.postFileDetailDtos[oldVal].type === 1) {
        this.$refs[`myVideo${oldVal}`][0].pause()
        this.$refs.playIcon[oldVal].style.display = 'block'
        this.detailData.postFileDetailDtos[oldVal].isPlaying = false
      }
    },
    detailData: {
      handler (val) {
        if (!val.postFileDetailDtos || !val.postFileDetailDtos.length) { return }
        this.minHeightFn(val.postFileDetailDtos)
        this.segmentDuration() // 通过duration设置小火车的宽度
        this.duration = this.detailData.postFileDetailDtos[0].duration || this.baseDuration
        this.detailData.postFileDetailDtos.forEach(item => {
          item.isPlaying = false
        })
      },
      immediate: true
    },
    isInViewport (val) {
      if (val) {
        this.autoplay(this.duration)
      }
    }
  },
  created () {
    window.addEventListener('scroll', this.scrollHandle, true)
    this.$nextTick(() => {
      const offset = this.$refs.banner.getBoundingClientRect()
      const offsetTop = offset.top
      const offsetHeight = offset.height
      // 完全进入可视区域
      if (offsetTop && offsetTop + offsetHeight < window.innerHeight) {
        this.isInViewport = true
      }
    })
  },
  methods: {
    changeFn (val) {
      this.swiperIndex = val
    },
    changeIcon (e) { // 切换声音icon
      this.muted = !this.muted
      this.$refs.volumnIcon.style.background = `url(${this.muted ? voiceOff : voiceOn}) 0 0 no-repeat /100% 100%`
    },
    tagIconClick (index) {
      // let flag = this.$refs.hoverTagContainer[index].style.display
      // this.$refs.hoverTagContainer[index].style.display = flag.includes('none') ? 'block' : 'none'
      this.showAtPeopleList = true
    },
    segmentDuration () { // 获得每段轨道的长度
      let totalDuration = 0
      let trainWidth = ''
      this.detailData.postFileDetailDtos.forEach(item => {
        totalDuration += item.duration || this.baseDuration
      })
      this.detailData.postFileDetailDtos.forEach(item => {
        trainWidth = item.duration ? (item.duration / totalDuration) : (this.baseDuration / totalDuration)
        this.trainItemWidth.push(trainWidth)
      })
    },
    autoplay (duration) { // 文件自动播放
      duration = duration || this.baseDuration
      if (this.currentVideo) {
        this.duration = this.currentVideo.duration
        duration = this.duration
      }
      let requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame
      let cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame
      this.start = null
      this.actionWidth = (timestamp) => {
        this.start = this.start || timestamp
        let progress = this.currentVideo ? this.currentVideo.currentTime * 1000 : (timestamp - this.start)
        if (this.$refs.trainAction[this.swiperIndex]) {
          this.$refs.trainAction[this.swiperIndex].style.width = progress / duration / 1000 * 100 + '%'
        }
        if (progress / 1000 <= duration) {
          requestAnimationFrame(this.actionWidth)
        } else {
          cancelAnimationFrame(this.action)
          return false
        }
      }
      this.action = requestAnimationFrame(this.actionWidth)
    },
    swipeleft () { // 左滑
      if (this.trainItemWidth.length <= 1) { return }
      this.$refs.trainAction.forEach((item, index) => {
        if (this.swiperIndex > index) {
          item.style.width = 100 + '%'
        }
      })
    },
    swiperight () { // 右滑
      if (this.trainItemWidth.length <= 1) { return }
      this.$refs.trainAction.forEach((item, index) => {
        if (this.swiperIndex < index) {
          item.style.width = 0
        }
      })
    },
    minHeightFn (fileList) {
      const radio = []
      const maxRadio = 1440 / 1080 // 此处是高比宽
      // const minRadio = 9 / 16
      fileList.forEach((item, index) => {
        if (item.imageWidth && item.imageHeight) {
          let temp = item.imageHeight / item.imageWidth
          if (temp > maxRadio) {
            temp = maxRadio
          }
          radio.push(temp)
        } else {
          radio.push(1.0)
        }
      })
      this.bannerHeight = Math.max(...radio) * 100 + '%'
    },
    playOrStopVideo () {
      if (!this.detailData.postFileDetailDtos[this.swiperIndex].type) { return false }
      this.currentVideo = this.$refs[`myVideo${this.swiperIndex}`][0]
      this.videoContainer = this.$refs.videoContainer[this.swiperIndex]
      this.detailData.postFileDetailDtos[this.swiperIndex].isPlaying = !this.detailData.postFileDetailDtos[this.swiperIndex].isPlaying
      if (this.detailData.postFileDetailDtos[this.swiperIndex].isPlaying) {
        this.playFn()
      } else {
        this.pauseFn()
      }
    },
    playFn () {
      this.currentVideo.play()
      this.$refs.playIcon[this.swiperIndex].style.display = 'none'
      // 点击播放重新加载
      this.autoplay(this.duration)
    },
    pauseFn () {
      let cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame
      cancelAnimationFrame(this.action)
      this.currentVideo.pause()
      this.$refs.playIcon[this.swiperIndex].style.display = 'block'
    },
    scrollThrottle () {
      if (!this.$refs.banner) { return false }
      const offset = this.$refs.banner.getBoundingClientRect()
      const offsetTop = offset.top
      const offsetBottom = offset.bottom
      const offsetHeight = offset.height
      // 完全进入可视区
      if (offsetTop && offsetTop + offsetHeight < window.innerHeight) {
        // console.log('完全进入可视区')
        this.isInViewport = true
      }
      // 进入可视区域
      if (offsetTop <= window.innerHeight && offsetBottom >= offsetHeight - 150) {
        // console.log('进入可视区域')
      } else {
        // console.log('移出可视区域')
        this.isInViewport = false
        // let cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame
        // cancelAnimationFrame(this.action)
        if (this.currentVideo) {
          this.detailData.postFileDetailDtos[this.swiperIndex].isPlaying = false
          this.pauseFn()
        }
      }
    },
    hasVideo () {
      const index = this.detailData.postFileDetailDtos.findIndex(item => item.type === 1)
      return index >= 0
    },
    scrollHandle () {
      this.scrollThrottle()
    },
    changeIndex (val) {
      const len = this.detailData.postFileDetailDtos.length - 1
      let index = this.swiperIndex
      if (val === -1) { // 前面一页
        index === 0 ? index = len : index--
      } else if (val === 1) { // 后面一页
        index === len ? index = 0 : index++
      }
      this.$refs.mySwiper.swipeTo(index)
    }
    // imagePreviewFn () {
    //   const images = this.detailData.postFileDetailDtos.map(item => item.imageUrl)
    //   ImagePreview({
    //     images,
    //     maxZoom: 10,
    //     'lazy-load': true
    //   })
    // }
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.scrollHandle)
  }
}
</script>

<style scoped>
/* banner */
#banner img{
    object-fit: contain;
}
.post-banner{
    position: relative;
    width:100%;
    height: 0;
    padding-bottom: 100%;
}
.post-banner .banner-item{
    position:absolute;
    width:100%;
    height:100%;
}
.video-player{
    width: 100%;
    height: 100%;
    object-fit: contain;
}
/* 用户悬挂标签 */
.hover-tag{
    position: absolute;
    top:1.5rem;
    left:1.5rem;
    background-color: rgba(0,0,0,.4);
    border-radius: 0.1rem;
    animation: shining 2s alternate infinite;
}
.hover-tag .tag-text{
    padding:0.15rem 0.2rem;
    font-size: 0.28rem;
    box-sizing: border-box;
    color:#fff;
}
.hover-tag::before{
    content: "";
    position: absolute;
    bottom:100%;
    left:50%;
    transform: translateX(-50%);
    border-bottom: 0.2rem solid rgba(0,0,0,.3);
    border-right: 0.2rem solid transparent;
    border-left: 0.2rem solid transparent;
}
/* 轮播小火车 */
.post-banner .banner-train{
    position: absolute;
    top:0;
    width:100%;
    height:0.4rem;
    display: flex;
    justify-content:flex-start;
    background: linear-gradient(to bottom,rgba(38,38,45,0.3),rgba(39,42,48,0.0));
    z-index:1;
}
.post-banner .banner-train .train-item{
    height: 0.06rem;
    background-color: rgba(255,255,255,.4);
    margin-right: 0.04rem;
    overflow: hidden;
}
.post-banner .banner-train .train-item:last-of-type{
    margin-right: 0;
}
.banner-train .train-item .action{
    height:100%;
    width:0;
    background-color: rgba(255,255,255,.6);
}
.post-banner .banner-icons{
    position: absolute;
    bottom: 0.14rem;
    z-index: 1;
}
.post-banner .banner-icons div{
    float: left;
}
.post-banner .banner-icons .volumn{
    width:0.6rem;
    height:0.6rem;
    border-radius: 50%;
    background-position:0 0;
    background-repeat:no-repeat;
    background-image: url(../assets/img/btn_voiceoff@2x.png);
    background-size: cover;
    margin-left: 0.2rem;
}
.post-banner .banner-icons .tagIcon{
    width:0.6rem;
    height:0.6rem;
    border-radius: 50%;
    background-position:0 0;
    background-repeat:no-repeat;
    background-image: url(../assets/img/ic_at@2x.png);
    background-size: cover;
    margin-left: 0.2rem;
}
.playIcon{
  position: absolute;
  top:50%;
  left: 50%;
  transform: translate(-50%,-50%);
  font-size: 1.5rem;
  color: rgba(255,255,255,.8);
  z-index: 2;
}
.fileContainer{
  position: relative;
  width: 100%;
  height: 100%;
}
/* canvas */
.fileCover{
  position:absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}
/* .pagination{
  position: absolute;
  top: 50%;
  width: 100%;
}
.pagination .prev,.pagination .next{
  position: absolute;
  transform: translateY(-50%);
  font-size: .5rem;
  color: rgb(255,255,255,.6);
}
.pagination .prev{
  left:.2rem
}
.pagination .next{
  right:.2rem
} */
/* .hoverTagContainer{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
} */
/* @media screen and (max-width:1024px) {
  .pagination{
    display: none;
  }
} */
</style>
