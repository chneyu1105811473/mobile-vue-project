import { Toast } from 'vant'

export default {
  data () {
    return {
      data: {}
    }
  },
  computed: {
    options () {
      return {
        // 初始化sdk
        appKey: this.$store.state.im_appKey[process.env.ENV_CONFIG],
        account: localStorage.getItem('im_accid'),
        token: localStorage.getItem('im_token'),
        db: true,
        syncFriends: true,
        onconnect: this.onConnect,
        ondisconnect: this.onDisconnect,
        onwillreconnect: this.onWillReconnect,
        // 用户名片
        // onmyinfo: this.onMyInfo,
        // onupdatemyinfo: this.onUpdateMyInfo,
        // onusers: this.onUsers,
        // onupdateuser: this.onUpdateUser,
        // 用户关系
        onblacklist: this.onBlacklist,
        onsyncmarkinblacklist: this.onMarkInBlacklist,
        onmutelist: this.onMutelist,
        onsyncmarkinmutelist: this.onMarkInMutelist,
        // 好友关系
        onfriends: this.onFriends,
        onsyncfriendaction: this.onSyncFriendAction,
        // 会话
        onsessions: this.onSessions,
        onupdatesession: this.onUpdateSession,
        // 系统通知
        onofflinesysmsgs: this.onOfflineSysMsgs,
        onsysmsg: this.onSysMsg,
        onupdatesysmsg: this.onUpdateSysMsg,
        onsysmsgunread: this.onSysMsgUnread,
        onupdatesysmsgunread: this.onUpdateSysMsgUnread,
        onofflinecustomsysmsgs: this.onOfflineCustomSysMsgs,
        oncustomsysmsg: this.onCustomSysMsg,
        // 广播消息
        onbroadcastmsg: this.onBroadcastMsg,
        onbroadcastmsgs: this.onBroadcastMsgs,
        // 同步完成
        onsyncdone: this.onSyncDone
      }
    }
  },
  created () {
    // 如果有IM账号,才进行注册IM
    this.$nextTick(() => {
      if (localStorage.getItem('im_accid')) {
        this.nim = this.$SDK.NIM.getInstance(this.options)
      }
    })
  },
  methods: {
    onConnect () {
      console.log('IM connect')
    },
    onDisconnect (obj) {
      Toast({
        message: 'Oops,Instant Messaging disconnect!'
      })
    },
    onWillReconnect (obj) {
      console.log('IM will reconnect: ' + obj.retryCount)
    },
    // onMyInfo (user) {
    //   console.log('收到我的名片', user)
    // },
    // onUpdateMyInfo (user) {
    //   console.log('我的名片更新了', user)
    // },
    // onUsers (users) {
    //   console.log('拿取用户信息', users)
    //   // this.data.users = this.nim.mergeUsers(this.data.users, users)
    // },
    // onUpdateUser (user) {
    //   // this.data.users = this.nim.mergeUsers(this.data.users, user)
    //   console.log('更新用户信息', user)
    // },
    onBlacklist (blacklist) {
      console.log('收到黑名单', blacklist)
      this.data.blacklist = this.nim.mergeRelations(this.data.blacklist, blacklist)
      this.data.blacklist = this.nim.cutRelations(this.data.blacklist, blacklist.invalid)
      this.refreshBlacklistUI()
    },
    onMarkInBlacklist (obj) {
      console.log(obj)
      console.log(obj.account + '被你' + (obj.isAdd ? '加入' : '移除') + '黑名单')
      if (obj.isAdd) {
        this.addToBlacklist(obj)
      } else {
        this.removeFromBlacklist(obj)
      }
    },
    addToBlacklist (obj) {
      this.data.blacklist = this.nim.mergeRelations(this.data.blacklist, obj.record)
      this.refreshBlacklistUI()
    },
    removeFromBlacklist (obj) {
      this.data.blacklist = this.nim.cutRelations(this.data.blacklist, obj.record)
      this.refreshBlacklistUI()
    },
    refreshBlacklistUI () {
      // 拉黑
      this.$store.commit('updateBlackList', this.data.blacklist)
    },
    onMutelist (mutelist) {
      console.log('收到静音列表', mutelist)
    },
    onMarkInMutelist (obj) {
      console.log(obj.account + '被你' + (obj.isAdd ? '加入' : '移除') + '静音列表', obj)
    },
    onFriends (friends) {
      console.log('总部🙅‍♂️收到好友列表', friends)
      this.data.friends = this.nim.mergeFriends(this.data.friends, friends)
      this.data.friends = this.nim.cutFriends(this.data.friends, friends.invalid)
      this.$store.commit('updateFriendsList', this.data.friends)
    },
    onSyncFriendAction (obj) {
      console.log('总部🙅‍♂️更新好友操作', obj)
      switch (obj.type) {
        case 'addFriend':
          console.log('你在其它端直接加了一个好友' + obj.account + ', 附言' + obj.ps)
          this.onAddFriend(obj.friend)
          break
        case 'applyFriend':
          console.log('你在其它端申请加了一个好友' + obj.account + ', 附言' + obj.ps)
          break
        case 'passFriendApply':
          console.log('你在其它端通过了一个好友申请' + obj.account + ', 附言' + obj.ps)
          this.onAddFriend(obj.friend)
          break
        case 'rejectFriendApply':
          console.log('你在其它端拒绝了一个好友申请' + obj.account + ', 附言' + obj.ps)
          break
        case 'deleteFriend':
          console.log('你在其它端删了一个好友' + obj.account)
          this.onDeleteFriend(obj.account)
          break
        case 'updateFriend':
          console.log('你在其它端更新了一个好友', obj.friend)
          this.onUpdateFriend(obj.friend)
          break
      }
    },
    onAddFriend (friend) {
      this.data.friends = this.nim.mergeFriends(this.data.friends, friend)
      this.refreshFriendsUI()
    },
    onDeleteFriend (account) {
      this.data.friends = this.nim.cutFriendsByAccounts(this.data.friends, account)
      this.refreshFriendsUI()
    },
    onUpdateFriend (friend) {
      this.data.friends = this.nim.mergeFriends(this.data.friends, friend)
      this.refreshFriendsUI()
    },
    refreshFriendsUI () {
      // 刷新界面
      this.$store.commit('updateFriendsList', this.data.friends)
    },
    onSessions (sessions) {
      console.log('获得会话消息', sessions)
      sessions.forEach(item => {
        this.mixUserInfo(item)
      })
    },
    onUpdateSession (session) {
      console.log('更新会话消息', session)
      this.mixUserInfo(session)
    },
    mixUserInfo (session) {
      let account
      if (session.lastMsg.flow.includes('out')) {
        account = session.lastMsg.to
      } else {
        account = session.lastMsg.from
      }
      this.nim.getUsers({
        accounts: [account],
        done: (error, users) => {
          if (!error) {
            console.log('user', users[0])
            session.xploUserInfo = users[0]
            this.data.sessions = this.nim.mergeSessions(this.data.sessions, session)
            this.updateSessionsUI()
          }
        }
      })
    },
    updateSessionsUI () {
    // 刷新界面
      this.$store.commit('updateSessions', this.data)
    },
    // notice
    onOfflineSysMsgs (sysMsgs) {
      console.log('收到离线系统通知', sysMsgs)
      this.pushSysMsgs(sysMsgs)
    },
    onUpdateSysMsg (sysMsg) {
      console.log('更新离线消息', sysMsg)
      this.pushSysMsgs(sysMsg)
    },
    pushSysMsgs (sysMsgs) {
      console.log('更新系统消息', sysMsgs)
      this.data.sysMsgs = this.nim.mergeSysMsgs(this.data.sysMsgs, sysMsgs)
      this.$store.commit('updateSysNotices', this.data.sysMsgs)
    },
    onSysMsg (msg) {
      const msgs = [msg]
      console.log('收到或者发送系统消息', msgs)
      this.pushSysMsgs(msgs)
    },
    onSysMsgUnread (obj) {
      console.log('收到系统通知未读数', obj)
      this.data.sysMsgUnread = obj
      this.$store.commit('updateSysUnread', this.data.sysMsgUnread)
    },
    onUpdateSysMsgUnread (obj) {
      console.log('系统通知未读数更新了', obj)
      this.data.sysMsgUnread = obj
      this.$store.commit('updateSysUnread', this.data.sysMsgUnread)
    },
    onOfflineCustomSysMsgs (sysMsgs) {
      console.log('收到离线自定义系统通知', sysMsgs)
    },
    onCustomSysMsg (sysMsg) {
      console.log('收到自定义系统通知', sysMsg)
    },
    onBroadcastMsg (msg) {
      console.log('收到广播消息', msg)
    },
    onBroadcastMsgs (msgs) {
      console.log('收到广播消息', msgs)
    },
    onSyncDone () {
      console.log('同步完成')
      this.$store.commit('updateNIM', this.nim)
    }
  }
}
