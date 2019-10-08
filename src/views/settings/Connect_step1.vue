<template>
    <div>
        <nav-bar>
          <span slot="left" class="iconfont leftIcon" @click="goBack">&#xe65b;</span>
          <span slot="title" class="title">{{type?'Email':'Mobile'}}</span>
        </nav-bar>
        <div class="iconContainer">
          <div class="icon">
            <img v-lazy="type?IconEmail:IconMobile" alt="icon">
          </div>
        </div>

        <div class="inputContainer">
          <!-- email -->
          <template v-if="type">
            <input-field placeholder="Enter your email" v-model="email"/>
            <p class="tip" v-show="isEmailVerified">Verified successfully!</p>
          </template>
          <!-- phone -->
          <template v-else>
            <input-field
            :clear="false"
            placeholder="Enter your phone number"
            value="phone number"
            >
              <div slot="input" class="phoneContainer" >
                <div class="code" @click.stop="goTelCodeList">+{{telCode}}</div>
                <div class="phoneNum">
                  <input
                  ref="myInput"
                  type="tel"
                  v-model.trim.number="phone"
                  autocomplete="off"
                  />
                </div>
              </div>
            </input-field>
            <p class="tip" v-show="isPhoneVerified">Verified successfully!</p>
          </template>

        </div>
        <big-button :name="type?'Verify email':'Send code'" @click.native="btnClickedFn"/>
        <dialog
        title="Check your email"
        :content="dialogContent"
        v-show="isDialog"
        @close="isDialog = false"
        />
        <!-- loading -->
        <loading v-show="isLoading"/>
    </div>
</template>

<script>
import {Toast} from 'vant'
import IconMobile from '@/assets/img/ic_setting_phone@2x.png'
import IconEmail from '@/assets/img/ic_setting_mail@2x.png'
import BigButton from '@/components/BigButton'
import InputField from '@/components/InputField'
import Dialog from '@/components/dialog/AlertDialog'
import NavBar from '@/components/NavBar'
import Loading from '@/components/Loading'
import toLogin from '@/mixins/toLoginMix'
import {connect} from '@/api/api'
import axios from 'axios'

export default {
  name: 'Connect1',
  components: {NavBar, BigButton, InputField, Dialog, Loading},
  mixins: [toLogin],
  data () {
    return {
      IconMobile: IconMobile,
      IconEmail: IconEmail,
      isDialog: false,
      phone: '',
      dialogContent: '',
      telCode: localStorage.getItem('telCode') || 1,
      baseUrl: process.env.BASE_API,
      isLoading: false
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.userInfo
    },
    type () {
      return this.$route.query.type * 1
    },
    isEmailVerified () {
      return this.userInfo.emailConfirmFlag
    },
    isPhoneVerified () {
      return this.userInfo.phonenum
    }
  },
  activated () {
    this.telCode = localStorage.getItem('telCode') || 1
  },
  created () {
    this.email = this.userInfo.email
    this.phone = this.userInfo.phonenum
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    goTelCodeList () {
      this.$router.push('/telCode')
    },
    getEmail (text) {
      this.email = text
    },
    btnClickedFn () {
      this.isLoading = true
      if (this.type) { // 如果用户不输入，默认使用注册时的邮箱
        if (!this.email) {
          Toast('Please enter your email.')
          return
        }
        const linkAccount = this.email || this.userInfo.email
        const query = {
          linkType: 'EMAIL',
          linkAccount: linkAccount
        }
        connect(query).then(res => {
          this.isLoading = false
          if (res.data.code === '200') {
            this.dialogContent = `We have sent a verification email to ${linkAccount}.`
            this.isDialog = true
          } else {
            Toast({
              message: res.data.message
            })
          }
        })
      } else {
        if (!this.phone) {
          Toast('Please enter your phone number.')
          return
        }
        // 给号码发送验证码
        axios.get(`${this.baseUrl}/sendPhoneVerCodeForForgetPassword?phoneNum=${this.telCode}-${this.phone}`).then(res => {
          if (res.data.code === '200') {
            Toast({
              message: 'We have sent a verification code to your phone.'
            })
            this.$router.push({
              name: 'Connect2',
              query: {
                phone: `${this.telCode}-${this.phone}`
              }
            })
          } else {
            Toast({
              message: res.data.message
            })
          }
        }).catch(err => {
          this.toLogin(err)
        })
      }
    }
  }
}
</script>

<style scoped>
.iconContainer{
  display: flex;
  justify-content: center;
  margin:0.5rem 0 0.4rem;
}
.icon{
  width: 1.3rem;
  height: 1.8rem;
}
.icon img{
  object-fit: contain;
}
.inputContainer{
  position: relative;
}
.input{
  padding: 0.2rem 0;
  border-bottom: 0.02rem solid rgb(190,190,198);
}
.telCode{
  font-family: SFUIDisplay-Medium;
  color: rgb(54,101,167);
  font-size: 0.32rem;
  display: inline-block;
  margin-right: 0.2rem;
  padding-right: 0.2rem;
  border-right: 0.02rem solid rgb(202,215,236);
}
.tip{
  position: absolute;
  bottom: -.7rem;
  width:100%;
  text-align: center;
  color: rgb(66,93,144);
  font-size: 0.24rem;
}
.leftIcon{
  font-size: 0.5rem;
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
</style>
