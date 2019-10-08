<template>
  <div>
      <div class="btnBack iconfont" @click="goBack">&#xe65b;</div>
      <p class="title">Password reset</p>
      <input-field placeholder="New password" type="password" v-model="createPassword" @blur="checkPassword"/>
      <input-field placeholder="Confirm your new password" type="password" v-model="createPassword1"  @blur="checkPassword2"/>
      <p class="invalidTip">{{invalidPassword||passwordNotSame}}</p>
      <big-button name="Reset" @click.native="confirm"/>
      <!-- loading -->
      <loading v-show="isLoading" />
  </div>
</template>

<script>
import axios from 'axios'
import {Toast} from 'vant'
import InputField from '@/components/InputField'
import BigButton from '@/components/BigButton'
import Loading from '@/components/Loading'
import md5 from 'MD5'

export default {
  name: 'ResetPassword',
  components: {InputField, BigButton, Loading},
  data () {
    return {
      baseUrl: process.env.BASE_API,
      invalidPassword: '',
      passwordNotSame: '',
      createPassword: '',
      createPassword1: '',
      isLoading: false
    }
  },
  computed: {
    type () {
      return this.$route.query.type
    },
    loginname () {
      return this.$route.query.loginname
    },
    vercode () {
      return this.$route.query.vercode
    }
  },
  methods: {
    goBack () {
      history.go(-1)
    },
    checkPassword () {
      if (!this.createPassword) {
        return false
      }
      if (this.createPassword.match(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/)) {
        this.invalidPassword = ''
      } else {
        this.invalidPassword = 'Your password must be between 8 and 20 characters.'
      }
    },
    checkPassword2 () {
      if (!this.createPassword1) {
        return false
      }
      if (this.createPassword !== this.createPassword1) {
        this.passwordNotSame = 'The passwords have to be the same！'
      } else {
        this.passwordNotSame = ''
      }
    },
    confirm () {
      if (this.passwordNotSame || this.invalidPassword) {
        Toast('Please enter the correct password.')
        return false
      }
      this.isLoading = true
      this.password = md5(md5('xplosugar').toUpperCase() + this.createPassword).toUpperCase()
      axios({
        url: `${this.baseUrl}/resetPassForForgetpassword?password=${this.password}&loginname=${this.loginname}&type=${this.type}&vercode=${this.vercode}`,
        method: 'post',
        data: {},
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(res => {
        this.isLoading = false
        if (res.data.code === '200') {
          this.$router.push('/login')
        } else {
          Toast({
            message: res.data.message
          })
        }
      })
    }
  }

}
</script>

<style scoped >
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
/* tips */
.invalidTip{
  font-family: 'Lato', sans-serif;
  margin:-0.2rem 0.54rem .2rem;
  font-size: 0.24rem;
  color: rgb(243,95,89);
}
</style>
