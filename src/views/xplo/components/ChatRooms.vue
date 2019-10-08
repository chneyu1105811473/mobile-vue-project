<template>
  <div class="chatRoomList">
    <div class="trendingTab">
      <span class="title">XPLO Channels</span>
    </div>
    <div class="trendingChats">
      <div class="trendingItem" v-for="(item,index) in recommendList" :key="item.id?item.id:index" @click="showDialogFn">
        <div class="icon" :style="{'background':item.imageDto?`url(${item.imageDto.src})`:'#'+item.categoryBgColor}">
          <img v-if="!item.imageDto" :src="item.icon|formateIcon" :alt="item.poiName">
        </div>
        <div class="chatRoomName">
          <div class="name van-ellipsis">
            {{item.eventFlag?item.eventName:item.poiName|formateContent('poi',true)}}
          </div>
          <div class="eventIcon" v-show="item.eventFlag"></div>
          <!-- <div class="hotIcon" v-show="item.contentNum > 100"></div> -->
          <!-- <div class="hotIcon" v-show="item.contentNum">
            <div class="iconfont">&#xe65a;</div>
            <div class="num">{{item.contentNum|formateNum}}</div>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dialogMix from '@/mixins/downloadAppMix'

export default {
  name: 'ChatRoomList',
  mixins: [dialogMix],
  filters: {
    formateContent (val, type, boolean) {
      // boolean表示是否是推荐的，true 表示是推荐的，false表示不是附近的
      if (boolean) {
        if (type.includes('location')) {
          return val.length > 30 ? val.slice(0, 30) + '...' : val
        } else if (type.includes('poi')) {
          return val.length > 20 ? val.slice(0, 20) + '...' : val
        }
      } else {
        if (type.includes('location')) {
          return val.length > 40 ? val.slice(0, 40) + '...' : val
        } else if (type.includes('poi')) {
          return val.length > 30 ? val.slice(0, 30) + '...' : val
        }
      }
    },
    formateIcon (val) {
      // foursquare的图片链接需要添加尺寸才能正常显示
      // 尺寸选择如下：32   44   64   88
      // 此处与ios一致，选择 64
      return val.slice(0, -4) + '44' + val.slice(-4)
    }
  },
  props: {
    recommendList: {
      default: function () {
        return []
      },
      type: Array
    }
  },
  methods: {
    showDialogFn () {
      const options = {
        title: 'Chatrooms',
        message: 'Download the app,\nthen enter the chatrooms nearby.',
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
        closeOnClickOverlay: true,
        className: 'lessPadding'
      }
      this.showDialog(options)
    }
  }
}
</script>

<style lang="stylus" scoped>
.chatRoomList
    width 100%
.chatRoomList::after
    content ""
    width 100%
    height 1.2rem;
    height: calc(1.2rem + constant(safe-area-inset-bottom));
    height: calc(1.2rem + env(safe-area-inset-bottom));
    display block
.icon
    margin-right 0.15rem
    min-width 0.7rem
    width 0.7rem
    height 0.7rem
    padding 0.1rem
    box-sizing border-box
    border-radius 100%
    background rgb(255,169,95)
    overflow hidden
.icon img
    object-fit contain

.chatRoomName
    height 0.6rem
    display flex
    align-items center
    font-size 0.28rem
    color rgb(51,51,51)

.trendingTab
    display flex
    align-items center
    margin-top 0.26rem
.trendingTab::before
    content ''
    margin-right 0.1rem
    width 0.06rem
    height 0.26rem
    border-radius 0.02rem
    background-color rgb(26,140,253)
.trendingTab .title
    font-family SFUIDisplay-Medium
    font-weight bold
    margin-right 0.2rem
    font-size 0.28rem
    color rgb(51,51,51)

.trendingChats
    display flex
    flex-wrap wrap
.trendingItem
    width 49%
    height 2.6rem
    margin-top 0.16rem
    padding 0.12rem
    border-radius 0.1rem
    background #fff
    box-sizing border-box
    overflow hidden
.trendingItem:nth-child(2n+1)
    margin-right 2%
.trendingItem .icon
    height 1.8rem
    width 100%
    border-radius 0.1rem
    background #ccc
    background-size cover
.trendingItem .icon img
    object-fit none
.trendingItem .locationName
    margin-top 0

.hotIcon
    display flex
    align-items center
    background-color rgb(255,95,95)
    font-size 0.24rem
    padding 0 0.04rem
    border-radius 0.2rem
.hotIcon .iconfont
    color #fff
    font-size 0.26rem
.hotIcon .num
    transform-origin bottom left
    transform scale(.8)
    color #fff
</style>
