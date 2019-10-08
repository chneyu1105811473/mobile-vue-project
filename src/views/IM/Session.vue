<template>
  <div class="sessionList">
    <!-- header -->
    <div class="header" ref="header">
      <div class="left">
        <div class="iconfont goback" @click="goBack">&#xe774;</div>
        <div class="title">Recent sessions</div>
      </div>
      <div class="right iconfont" @click="goFriendsList">&#xe60d;</div>
    </div>
    <!-- information -->
    <div class="list">
      <!-- 聊天会话 -->
      <template v-for="item in sessionsList">
        <session-item :key="item.updateTime" :session="item"/>
      </template>
    </div>
    <!-- EmptyPage -->
    <empty-page v-if="isEmpty"/>
  </div>
</template>

<script>
import {List} from 'vant'
import SessionItem from './components/SessionItem'
import EmptyPage from '@/components/EmptyPage'

export default {
  name: 'SessionList',
  components: {List, SessionItem, EmptyPage},
  data () {
    return {}
  },
  computed: {
    sessionsList () {
      return this.$store.state.sessionsList
    },
    isEmpty () {
      return !(this.$store.state.sessionsList.length)
    },
    sysNotices () {
      return this.$store.state.sysNotices
    },
    nim () {
      return this.$store.state.nim
    }
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
    goFriendsList () {
      this.$router.push({
        name: 'IMFriends'
      })
    },
    getMoreSessions () {
      const _this = this
      this.nim.getLocalSessions({
        lastSessionId: _this.lastSessionId,
        limit: 10,
        done: _this.getLocalSessionsDone
      })
    }
  }
}
</script>

<style scoped>
.sessionList{
  height:100%;
}
.header{
  position:fixed;
  top:0;
  margin: 0 auto;
  width:100%;
  height: 1rem;
  font-size: 0.4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgb(45,46,51);
  color: #fff;
}
.right{
  margin-right: .2rem;
  font-size:0.4rem;
}
.left{
  display: flex;
  align-items: center;
}
.goback{
  font-size: 0.6rem;
  margin-right: .2rem;
  font-weight: bold;
}
.sysMsgs{
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f1f1f1;
  padding: .3rem .2rem;
}

.dot{
    position: relative;
}
.dot::after{
    position: absolute;
    top: 0;
    right: -.2rem;;
    width: .16rem;
    height: .16rem;
    background-color: #f44;
    border-radius: 100%;
    content: "";
}
.moreSession{
  cursor:pointer;
  display:flex;
  font-size:0.26rem;
  justify-content:center;
  align-items:center;
  color:#ccc;
}
.moreSession:hover{
  color:#999;
}
</style>
