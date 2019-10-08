<template>
    <div class="changePassword">
      <div class="btnBack iconfont" @click="goBack">&#xe65b;</div>
      <p class="title">Change password</p>
      <input-field placeholder="New password" type="password" v-model="createPassword" @blur="checkPassword"/>
      <input-field placeholder="Confirm your new password" type="password" v-model="createPassword1" @blur="checkIsSame"/>
      <p class="invalidTip">{{invalidPassword||passwordNotSame}}</p>
      <big-button name="Reset" @click.native="resetFn"/>
      <!-- loading -->
      <loading v-show="isLoading"/>
    </div>
</template>

<script>
import {Toast} from 'vant'
import InputField from '@/components/InputField'
import BigButton from '@/components/BigButton'
import Loading from '@/components/Loading'
import toLoginMix from '@/mixins/toLoginMix'
import md5 from 'MD5'
import {changePassword} from '@/api/api'

export default {
  name: 'ChangePassword2',
  components: {InputField, BigButton, Loading},
  mixins: [toLoginMix],
  data () {
    return {
      invalidPassword: '',
      passwordNotSame: '',
      createPassword: '',
      createPassword1: '',
      isLoading: false
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    resetPasswordFn (val) {
      const query = {
        password: val
      }
      changePassword(query).then(res => {
        if (res.data.code === '200') {
          Toast({
            message: 'Change password success'
          })
          this.$router.go(-2)
        } else {
          Toast({
            message: res.data.message
          })
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
        this.invalidPassword = 'Your password must be between 8 and 20 characters.'
      }
    },
    checkIsSame () {
      if (!this.createPassword1) {
        return false
      }
      if (this.createPassword !== this.createPassword1) {
        this.passwordNotSame = 'The passwords have to be the same！'
      } else {
        this.passwordNotSame = ''
      }
    },
    resetFn () {
      if (this.passwordNotSame || this.invalidPassword) {
        Toast('Please enter the correct password.')
        return false
      }
      this.isLoading = true
      this.password = md5(md5('xplosugar').toUpperCase() + this.createPassword).toUpperCase()
      const query = {
        password: this.password
      }
      changePassword(query).then(res => {
        this.isLoading = false
        if (res.data.code === '200') {
          Toast({
            message: 'Change password success'
          })
          this.$router.go(-2)
        } else {
          Toast({
            message: res.data.message
          })
        }
      }).catch(err => {
        this.isLoading = false
        this.toLogin(err)
      })
    }
  }
}
</script>

<style scoped>
.changePassword{
  overflow:hidden;
}
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
