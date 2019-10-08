<template>
  <div class="privateChat">
    <!-- 头部 -->
    <div class="header">
        <div class="iconfont goback" @click="goBack">&#xe774;</div>
        <div class="username">{{userInfo.username}}</div>
              <!-- <div :class="{'userStatus':true,'isOnline':isOnline}">{{isOnline?'online':'offline'}}</div> -->
        <slot name="right"/>
    </div>
    <!-- 新消息提示 -->
    <slot name="newMessageTip" />
    <!-- 聊天界面 -->
    <div class="messageContaner">
      <i-m-message :finished="!hasHistory" @load="onLoad" ref="messageBox"/>
      <!-- 如果被拉黑，显示解拉黑按钮 -->
      <div class="blackUser" v-show="isBlack">
        You're blocking the user,<br/>
        click <span @click.stop="removeBlackList">here</span> to remove the blacklist.
      </div>
      <!-- 进度条 -->
      <div class="bar" v-show="isUploading">
        <div class="rate" :style="{'width':currentRate}"></div>
      </div>
    </div>
    <!-- bottom -->
    <div class="bottom">
      <emoji @emoji="sendEmoji" v-show="showEmoji"/>
      <div class="InputContainer">
        <div class="imInput">
          <input
          type="text"
          :placeholder="placeholder"
          v-model.trim="message"
          @keydown.enter="sendText"
          @focus="showEmoji = false"
          >
          <span class="sendBtn" @click="sendText">Send</span>
          <!-- emoji -->
          <div class="emoji iconfont" @click="showEmoji = !showEmoji">&#xe713;</div>
        </div>
        <div class="fileInput iconfont">
          &#xe612;
          <input type="file" class="file" multiple @change="fileRead"/>
        </div>
      </div>
    </div>
    <div class="overlay" v-show="showEmoji" @click="showEmoji = false"/>
  </div>
</template>

<script>
import {Toast} from 'vant'
import IMMessage from './components/Message'
import Emoji from './components/Emoji'

