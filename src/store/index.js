import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const store = new Vuex.Store({
  state () {
    return {
      accessToken: 'pk.eyJ1IjoiZGV2aWxodyIsImEiOiJjam1iZXVvNDU1bmFnM3BvZ2JicndqdHg4In0.DyPp38_-15XwWpqxoEuwmg', // mapbox token
      mapBaseUrl: 'https://api.mapbox.com/geocoding/v5/mapbox.places', // mapbox根路径
      API_URL: 'https://api.mapbox.com', // mapbox根路径
      iosDownloadUrl: {
        url: 'https://itunes.apple.com/app/id1449233544?mt=8', // ios下载地址
        schema: 'xplo://' // ios schema
      },
      zoom: 14,
      profileClipBase64Icon: '', // profile裁剪时的临时图片
      postCropperBlob: '', // post裁剪时的临时图片
      postUploadFiles: [], // post选择文件
      postPreviewFiles: [], // post选择location和tag页面预览文件
      postData: {}, // 发布post的参数
      userInfo: {// profile编辑的数据
        memberStatisticsDto: {
          posts: 0
        },
        visitedCountryDtoList: []
      },
      myInfo: {
        memberStatisticsDto: {
          posts: 0
        },
        visitedCountryDtoList: []
      }, // 个人信息
      recordLocationData: null,
      currentTab: 0, // 底部tab对应值
      commentAtSomeone: [], // 评论@人名列表
      nim: null,
      im_appKey: {
        'dev': 'ec88e1b8f8422105ddd73dff4468bcfe',
        'sit': 'ec88e1b8f8422105ddd73dff4468bcfe',
        'prod': '750aecbcd20e5bdc2a3f4b4ff02e651d'
      },
      totalMsgs: [], // 私聊信息列表
      sessionsList: [], // 会话列表
      sysNotices: [], // 系统消息列表
      sysUnread: null, // 系统消息未读数。。。
      friendsList: [], // IM好友列表
      blackList: [], // 黑名单列表
      offline: false
    }
  },
  mutations: {
    saveMyInfo (state, obj) { // 保存我自己的信息
      state.myInfo = obj
    },
    updateRecordLocation (state, obj) {
      state.recordLocationData = obj
    },
    changeCommentAtSomeone (state, newArr) { // 评论页@别人列表
      state.commentAtSomeone = newArr
    },
    updateNIM (state, nim) {
      state.nim = nim
    },
    concatMsgs (state, newArr) { // 整合私聊时发送和接收的消息
      state.totalMsgs = state.totalMsgs.concat(newArr)
      state.totalMsgs.sort((a, b) => {
        return a.time - b.time// 按时间进行升序排列
      })
    },
    initMsgs (state, val) { // 初始化私聊信息列表为空
      state.totalMsgs = val
    },
    updateSessions (state, sessions) { // 更新会话信息
      const sessionsList = sessions.sessions
      state.sessionsList = sessionsList
    },
    updateFriendsList (state, friends) { // 好友列表
      // 调用好友API获得好友列表
      state.friendsList = friends
    },
    updateSysNotices (state, notices) { // 系统消息列表
      state.sysNotices = notices
    },
    updateSysUnread (state, obj) { // 系统消息未读数
      state.sysUnread = obj
    },
    updateBlackList (state, blackList) {
      console.log('更新黑名单', blackList)
      state.blackList = blackList
    },
    UPDATE_OfflineShow (state, boolean) {
      state.offline = boolean
    },
    updateZoom (state, value) {
      state.zoom = value
    }
  },
  getters: {
    countryFlag (state) { // profile country flag
      if (state.userInfo.country) {
        try {
          return `em-flag-${state.userInfo.country.toLowerCase()}`
        } catch (err) {
          console.log('国旗加载失败', err)
        }
      }
    },
    visitedCountryList: (state) => { // profile visited country flag
      if (state.userInfo.visitedCountryDtoList.length) {
        state.userInfo.visitedCountryDtoList.map((item) => {
          item.countryFlag = `em-flag-${item.isoCountryCode.toLowerCase()}`
        })
        return state.userInfo.visitedCountryDtoList
      }
    },
    winHeight () {
      return window.innerHeight
    }
  }
})

export default store
