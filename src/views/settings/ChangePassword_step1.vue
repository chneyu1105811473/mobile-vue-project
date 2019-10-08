<template>
    <div class="changePassword">
      <div class="btnBack iconfont" @click="goBack">&#xe65b;</div>
      <p class="title">Change password</p>
      <input-field placeholder="Please enter your current password" type="password" v-model="password"/>
      <div class="forgetPasswordTip" @click="forgetPasswordPopup = true">Forgot password？</div>
      <big-button name="Next" @click.native="checkPassword"/>
      <!-- forget password pop -->
      <popup v-model="forgetPasswordPopup">
        <forget-password-pop @hidePopup="getHidePopup"/>
      </popup>
      <!-- loading -->
      <loading v-show="isLoading"/>
    </div>
</template>

<script>
import {validatePassword} from '@/api/api'
import {Popup, Toast} from 'vant'
import BigButton from '@/components/BigButton'
import InputField from '@/components/InputField'
import NavBar from '@/components/NavBar'
import ForgetPasswordPop from '@/components/popup/ForgetPasswordPop'
import Loading from '@/components/Loading'
import toLoginMix from '@/mixins/toLoginMix'
import md5 from 'MD5'

export default {
  name: 'ChangPassword1',
  components: {NavBar, Popup, BigButton, InputField, ForgetPasswordPop, Loading},
  mixins: [toLoginMix],
  data () {
    return {
      password: '',
      forgetPasswordPopup: false,
      isLoading: false
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    getHidePopup () {
      this.forgetPasswordPopup = false
    },
    checkPassword () {
      this.isLoading = true
      const qurey = {
        // password: this.password,
        password: md5(md5('xplosugar').toUpperCase() + this.password).toUpperCase()
      }
      validatePassword(qurey).then(res => {
        this.isLoading = false
        if (res.data.code === '200') {
          // 到重置密码
          this.$router.push({
            name: 'ChangePassword2'
          })
        } else {
          Toast({
            message: 'Your Password is not correct'
          })
        }
      }).catch(err => {
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
.forgetPasswordTip{
  float: left;
  color: rgb(153,153,153);
  font-size: 0.28rem;
  margin-left: .54rem;
  margin-top: 0;
}

</style>