export default {
  name: 'PrivateChat',
  components: {IMMessage, Emoji},
  data () {
    return {
      types: ['image', 'audio', 'video', 'file'],
      placeholder: 'Send a message…',
      message: '',
      data: {},
      currentRate: 0,
      isUploading: false,
      hasHistory: true,
      msgNum: 0,
      isOnline: true,
      showEmoji: false,
      isSended: false
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.userInfo
    },
    accid () {
      return localStorage.getItem('im_accid')
    },
    options () {
      return {
        appKey: this.$store.state.im_appKey[process.env.ENV_CONFIG],
        account: localStorage.getItem('im_accid'),
        token: localStorage.getItem('im_token'),
        onroamingmsgs: this.onRoamingMsgs,
        onofflinemsgs: this.onOfflineMsgs,
        onmsg: this.onMsg
      }
    },
    custom () {
      return {
        senderUserId: localStorage.getItem('id') * 1,
        senderAccountId: localStorage.getItem('im_accid')
      }
    },
    isBlack () {
      const blackAccounts = this.$store.state.blackList.map(item => item.account)
      return blackAccounts.includes(this.userInfo.im_accid)
    }
  },
  created () {
    this.nim = this.$SDK.NIM.getInstance(this.options)
    // 重置该sessionId的未读数
    const sessionId = `p2p-${this.userInfo.im_accid}`
    this.nim.setCurrSession(sessionId)
    // 首次获取历史记录
    this.getHistoryMsg()
    // 获取用户在线状态
    // this.getUserStatus()
  },
  updated () {
    if (this.isSended) {
      this.slideToBottom()
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    getHistoryMsg () { // 获取云端记录
      const self = this
      this.isSended = false
      console.log(self.userInfo.im_accid)
      this.nim.getHistoryMsgs({
        scene: 'p2p',
        limit: 10,
        endTime: self.endTime || 0,
        asc: true,
        to: self.userInfo.im_accid,
        done (error, obj) {
          if (error) {
            Toast({
              message: 'Error: get History message error.'
            })
            self.$emit('close', true)
          } else {
            if (!obj.msgs.length) {
              self.hasHistory = false
              return false
            }
            const msgs = obj.msgs
            self.hasHistory = msgs.length >= obj.limit
            self.endTime = obj.msgs[0].time
            self.$store.commit('concatMsgs', msgs)
            setTimeout(() => {
              self.slideToBottom()
            })
          }
        }
      })
    },
    sendText () {
      // 发送文本消息
      if (!this.message) { return false }
      const self = this
      console.log(self.userInfo.im_accid)
      this.nim.sendText({
        scene: 'p2p',
        to: self.userInfo.im_accid,
        text: self.message,
        custom: JSON.stringify(this.custom),
        done (error, msg) {
          if (error) {
            Toast({
              message: 'Send failed'
            })
          } else {
            self.showEmoji = false
            self.message = ''
            self.pushMsg(msg)
          }
        }
      })
    },
    fileRead (e) {
      const files = e.target.files
      for (let i = 0; i < files.length; i++) {
        this.previewAndSendFiles(files[i])
      }
    },
    previewAndSendFiles (item) {
      let type = item.type.split('/')[0]
      if (!this.types.includes(type)) {
        type = 'file'
      }
      console.log(type)
      const self = this
      this.nim.sendFile({
        scene: 'p2p',
        to: self.userInfo.im_accid,
        type: type,
        blob: item,
        custom: JSON.stringify(this.custom),
        // fastPass: '{"w":200,"h":200,"md5":"xxxxxxxxx"}',
        beginupload (upload) {
        // - 如果开发者传入 fileInput, 在此回调之前不能修改 fileInput
        // - 在此回调之后可以取消图片上传, 此回调会接收一个参数 `upload`, 调用 `upload.abort();` 来取消文件上传
        },
        uploadprogress (obj) {
          self.isUploading = true
          self.currentRate = obj.percentageText
          // console.log('文件总大小: ' + obj.total + 'bytes')
          // console.log('已经上传的大小: ' + obj.loaded + 'bytes')
          // console.log('上传进度: ' + obj.percentage)
          // console.log('上传进度文本: ' + obj.percentageText)
        },
        uploaddone (error, file) {
          if (error) {
            Toast({
              message: 'Send failed'
            })
          }
          self.isUploading = false
        },
        beforesend (msg) {
          // console.log('正在发送p2p image消息, id=' + msg.idClient)
          self.pushMsg(msg)
        },
        done (error, obj) {
          if (error) {
            console.log('error', error)
          } else {
            console.log('obj', obj)
          }
        }
      })
    },
    sendCustom () {
      let content = {
        type: 2,
        data:
            {'cid': this.emoji.id, 'catalogId': 'bear', 'name': this.emoji.tag}
      }
      const self = this
      this.nim.sendCustomMsg({
        scene: 'p2p',
        to: self.userInfo.im_accid,
        content: JSON.stringify(content),
        done (error, msg) {
          if (error) {
            Toast({
              message: 'Send failed'
            })
          } else {
            delete self.emoji
            self.showEmoji = false
            self.pushMsg(msg)
          }
        }
      })
    },
    onRoamingMsgs (obj) {
      console.log('收到漫游消息', obj)
      this.pushMsg(obj.msgs)
    },
    onOfflineMsgs (obj) {
      console.log('收到离线消息', obj)
      this.pushMsg(obj.msgs)
    },
    onMsg (msg) {
      console.log('收到消息', msg.scene, msg.type, msg, this.userInfo.im_accid === msg.from)
      if (this.userInfo.im_accid === msg.from) {
        this.pushMsg(msg)
      }
    },
    pushMsg (msgs) {
      if (!Array.isArray(msgs)) { msgs = [msgs] }
      this.isSended = true
      this.msgNum = msgs.length
      this.$store.commit('concatMsgs', msgs)
    },
    onLoad () {
      if (this.hasHistory) {
        this.getHistoryMsg()
      }
    },
    removeBlackList () {
      const _this = this
      this.nim.removeFromBlacklist({
        account: _this.userInfo.im_accid,
        done: _this.removeFromBlacklistDone
      })
    },
    removeFromBlacklistDone (error, obj) {
      console.log('从黑名单移除' + (!error ? '成功' : '失败'))
      if (!error) {
        const blackList = this.nim.cutRelations(this.$store.state.blackList, obj.record)
        this.$store.commit('updateBlackList', blackList)
      }
    },
    getUserStatus () {
      const _this = this
      this.nim.subscribeEvent({
        type: 1,
        subscribeTime: 3600 * 24 * 30,
        // 同步订阅事件，保证每次登录时会收到推送消息
        sync: true,
        accounts: [_this.userInfo.im_accid],
        done: _this.onSubscribeEvent
      })
    },
    onSubscribeEvent (error, obj) {
      console.log('订阅好友事件' + (!error ? '成功' : '失败'), error, obj)
    },
    handleAnimation (anim) {
      this.anim = anim
      this.anim.pause()
    },
    slideToBottom () {
      const message = this.$refs.messageBox.$el
      message.scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      })
    },
    sendEmoji (emoji) {
      this.emoji = emoji
      if (this.emoji.unicode) {
        this.message += this.emoji.unicode
      } else {
        // 发送自定义表情图片
        this.sendCustom()
      }
    }
  },
  destroyed () {
    // 重置该sessionId的未读数
    this.nim.resetCurrSession()
    // 重置历史记录
    this.$store.commit('initMsgs', [])
  }
}
</script>

