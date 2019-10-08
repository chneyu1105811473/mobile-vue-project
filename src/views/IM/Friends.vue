<template>
  <div class="friends">
    <!-- header -->
    <div class="header" ref="header">
      <div class="iconfont goback" @click="goBack">&#xe774;</div>
      <div class="title">Private</div>
    </div>
    <!-- list -->
    <template v-for="item in friends">
      <div :key="item.id" class="friendItem" @click="privateChat(item)">
        <div class="userIcon">
          <img v-lazy="item.icon" alt="icon">
        </div>
        <div class="name">
          <div class="username">{{item.username}}</div>
          <div class="nickname">{{item.nickname}}</div>
        </div>
        <div :class="{'userStatus':true,'dot':isOnline}"></div>
      </div>
    </template>
    <!-- loading -->
    <loading v-show="isLoading"/>
    <!-- EmptyPage -->
    <empty-page v-if="isEmpty"/>
  </div>
</template>

<script>
import {Toast} from 'vant'
import { getPrivateChatRecommends } from '@/api/api'
import EmptyPage from '@/components/EmptyPage'
import Loading from '@/components/Loading'

export default {
  name: 'IMFriends',
  components: {EmptyPage, Loading},
  data () {
    return {
      friends: [],
      userInfo: null,
      isOnline: true,
      isLoading: false,
      isEmpty: false
    }
  },
  watch: {
    friends (val) {
      this.isEmpty = !(val.length)
    }
  },
  created () {
    this.getFriendsRecommend()
  },
  mounted () {
    const header = this.$refs.header
    header.parentNode.style.paddingTop = header.offsetHeight + 'px'
    header.parentNode.style.boxSizing = 'border-box'
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    getFriendsRecommend () {
      this.isLoading = true
      getPrivateChatRecommends().then(res => {
        this.isLoading = false
        if (res.data.code === '200') {
          this.friends = res.data.result.resultData
        } else {
          Toast({
            message: res.data.message
          })
        }
      }).catch(() => {
        Toast('Oops,some thing went wrong.')
        this.isLoading = false
      })
    },
    privateChat (userInfo) {
      this.$store.state.userInfo = Object.assign({}, userInfo)
      this.$router.push({
        name: 'PrivateChat'
      })
    }
  }
}
</script>

<style scoped>
.header{
  position:fixed;
  width:100%;
  top:0;
  margin: 0 auto;
  font-family:'SFUIDisplay-Medium';
  height: 1rem;
  font-size: 0.4rem;
  display: flex;
  align-items: center;
  background-color: rgb(45,46,51);
  color: #fff;
  font-weight: bold;
}
.goback{
  font-size: 0.6rem;
  margin-right: .2rem;
  font-weight: bold;
}
.friendItem{
  display: flex;
  align-items: center;
  padding: 0.2rem;
  border-bottom:0.02rem solid #eee;
}
.userIcon{
  margin-right: .2rem;
  width: 0.64rem;
  height: 0.64rem;
  background-color: #ccc;
  border-radius: 50%;
  overflow: hidden;
}
.username{
  font-family:'SFUIDisplay-Medium';
  font-size: 0.28rem;
}
.nickname{
  font-family:'SFUIDisplay-Regular';
  font-size: 0.24rem;
  color: rgb(176,177,185);
}
</style>
