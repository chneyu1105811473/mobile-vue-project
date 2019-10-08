<template>
  <!-- 注册页面 -->
  <div class="signUp">

    <div class="btnBack iconfont" @click="goBack">&#xe65b;</div>

    <div class="title">
      <div class="tab" :class="{'active':isEmail}" @click="isEmail = true">Email</div>
      <div class="tab" :class="{'active':!isEmail}" @click="isEmail = false">Phone</div>
    </div>

    <template v-if="isEmail">
      <div class="email">
        <input-field key="1" placeholder="Enter your email" v-model="email" @blur="checkEmailOnly"/>
        <input-field key="2" placeholder="Create your password" type="password" v-model="createPassword" @blur="checkPassword"/>
        <p class="invalidTip">{{invalidTipForEmail||invalidPassword}}</p>
      </div>
    </template>

    <template v-else>
      <div class="phone">
        <input-field
        :clear="false"
        placeholder="Enter your phone number"
        value="phonenumber"
        key="phone"
        >
          <div slot="input" class="phoneContainer" >
            <div class="code" @click.stop="goTelCodeList">+{{code}}</div>
            <div class="phoneNum">
              <input
              type="text"
              ref="myInput"
              v-model.trim.number="phone"
              autocomplete="off"
              @change="checkPhoneOnly"/>
            </div>
            <div class="getCodeBtn" v-show="phone" @click.stop="getCode">Get Code</div>
          </div>
        </input-field>
        <input-field key="1" placeholder="Verification code" type="text" v-model="veriCode"/>
        <input-field key="2" placeholder="Create your password" type="password" v-model="createPassword" @blur="checkPassword"/>
        <p class="invalidTip">{{invalidTipForPhone||invalidPassword}}</p>
      </div>
    </template>

    <div class="terms">
      <label for="agreecheck" class="checkbox" ref="agreeLabel">
        <input type="checkbox" id="agreecheck" v-model="agreeCheckbox" @change="agreeCheck" required>
      </label>
      <p>I agree to the <a href="javascript:void(0)" @click="isTermServiceShow=true">terms of service.</a></p>
    </div>
      <!-- Xplo Inc. Terms of Service -->
    <privacy :termServiceShow="isTermServiceShow" @close="onClose"/>

    <big-button name="Sign up" @click.native="signUpfn"/>
    <!-- loading -->
    <loading v-show="isLoading"/>
  </div>

</template>
<script>
import {Toast} from 'vant'
import Privacy from '@/components/PrivacyForSignUp'
import SettingsBtn from '@/components/SettingsBtn'
import userLocation from '@/mixins/userLocationMix'
import icSelect from '@/assets/img/icSelect@2x.png'
import axios from 'axios'
import md5 from 'MD5'
import {mapState} from 'vuex'
import InputField from '@/components/InputField'
import BigButton from '@/components/BigButton'
import Loading from '@/components/Loading'

