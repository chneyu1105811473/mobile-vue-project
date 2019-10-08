<template>
  <div>
    <div
    class="sessionItem"
    v-show="type.includes('friend')||type.includes('me')"
    @click="goPrivateChat(session.xploUserInfo)">
      <div class="userInfo" @click.stop="goProfileDetail(session.xploUserInfo)">
        <div class="icon">
            <img v-lazy="session.xploUserInfo.avatar" alt="icon">
        </div>
        <div class="unReadNum" v-show="type.includes('friend')&&session.unread">
          {{session.unread|formateNum}}
        </div>
      </div>
      <div class="msg">
        <div class="msgInfo">
          <div class="username">
            {{session.xploUserInfo.nick|textFormate}}
          </div>
          <div class="lastMsg" v-if="session.lastMsg.type==='text'">
            {{session.lastMsg.text}}
          </div>
          <div class="lastMsg" v-if="session.lastMsg.file">
            [{{session.lastMsg.file.name}}]
          </div>
          <div class="lastMsg" v-else-if="session.lastMsg.type==='custom'">
            {{session.lastMsg.content|formateContent}}
          </div>
        </div>
        <div class="time">
          {{session.lastMsg.time / 1000|timeAndDate}}
        </div>
      </div>
    </div>

    <div
    class="sessionItem"
    v-show="type.includes('request')"
    >
      <div class="userInfo" @click.stop="goProfileDetail(session.xploUserInfo)">
        <div class="icon">
            <img v-lazy="session.xploUserInfo.avatar" alt="icon">
        </div>
      </div>
      <div class="msg">
        <div class="msgInfo">
          <div class="username">{{session.xploUserInfo.nick|textFormate}}</div>
          <div class="lastMsg">{{session.lastMsg.text|textFormate}}</div>
        </div>
        <div class="msgBtns">
          <div class="btn" @click.stop="acceptFriend">Accept</div>
          <div class="btn" @click.stop="declineFriend">Decline</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SessionItem',
  props: {
    session: {
      default: function () {
        return {}
      },
      type: Object
    }
  },
  data () {
    return {}
  },
  computed: {
    friendsList: {
      get () {
        return this.$store.state.friendsList
      },
      set (val) {
        this.type = val
      }
    },
    type: {
      get () {
        let isInvilid
        let isFriends
        let isMe
        const friends = this.$store.state.friendsList
        const blackList = this.$store.state.blackList
        //   判断是否被拉黑
        if (blackList.length) {
          isInvilid = blackList.some(item => {
            return item.account.includes(this.session.xploUserInfo.account)
          })
        } else {
          isInvilid = false
        }
        //   判断是否是好友
        if (friends.length) {
          isFriends = friends.some(item => {
            return item.account.includes(this.session.xploUserInfo.account)
          })
        }
        //   判断是否是我自己发的
        const accId = localStorage.getItem('im_accid')
        isMe = this.session.lastMsg.from.includes(accId)
        console.log(isMe, this.session.lastMsg.from)
        if (isMe) {
          return 'me'
        } else if (isInvilid) {
          return 'block'
        } else if (isFriends) {
          return 'friend'
        } else {
          return 'request'
        }
      },
      set () {}
    },
    nim () {
      return this.$store.state.nim
    }

  },
  filters: {
    textFormate (val) {
      return val.length > 10 ? val.slice(0, 10) + '...' : val
    },
    formateContent (val) {
      const content = JSON.parse(val)
      return `[${content.data.name}]`
    }
  },
  methods: {
    goPrivateChat (val) {
      const userInfo = {
        icon: val.avatar,
        im_accid: val.account,
        username: val.nick
      }
      this.$store.state.userInfo = userInfo
      this.$router.push({
        name: 'PrivateChat'
      })
    },
    acceptFriend () { // 如果type是friend,则默默自动加为好友
      const _this = this
      this.nim.addFriend({
        account: _this.session.xploUserInfo.account,
        ps: 'Accept',
        done: _this.addFriendDone
      })
    },
    addFriendDone (error, obj) {
      console.log('直接加为好友' + (!error ? '成功' : '失败'))
      if (!error) { // 如果系统信息是添加好友,则手动调用下获取好友接口
        const _this = this
        this.nim.getFriends({
          done: _this.getFriendsDone
        })
      }
    },
    declineFriend () { // 把好友屏蔽，走拉黑逻辑
      const _this = this
      this.nim.addToBlacklist({
        account: _this.session.xploUserInfo.account,
        done: _this.addToBlacklistDone
      })
    },
    addToBlacklistDone (error, obj) {
      console.log('拉黑好友' + (!error ? '成功' : '失败'))
      if (!error) {
        // 再次获取好友
        const _this = this
        this.nim.getFriends({
          done: _this.getFriendsDone
        })
      }
    },
    getFriendsDone (error, friends) {
      console.log('获取好友列表' + (!error ? '成功' : '失败'), error, friends)
      if (!error) {
        this.$store.commit('updateFriendsList', friends)
      }
    },
    goProfileDetail (val) {
      const parames = JSON.parse(val.custom)
      // 若果是好友，则前端主动加好友
      if (this.type.includes('friend')) {
        this.$router.push({
          name: 'ProfileDetail',
          parames
        })
      }
    }
  }
}
</script>

<style scoped>
.sessionItem{
  position: relative;
  padding: 0.1rem .2rem;
  border-bottom: 0.02rem solid #eee;
  display: flex;
  align-items: center;
  font-size: 0.24rem;
}
.userInfo{
  position: relative;
  color: rgb(176,177,185);
}
.icon{
  width: .9rem;
  height: .9rem;
  border-radius: 100%;
  overflow: hidden;
  border:0.01rem solid #eee;
}
.unReadNum{
  position: absolute;
  top: 0;
  right: 0;
  font-size: 0.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 0.36rem;
  height: 0.36rem;
  border-radius: 50%;
  background-color: rgb(250,80,81);
  color: #fff;
}
.msg{
  display: flex;
  width: 100%;
  margin-left: .2rem;
  justify-content: space-between;
}
.msg .username{
  font-family: 'SFUIDisplay-Medium';
  font-weight: bold;
  font-size: 0.28rem;
}
.msg .lastMsg{
  margin-top:0.05rem;
  font-size:0.24rem;
  max-height: 0.8rem;
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.msg .time{
  position: absolute;
  top: 0.2rem;
  right: 0.1rem;
  font-size: 0.24rem;
  transform: scale(.8);
  color: rgb(176,177,185);
}
.msgBtns{
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    display: flex;
}
.msgBtns .btn{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 1rem;
    color: #fff;
    font-size: 0.24rem;
}
.msgBtns .btn:nth-child(1){
    background-color: rgb(66,93,144);
}
.msgBtns .btn:nth-child(2){
    background-color: rgb(241,67,61);
}
</style>
