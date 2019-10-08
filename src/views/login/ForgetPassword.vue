<template>
  <div class="password">
    <div class="btnBack iconfont" @click="goBack">&#xe65b;</div>
    <p class="title">Password reset</p>
    <!-- 邮箱 -->
    <template v-if="isEmail">
      <input-field
      placeholder="Enter your email"
      v-model="email"
      >
        <div slot="icon" class="phoneContainer" >
          <div class="getCodeBtn" v-show="email" @click.stop="getCode">Get Code</div>
        </div>
      </input-field>
      <input-field placeholder="Verification code" v-model="veriCode"/>
    </template>
    <!-- 电话 -->
    <template v-else>
      <input-field
      :clear="false"
      value="phone"
      placeholder="Enter your phone"
      >
        <div slot="input" class="phoneContainer" >
          <div class="code" @click.stop="goTelCodeList">+{{code}}</div>
          <div class="phoneNum">
            <input
            type="tel"
            placeholder="Enter..."
            v-model.trim.number="phone"
            autocomplete="off"
            class="input"
            />
          </div>
          <div class="getCodeBtn" v-show="phone" @click.stop="getCode">Get Code</div>
        </div>
      </input-field>
      <input-field placeholder="Verification code" v-model="veriCode"/>
    </template>
    <big-button name="Continue" @click.native="continueFn"/>
  </div>
</template>

<script>
import {Toast} from 'vant'
import BigButton from '@/components/BigButton'
import InputField from '@/components/InputField'
import toLogin from '@/mixins/toLoginMix'
import axios from 'axios'

export default {
  name: 'ForgetPassword',
  mixins: [toLogin],
  components: {Toast, BigButton, InputField},
  data () {
    return {
      message: {
        toEmail: 'We have sent a verification code to your email.',
        toPhone: 'We have sent a verification code to your phone.'
      },
      isWaiting: false,
      veriCode: '',
      code: localStorage.getItem('telCode') || 1,
      showInput: false,
      phone: '',
      email: '',
      baseUrl: process.env.BASE_API
    }
  },
  computed: {
    isEmail () { // 1为邮箱，0为电话
      return this.$route.params.type * 1
    },
    username () {
      if (this.isEmail) {
        return this.email.replace(/\s*/g, '')
      } else {
        return this.phone ? (`${this.code}-${this.phone}`.replace(/\s*/g, '')) : ''
      }
    }
  },
  activated () {
    this.code = localStorage.getItem('telCode') || 1
  },
  methods: {
    goBack () {
      history.go(-1)
    },
    goTelCodeList () {
      this.$router.push('/regionCode')
    },
    getCode (e) {
      const flag = this.isEmail ? this.email : this.phone
      if (!flag || this.isWaiting) { return false }
      this.isWaiting = true

      if (this.isEmail) {
        // 调用邮箱接口
        axios.get(`${this.baseUrl}/sendEmailVerCodeForForgetpassword?email=${this.username}`).then(res => {
          if (res.data.code === '200') {
            this.changeClassName(e.target)
            Toast({'message': this.message.toEmail})
          } else {
            Toast({'message': res.data.message})
          }
          this.isWaiting = false
        }).catch(err => {
          this.toLogin(err)
        })
      } else {
        axios.get(`${this.baseUrl}/sendPhoneVerCodeForForgetPassword?phoneNum=${this.username}`).then(res => {
          if (res.data.code === '200') {
            this.changeClassName(e.target)
            Toast(this.message.toPhone)
          } else {
            Toast({'message': res.data.message})
          }
          this.isWaiting = false
        }).catch(err => {
          this.toLogin(err)
        })
      }
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
    continueFn () {
      if (this.veriCode && this.username) {
        // 如果验证码的长度为4,失去焦点进行验证
        this.$router.push({
          path: '/resetPassword',
          query: {
            vercode: this.veriCode,
            type: this.isEmail ? 0 : 1,
            loginname: this.username
          }
        })
      } else {
        Toast(`Please enter your ${this.isEmail ? 'email' : 'phone'} & verification code.`)
      }
    }
  }

}
</script>

<style scoped>
.btnBack{
  position: absolute;
  top: .54rem;
  left: .3rem;
  color: rgb(102,102,102);
  font-size: .5rem;
  z-index: 2;
  font-weight: 500;
}
.title{
  font-family: 'Lato', sans-serif;
  font-size: 0.35rem;
  color: rgb(102,102,102);
  margin:1.65rem 0.54rem 0.54rem;
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
</style>
