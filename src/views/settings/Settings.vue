<template>
    <div class="settingContainer">
        <nav-bar>
          <span slot="left" class="iconfont leftIcon" @click="onClickLeft">&#xe65b;</span>
          <span slot="title" class="title">Settings</span>
        </nav-bar>
        <ul class="settingForm">
            <li class="line">Account settings</li>
            <router-link tag="li" class="settingItem" :to="{name:'ChangePassword1'}">
                <div class="profileLabel">
                    <span>Change Password</span>
                </div>
            </router-link>
             <router-link tag="li" class="inputItem" :to="{name:'Connect1',query:{type:0}}">
                <label>Phone</label>
                <input type="text" v-model="userInfo.phonenum" disabled>
                <i class="rightIcon">
                  <img :src="userInfo.phonenum?verifiedIcon:unVerifiedIcon" alt="right icon">
                </i>
            </router-link>
            <router-link tag="li" class="inputItem" :to="{name:'Connect1',query:{type:1}}">
              <label >Email</label>
              <input type="text" v-model="userInfo.email" disabled>
              <i class="rightIcon" @click.stop="sendEmail">
                <img :src="userInfo.emailConfirmFlag?verifiedIcon:unVerifiedIcon" alt="right icon">
              </i>
            </router-link>
            <li class="line">Other settings</li>
            <!-- <li class="settingItem">
                <div class="profileLabel">
                    <span>Clear cache</span>
                </div>
            </li> -->
            <li class="settingItem" @click="download">
                <div class="profileLabel">
                    <span>Download XPLO</span>
                </div>
            </li>
            <li class="settingItem version">
                <div class="profileLabel">
                    <span>Version</span>
                </div>
            </li>
        </ul>

        <dialog
        title="Check your email"
        :content="dialogContent"
        v-show="isDialog"
        @close="isDialog = false"
        />
    </div>
</template>

<script>
import {Toast} from 'vant'
import {sendConfirmEmail} from '@/api/api'
import verifiedIcon from '@/assets/img/ic_verified@2x.png'
import unVerifiedIcon from '@/assets/img/ic_noverified@2x.png'
import NavBar from '@/components/NavBar'
import Dialog from '@/components/dialog/AlertDialog'

export default {
  name: 'Settings',
  components: {NavBar, Dialog},
  data () {
    return {
      verifiedIcon: verifiedIcon,
      unVerifiedIcon: unVerifiedIcon,
      isDialog: false,
      dialogContent: ''
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.userInfo
    },
    iosUrl () {
      return this.$store.state.iosDownloadUrl.url
    }
  },
  methods: {
    onClickLeft () {
      this.$router.go(-1)
    },
    sendEmail () {
      if (this.userInfo.email) {
        sendConfirmEmail().then(res => {
          if (res.data.code === '200') {
            this.dialogContent = `We have sent a verification email to ${this.userInfo.email}.`
            this.isDialog = true
          } else {
            Toast({
              message: res.data.message
            })
          }
        })
      }
    },
    download () {
      window.location.href = this.iosUrl
    }
  }
}
</script>

<style scoped>
.settingContainer{
    background-color: #f7f7f7;
    height: 100%;
}
.settingForm{
    font-size:0.34rem;
}
.settingForm .settingItem{
    display: flex;
    justify-content: space-between;
    padding:0.4rem 0;
    background-color: #fff;
}
.settingForm .settingItem span{
    padding:0.2rem 0.3rem;
    color: rgb(51,51,51);
}
.settingForm .settingItem::after{
    content: "\e608";
    margin-right: 0.5rem;
    color: rgb(202,215,236);
    font-family: "iconfont" !important;
    font-size: 0.32rem;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
.settingForm .settingItem.version::after{
    content: "2.0";
}

.line{
    display: flex;
    align-items: center;
    width: 100%;
    height: 0.6rem;
    font-size:0.26rem;
    padding:0 0.3rem;
    box-sizing: border-box;
    color:rgb(153,153,153);
    background-color: #f7f7f7;
}

.inputItem{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding:0.4rem 0.3rem;
  box-sizing: border-box;
  background-color: #fff;
}
[disabled]{
  color:rgb(153,153,153);
}
.rightIcon{
  display: block;
  width: 0.4rem;
  height: 0.4rem;
}
.rightIcon img{
  object-fit: contain;
}
.leftIcon{
  font-size: 0.5rem;
}
</style>