export default {
  name: 'SignUp',
  components: {Toast, Privacy, SettingsBtn, InputField, BigButton, Loading},
  mixins: [userLocation],
  data () {
    return {
      invalidTipForEmail: '', // 邮箱唯一性验证
      invalidTipForPhone: '', // 号码唯一性验证
      invalidVariCode: '', // 验证码接口验证
      invalidPassword: '', // 密码长度验证
      message: {
        toPhone: 'We have sent a verification code to your phone.'
      },
      code: 86,
      email: '', // 注册邮箱
      phone: '', // 注册电话号码
      veriCode: '', // 验证码
      createPassword: '', // 注册密码
      agreeCheckbox: false,
      isEmail: true, // 判断是否是active状态，默认邮箱注册为true
      isWaiting: false, // 等待验证码阶段 默认为false
      isTermServiceShow: false, // 是否显示term_service,默认为false
      baseUrl: process.env.BASE_API,
      isLoading: false
    }
  },
  computed: {
    ...mapState({
      birthday: state => state.userInfo.birthday,
      username: state => state.userInfo.username
    })
  },
  activated () {
    this.code = this.getTelCode()
  },
  updated () {
    this.code = this.getTelCode()
  },
  methods: {
    goBack () {
      this.$router.push({
        name: 'Birthday'
      })
    },
    getTelCode () {
      return localStorage.getItem('telCode') || 1
    },
    getCode (e) {
      if (this.invalidTipForPhone || this.isWaiting) { return false }
      this.isWaiting = true
      axios.get(`${this.baseUrl}/sendPhoneVerCodeForSignup?phoneNum=${this.code}-${this.phone}`).then(res => {
        if (res.data.code === '200') {
          this.changeClassName(e.target)
          Toast(this.message.toPhone)
        } else {
          Toast(res.data.message)
        }
        this.isWaiting = false
      }).catch(err => {
        Toast(err)
      })
    },
    goTelCodeList () {
      this.$router.push('/regionCode')
    },
    changeClassName (ele) {
      if (!this.isWaiting) { return false }
      if (this.isEmail) {
        this.time = 120
      } else {
        this.time = 60
      }
      ele.classList.remove('active')
      ele.innerHTML = `${this.time}s`
      this.timer = setInterval(() => {
        this.time--
        ele.innerHTML = `${this.time}s`
        if (this.time < 0) {
          ele.innerHTML = 'Get Code'
          ele.classList.add('active')
          clearInterval(this.timer)
          this.isWaiting = false
        }
      }, 1000)
    },
    agreeCheck () {
      if (this.agreeCheckbox) {
        this.$refs.agreeLabel.style.background = `url(${icSelect}) no-repeat 0.02rem 0.02rem /80% 80%`
      } else {
        this.$refs.agreeLabel.style.background = 'none'
      }
    },
    onClose (val) {
      this.isTermServiceShow = val
    },
    signUpfn () {
      this.isLoading = true
      // password md5加密
      // this.md5_createPassword = this.createPassword
      this.md5_createPassword = md5(md5('xplosugar').toUpperCase() + this.createPassword).toUpperCase()
      let url = ''
      if (!this.isEmail) {
        this.signUpType = 1
        if (!this.agreeCheckbox || this.invalidTipForPhone || this.invalidPassword || !this.veriCode) { return false }
        url = `${this.baseUrl}/public/v2/signup?signUpType=${this.signUpType}&phone=${this.code}-${this.phone}&vercode=${this.veriCode}&password=${this.md5_createPassword}&birthDay=${this.birthday}&userName=${this.username}`
      } else {
        this.signUpType = 0
        if (!this.agreeCheckbox || this.invalidTipForEmail || this.invalidPassword) { return false }
        url = `${this.baseUrl}/public/v2/signup?signUpType=${this.signUpType}&email=${this.email}&password=${this.md5_createPassword}&birthDay=${this.birthday}&userName=${this.username}`
      }
      axios.post(url).then(res => {
        if (res.data.code === '200') {
          this.invalidVariCode = ''
          // 注册成功之后调登录接口
          this.login()
        } else {
          this.isLoading = false
          this.invalidVariCode = res.data.message
        }
      }).catch(() => {
        this.isLoading = false
      })
    },
    login () {
      const signInData = {
        'email': this.username,
        'loginType': 2, // 0:email 1:phonenum 2:username
        'password': this.md5_createPassword,
        'phonenum': this.username,
        'username': this.username
      }
      axios.post(`${this.baseUrl}/login`, signInData).then(res => {
        if (res.data.code === '200') {
          localStorage.setItem('Authorization', res.data.result)
          localStorage.setItem('username', this.username)
          this.$router.push({
            path: '/recommend',
            query: {
              isInit: 1
            }})
        } else {
          this.$router.push({
            path: '/login'
          })
        }
        this.isLoading = false
      }).catch(() => {
        this.isLoading = false
      })
    },
    checkEmailOnly () {
      if (!this.email) {
        return false
      }
      axios.get(`${this.baseUrl}/validateEmailOnly?email=${this.email}`).then(res => {
        if (res.data.code !== '200') {
          this.invalidTipForEmail = res.data.message
        } else {
          this.invalidTipForEmail = ''
        }
      })
    },
    checkPhoneOnly () {
      if (!this.phone) {
        return false
      }
      axios.get(`${this.baseUrl}/validatePhonenumOnly?phonenum=${this.code}-${this.phone}`).then(res => {
        if (res.data.code === '200') {
          this.invalidTipForPhone = ''
        } else {
          this.invalidTipForPhone = res.data.message
        }
      })
    },
    checkPassword () {
      if (!this.createPassword) {
        return false
      }
      if (this.createPassword.match(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/)) {
        this.invalidPassword = ''
      } else {
        this.invalidPassword = 'Your password must be between 8 and 20 characters and include numbers.'
      }
    }
  }
}
</script>

<style scoped>
.signUp{
  padding-bottom: 1rem;
  box-sizing: border-box;
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
  display: flex;
  font-family: 'Lato', sans-serif;
  font-size: 0.35rem;
  margin:1.65rem 0.54rem 0.4rem;
}
.tab{
  position:relative;
  text-align: center;
  padding-bottom: .16rem;
  width: 50%;
  color: rgb(204,204,204);
  border-bottom:0.02rem solid rgb(216,216,216);
}
.tab::after{
  content:"";
  position:absolute;
  height:0.02rem;
  bottom:-0.02rem;
  left:50%;
  right:50%;
}
.tab.active{
  color:rgb(102,102,102);
}
.tab.active::after{
  left:0;
  right:0;
  background-color:rgb(102,102,102);
  transition-duration: 0.3s;
  transition-timing-function: ease-out;
}

/* 电话号码验证 */
.phone{
  position: relative;
}
.phoneContainer{
  display: flex;
  align-items: center;
  padding: 0.1rem 0;
  box-sizing: border-box;
  font-size: 0.28rem;
}
.code{
  margin-right: 0.2rem;
  padding-right: .1rem;
  line-height: .3rem;
  box-sizing: border-box;
  color: rgb(26,140,253);
  border-right: 0.02rem solid rgb(26,140,253);
}
.phoneNum input{
  color: rgb(134,138,139);
  background: transparent;
}
.getCodeBtn{
  position: absolute;
  right: .2rem;
  top: 35%;
  font-size: 0.3rem;
  font-family: 'Lato', sans-serif;
  color: rgb(26,140,253);
}
/* terms */
.checkbox{
  width:0.24rem;
  height: 0.24rem;
  border: 0.02rem solid rgb(48,71,114);
  border-radius: 0.04rem;
}
.checkbox [type=checkbox]{
  padding-bottom: 0;
  opacity: 0;
}
.terms{
  display: flex;
  font-family: SFUIDisplay-Regular;
  font-size: 0.28rem;
  align-items: center;
  margin:-0.1rem 0.5rem;
}
.terms p{
  margin:0 0.1rem;
  padding:0;
  color: rgb(153,153,153);
}
.terms a{
  color: rgb(102,102,102);
}
.btn{
  position: relative;
  margin-top: 1rem;
}
/* tips */
.invalidTip{
  margin:-0.2rem 0.54rem .2rem;
  font-size: 0.24rem;
  color: rgb(243,95,89);
}
</style>