<style scoped>
.privateChat{
    position: relative;
    height: 100%;
    background-color: #fff;
}
.header{
    position: relative;
    height: 1rem;
    display: flex;
    align-items: center;
}
.goback{
    font-size: 0.6rem;
    margin-right: .2rem;
    font-weight: bold;
}
.username{
    font-family: SFUIDisplay-Medium;
    font-size: 0.42rem;
}
.bottom{
    position: absolute;
    width: 100%;
    bottom: 0;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    z-index: 1;
}
.InputContainer{
    padding: .2rem;
    display: flex;
    align-items: center;
    box-sizing: border-box;
}
.imInput{
    display: flex;
    align-items: center;
    width: 100%;
    height: 0.6rem;
    border-radius: 0.36rem;
    overflow: hidden;
    background-color: rgb(236,240,248);
}
.imInput input{
    display: flex;
    align-items: center;
    width:100%;
    height: 100%;
    background-color: transparent;
    padding: 0.2rem 0.1rem;
    box-sizing: border-box;
    color:rgb(51,51,51);
    font-size: 0.28rem;
    text-indent: .2rem;
}
.imInput input::placeholder{
    color:rgb(189,189,189);
}
.imInput input:focus{
    color:rgb(51,51,51);
}
.imInput .sendBtn{
    font-size: 0.26rem;
    color: rgb(54,101,167);
    margin-right: .2rem;
}
.fileInput{
    position: relative;
    font-size: 0.4rem;
    margin-left: .1rem;
    color: rgb(202,215,236);
}
.file{
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    opacity: 0;
}
.messageContaner{
    height: calc(100% - 1rem - 1rem);
    overflow-y: auto;
}
.emoji{
    font-size: .4rem;
    color: rgb(202,215,236);
    margin-right: .1rem;
}
/* 进度条 */
.bar{
    position: fixed;
    top: 50%;
    margin: 0 auto;
    width: 80%;
    height: .2rem;
    border-radius: .1rem;
    background-color: #fff;
    overflow: hidden;
}
.rate{
    height: 100%;
    background: linear-gradient(to right,rgba(52,147,212,.8),rgba(54,100,167,.9));
}
.tip{
    font-size: 0.24rem;
    color:rgb(176,177,185);
}
.blackUser{
    font-family: 'SFUIDisplay-Medium';
    font-size: 0.24rem;
    color: rgb(250,80,81);
    text-align: center;
}
.blackUser span{
    text-align: center;
    border-bottom:0.02rem solid rgb(250,80,81);
}

/* 用户状态 */
.userStatus{
    font-size:0.2rem;
    color:rgb(176,177,185);
}
.userStatus.isOnline{
    color:rgb(66,199,28);
}
.overlay{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
</style>
