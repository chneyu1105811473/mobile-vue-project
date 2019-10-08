<template>
  <tabbar
  :safe-area-inset-bottom="true"
  :border="false"
  :z-index="zIndex"
  v-model="action"
  active-color="#fff"
  inactive-color="transparent"
  class="footerTab"
  >
      <tabbar-item to="/myFeed">
          <span class="iconfont text">&#xe7f0;</span>
          <img
          slot="icon"
          slot-scope="props"
          :src="myFeed.normal"
          >
      </tabbar-item>
       <tabbar-item :to="{name: 'Trending'}">
          <span class="iconfont text">&#xe7f0;</span>
          <img
          slot="icon"
          slot-scope="props"
          :src="trending.normal"
          >
       </tabbar-item>
      <tabbar-item to="/xplo">
          <span class="iconfont text">&#xe7f0;</span>
          <img
          slot="icon"
          slot-scope="props"
          :src="xplo.normal"
          >
      </tabbar-item>
      <tabbar-item to="/message">
          <span class="iconfont text">&#xe7f0;</span>
          <img
          slot="icon"
          slot-scope="props"
          :src="message.normal"
          >
      </tabbar-item>
      <tabbar-item @click.native="goProfilePage" :class="{'dot':unRead}">
          <span class="iconfont text">&#xe7f0;</span>
          <img
          slot="icon"
          slot-scope="props"
          :src="profile.normal"
          >
      </tabbar-item>
  </tabbar>
</template>
<script>
import {Tabbar, TabbarItem, Icon} from 'vant'
import xploIcon from '@/assets/img/icIndex@2x.png'
import TrendingIcon from '@/assets/img/icSearch@2x.png'
import ProfileIcon from '@/assets/img/icMine@2x.png'
import Message from '@/assets/img/icMessage@2x.png'
import FeedIcon from '@/assets/img/icFeed@2x.png'

export default {
  name: 'FooterTab',
  props: {
    currentTab: {
      type: Number,
      default: 0
    },
    zIndex: {
      default: 99,
      type: Number
    }
  },
  components: {Tabbar, TabbarItem, Icon},
  data () {
    return {
      xplo: {
        normal: xploIcon
      },
      trending: {
        normal: TrendingIcon
      },
      message: {
        normal: Message
      },
      myFeed: {
        normal: FeedIcon
      },
      profile: {
        normal: ProfileIcon
      }
    }
  },
  activated () {
    this.$store.state.currentTab = this.currentTab
  },
  computed: {
    action: {
      get () {
        return this.currentTab
      },
      set (val) {
        this.$store.state.currentTab = val
      }
    },
    userId () {
      return parseInt(localStorage.getItem('id'))
    },
    unRead () {
      // const myAccount = localStorage.getItem('im_accid')
      // const isUnread = this.$store.state.sessionsList.some(item => item.unread)
      // const isMe = this.$store.state.sessionsList.some(item => item.to.includes(myAccount))
      return this.$store.state.sessionsList.some(item => item.unread)
    }
  },
  methods: {
    goProfilePage () {
      if (this.userId) {
        this.$router.push({
          name: 'ProfileDetail',
          params: {
            userId: this.userId
          }
        })
      } else {
        this.$router.push('/login')
      }
    }
  }
}
</script>
<style scoped>
.footerTab{
  height:1.2rem;
}
.footerTab img{
  margin-top: 0.4rem;
  width:0.62rem;
  height: 0.54rem;
  object-fit: contain;
}
.van-tabbar{
  background-color:transparent;
  background: linear-gradient(to bottom,rgba(74,77,87,0.0),rgb(24,25,28));
}
.text{
  font-size: 0.4rem;
}
.dot{
  position: relative;
}
.dot::after{
  position: absolute;
  top: .2rem;
  right: 30%;
  width: .16rem;
  height: .16rem;
  background-color: #f44;
  border-radius: 100%;
  content: "";
}
@media screen and (min-width:1024px) {
  .footerTab{
    display:none;
  }
}
</style>
