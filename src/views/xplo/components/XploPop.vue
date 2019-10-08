<template>
    <div class="chatroom" ref="chatroom">
      <div
      class="fixed"
      ref="fixed"
      @touchstart = "touchstartFn"
      @touchmove = "touchmoveFn"
      @touchend = "touchendFn"
      >
        <slot name="icon"/>
        <!-- 展示任意门和图标 -->
        <div class="searchDoor">
          <div class="locationDoor" @click="searchPlaces">
            <Search :clear="false" placeholder="Where do you want to go?" v-model="placename" @blur="onBlur"/>
          </div>
          <div class="typeIcon" v-show="!showPlaces" @click="randomCountry"></div>
          <div class="typeIcon cancelBtn" v-show="showPlaces" @click="showPlaces = false">Cancel</div>
        </div>
        <!-- 展示聊天室列表 -->
        <ul class="TabList" v-show="isChatRoom && !showPlaces">
          <li class="tab" :class="{'active':active===0}" @click="active = 0">Channels</li>
          <!-- <li class="tab" :class="{'active':active===1}" @click="active = 1">Private</li>
          <li class="tab" :class="{'active':active===2}" @click="active = 2">Saved</li> -->
        </ul>
        <div class="label" v-show="showPlaces">
          {{placename?'Search result':'Recently viewed'}}
        </div>
      </div>
      <div class="list" v-show="isChatRoom && !showPlaces">
        <!-- trending tags -->
        <TrendingTags :tagList="tagList" :country="country"/>
        <!-- chatrooms -->
        <ChatRooms v-show="active===0" :recommendList="recommendList"/>
      </div>
      <div class="list" v-show="showPlaces">
        <!-- 此处展示search place -->
        <!-- 此处显示历史记录 -->
        <div class="loactionContainer" v-show="!placename">
          <slot name="viewedLocations"></slot>
        </div>
        <!-- 此处显示搜索记录 -->
        <div class="loactionContainer" v-show="placename">
          <slot name="resultLocations"></slot>
        </div>
      </div>
    </div>
</template>

<script>
import icChatroom from '@/assets/img/ic_chatroom@2x.png'
import icNearpost from '@/assets/img/ic_nearby@2x.png'
import dialogMix from '@/mixins/downloadAppMix'
import ChatRooms from './ChatRooms'
import TrendingTags from './TrendingTags'
import Search from '@/components/SearchInput'

export default {
  name: 'ChatRoomPop',
  mixins: [dialogMix],
  components: {ChatRooms, Search, TrendingTags},
  props: {
    recommendList: {
      default: function () {
        return []
      },
      type: Array
    },
    up: {
      default: false,
      type: Boolean
    },
    finished: {
      default: false,
      type: Boolean
    },
    tagList: Array,
    country: {
      default: function () {
        return {
          country: 'China',
          code: 'cn'
        }
      },
      type: Object
    }
  },
  data () {
    return {
      active: 0,
      isChatRoom: true,
      showPlaces: false,
      icChatroom: icChatroom,
      icNearpost: icNearpost,
      placename: ''
    }
  },
  mounted () {
    this.changeHeight()
  },
  methods: {
    changeHeight () {
      this.fixed = this.$refs.fixed
      this.fixedHeight = this.fixed.offsetHeight
      this.fixed.parentNode.style.paddingTop = this.fixedHeight + 'px'
    },
    randomCountry () {
      console.log('randomCountry')
      this.$emit('change', true)
    },
    changeType () {
      this.isChatRoom = !this.isChatRoom
    },
    searchPlaces () {
      this.showPlaces = true
      setTimeout(() => {
        this.changeHeight()
      })
    },
    hidePlaceList () {
      this.showPlaces = false
      setTimeout(() => {
        this.changeHeight()
      })
    },
    onBlur () {
      if (this.showPlaces && this.placename) {
        this.$emit('blur', this.placename)
      }
    },
    touchstartFn (e) {
      this.y = e.changedTouches[0].pageY
      this.$emit('start', this.y)
    },
    touchmoveFn (e) {
      this.slideY = this.y - e.changedTouches[0].pageY
      this.$emit('move', this.slideY)
    },
    touchendFn (e) {
      this.$emit('end', this.slideY)
    }
  }
}
</script>

<style lang="stylus" scoped>
.chatroom
    position relative
    height 100%
    background-color rgba(224,224,224,.9);
    padding 0 0.2rem 0
    box-sizing border-box
    overflow hidden
.fixed
    position absolute
    top 0
    left 0
    width 100%
    padding 0 0.2rem
    box-sizing border-box
    overflow: hidden;

.searchDoor
    display flex
    align-items center
    justify-content: space-between

.locationDoor
    width 75%
    height 0.68rem;
    border-radius 0.34rem;
    background-color rgba(255,255,255,0.8)
    overflow hidden

.typeIcon
    display flex
    justify-content center
    align-items center
    width 20%;
    height 0.68rem
    border-radius 0.34rem
    background-repeat no-repeat
    background-position center
    background-image url(../../../assets/img/ic_change@2x.png)
    background-size contain
    background-color #fff

  .cancelBtn
    font-size 0.28rem
    color rgb(153,153,153)
    background-color rgba(255,255,255,.5)

.TabList
    margin-top 0.3rem
    width 52%
    display flex
    justify-content space-between

.tab{
    font-family SFUIDisplay-Medium
    padding 0.1rem 0.24rem
    margin-right 0.26rem
    border-radius 0.3rem
    color rgb(153,153,153)
    font-size 0.28rem
    background-color rgba(255,255,255,0.8)
}
.tab.active{
    color #fff
    background-color rgb(26,140,253)
}
.list{
    height 100%
    overflow auto
}
.seeMore
    height 0.4rem
    display flex
    align-items center
    justify-content center
    font-size 0.3rem
    color rgb(102,102,102)
    background-color rgb(234,234,234)
    border-radius 0 0 0.24rem 0.24rem
.seeMore .icArrowDown
    width 0.28rem
    height 0.16rem
    background url(../../../assets/img/icArrowDown@2x.png) 0 0 no-repeat
    background-size contain

.nearby
    display flex
    padding 0.3rem 0 0.2rem

.label
    font-family SFUIDisplay-Medium
    padding 0.2rem 0
    font-size 0.24rem
    color rgb(153,153,153)

.loactionContainer::after
    content ""
    display block
    width 100%
    height 1.2rem
    height: calc(1.2rem + constant(safe-area-inset-bottom));
    height: calc(1.2rem + env(safe-area-inset-bottom));
</style>
