<template>
  <div class="login" :style="{'height':winHeight+'px'}">
    <!-- 封面页面 -->
    <div v-show="isNew" class="loginPost">
        <div class="loginLogo">
        <img :src="$logo" alt="logo">
      </div>
      <div class="startContainer">
        <router-link :to="{'name':'Username'}" tag="div" class="startBtn">
          Get Started
        </router-link>
        <div class="loginText">
          <div>Have an account?</div>
          <div class="signBtn" @click="isNew = false">Sign in</div>
        </div>
        <!-- 返回xplo -->
        <div class="goXplo" @click="goXploPage">
          Back to Xplo
        </div>
      </div>
    </div>
    <!-- 登录页面 -->
    <div v-show="!isNew" class="signIn">
      <div class="btnBack iconfont" @click="goBack">&#xe65b;</div>
      <p class="title">Welcome back</p>
      <!-- InputField -->
      <input-field placeholder="Username / Email / Phone" v-model="username"/>
      <input-field placeholder="Password" type="password" v-model="password"/>
      <p class="validTips">{{signInWrongTip}}</p>
      <p class="forget" @click="forgetPasswordPopup = true">Forgot Password？</p>
      <big-button @click.native="signIn"/>
    </div>
    <!-- 修改密码/忘记密码 -->
    <popup v-model="forgetPasswordPopup">
      <forget-password-pop @hidePopup="getHidePopup"/>
    </popup>
    <!-- loading -->
    <loading v-show="isLoading" />
  </div>
</template>

<script>
import { Popup, Toast, Dialog } from 'vant'
import {getUa} from '@/api/api'
import forgetPasswordPop from '@/components/popup/ForgetPasswordPop'
import userLocation from '@/mixins/userLocationMix'
import dialogMix from '@/mixins/downloadAppMix'
import InputField from '@/components/InputField'
import BigButton from '@/components/BigButton'
import Loading from '@/components/Loading'
import { mapGetters } from 'vuex'
import axios from 'axios'
import md5 from 'MD5'

export default {
  name: 'Login',
  components: {Popup, forgetPasswordPop, InputField, BigButton, Loading},
  mixins: [userLocation, dialogMix],
  data () {
    return {
      signInWrongTip: '',
      isNew: true, // 判断用户localStorage，true表示有账号登录 默认为true
      forgetPasswordPopup: false, // vant popup默认设置show为false
      baseUrl: process.env.BASE_API,
      isLoading: false,
      username: '',
      password: '',
      options: {
        title: 'XPLO',
        message: 'Download the app, open your eyes \n and explore the world.',
        className: 'lessPadding'
      }
    }
  },
  computed: {
    ...mapGetters([
      'winHeight'
    ])
  },
  created () {
    if (localStorage.getItem('Authorization')) {
      this.UserAuthCheck()
    } else {
      this.showDialog(this.options)
    }
  },
  activated () {
    // 获取用户地址
    this.isNew = true
    if (!localStorage.getItem('Authorization')) {
      this.showDialog(this.options)
    }
  },
  methods: {
    goBack () {
      this.isNew = true
    },
    signIn () {
      if (!this.username || !this.password) {
        Toast({
          message: 'Please enter your account & password'
        })
        return false
      }
      this.isLoading = true
      let isMatchEmail = /@./.test(this.username)
      let isMatchPhone = /^\d+$/.test(this.username)
      let type = 0
      if (isMatchEmail) {
        type = 0
      } else if (isMatchPhone) {
        type = 1
      } else {
        type = 2
      }
      // 调用登录接口
      axios.post(`${this.baseUrl}/login`, {
        'email': this.username,
        'loginType': type, // 0:email 1:phonenum 2:username
        // 'password': this.password,
        'password': md5(md5('xplosugar').toUpperCase() + this.password).toUpperCase(),
        'phonenum': this.username,
        'username': this.username
      }).then(res => {
        this.isLoading = false
        if (res.data.code === '200') {
          this.signInWrongTip = ''
          localStorage.setItem('Authorization', res.data.result)
          // 本地记录登录账号
          localStorage.setItem('username', this.username)
          this.UserAuthCheck()
        } else if (res.data.code === '636') { // 账户冻结
          this.dialogShow()
        } else {
          this.signInWrongTip = res.data.message
        }
      })
    },
    getHidePopup () {
      this.forgetPasswordPopup = false
    },
    UserAuthCheck () { // 登录后判断用户状态，status 用户状态,0:注册用户,需要再去完善信息 1:正式用户，不需要完善信息 2:冻结，不允许用户访问
      getUa().then(res => {
        if (res.data.code === '200') {
          localStorage.setItem('id', res.data.result.id)
          localStorage.setItem('im_token', res.data.result.im_token)
          localStorage.setItem('im_accid', res.data.result.im_accid)
          const status = res.data.result.status
          switch (status) {
            case 0:
              this.$router.push('/recommend')
              break
            case 1:
              this.$router.push('/xplo')
              break
            case 2:
              Toast({'message': 'Account suspension!'})
              break
          }
        } else if (res.data.code === '636') {
          this.dialogShow()
        }
      })
    },
    dialogShow () {
      Dialog.confirm({
        message: 'Your account has been suspended!',
        confirmButtonText: 'Appeal',
        cancelButtonText: 'Cancel',
        closeOnClickOverlay: true,
        className: 'morePadding'
      }).then(() => { // 确认
        this.$router.push({
          name: 'Appeal',
          params: {
            userId: localStorage.getItem('id')
          }
        })
      }).catch(() => { // 取消
        console.log('取消')
      })
    },
    goXploPage () {
      localStorage.removeItem('Authorization')
      this.$router.replace('/xplo')
    }
  }
}
</script>

<style scoped>
.login{
    position: relative;
    color:rgb(153,153,153);
}
/* 首次登录页面 */
.loginPost{
    position: absolute;
    display: flex;
    justify-content: center;
    width:100%;
    height: 100%;
    color:#fff;
    background-position:0 0;
    background-repeat:no-repeat;
    background-image:url(../../assets/img/loginCover_v2.png);
    background-size: cover;
}
.loginLogo{
    position: absolute;
    top: 1.95rem;
}
.loginLogo img{
    width: 2.4rem;
    height: auto;
}
.startContainer{
    position: absolute;
    bottom: 1rem;
}
.startBtn{
    font-family: 'Lato', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom:0.2rem;
    width:4.36rem;
    height: 1rem;
    font-size: 0.4rem;
    border-radius:0.5rem;
    background: #fff;
    color: rgb(51,51,51);
}
.loginText{
    font-family: 'Lato', sans-serif;
    display: flex;
    justify-content: center;
    color: #fff;
    font-size: 0.3rem;
    text-shadow: 0 0 0.1rem rgb(51,51,51);
}
.loginText .signBtn{
    padding-bottom:0.1rem;
    border-bottom: 0.02rem solid #fff;
    margin-left: 0.1rem;
}

/* 登录页面 */
.signIn{
    position: relative;
    width:100%;
    height: 100%;
    font-size: 0.32rem;
    overflow: hidden;
}
.btnBack{
    position: absolute;
    top: .54rem;
    left: .3rem;
    color: rgb(102,102,102);
    font-size: .5rem;
    z-index: 2;
}
.title{
    font-family: 'Lato';
    font-size: 0.35rem;
    color: rgb(102,102,102);
    margin:1.65rem 0.54rem 0.54rem;
}
.forget{
    position: absolute;
    bottom: 1.2rem;
    bottom: calc(1.2rem + constant(safe-area-inset-bottom));
    bottom: calc(1.2rem + env(safe-area-inset-bottom));
    width: 100%;
    text-align: center;
    font-size: 0.24rem;
    font-family: 'Lato';
    color: rgb(54,101,167);
}
.validTips{
    margin-top: -0.1rem;
    font-family:'Lato';
    text-indent: 0.54rem;
    color:rgb(243,95,89);
    font-size:0.26rem;
}
/* 返回xplo页面 */
.goXplo{
    position: absolute;
    bottom: -0.6rem;
    width: 100%;
    text-align: center;
    color:rgb(255,255,255);
    font-size:0.26rem;
    font-family: 'lato';
    text-shadow: 0 0 0.1rem rgb(51,51,51);
}
</style>
