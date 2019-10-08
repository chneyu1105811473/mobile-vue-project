<template>
  <div class="resetForm">
    <p class="capture">Your password must be at least <br/> 8 characters and include numbers. </p>
    <div class="password">
      <p>New password</p>
      <div class="border_bottom">
          <input type="password" v-model="newPassword" ref="password" @blur="matchCheck" autofocus>
          <i v-show="newPassword" class="input_eye" @click="showPassword"></i>
      </div>
    </div>
    <div class="password2">
      <p>Confirm your new password</p>
      <div class="border_bottom">
        <input type="password" v-model="newPassword2" ref="password2" @blur="checkNewPassword">
        <i v-show="newPassword2" class="input_eye" @click="showPassword2"></i>
      </div>
    </div>
    <p class="valid_tips" ref="validTip"></p>
    <div class="btn">
      <SettingsBtn :options="btnOptions" @click="changePassword"/>
    </div>
  </div>
</template>

<script>
import loginEyeOpenNormal from '@/assets/img/loginEyeOpenNormal@2x.png'
import loginEyeOpenSelected from '@/assets/img/loginEyeOpenSelected@2x.png'
import SettingsBtn from '@/components/SettingsBtn'
import md5 from 'MD5'

export default {
  name: 'ResetPasswordForm',
  components: {SettingsBtn},
  data () {
    return {
      newPassword: '',
      newPassword2: '',
      passwordNotSame: 'The passwords have to be the same！',
      passwordNotMatch: 'Passwords must match！',
      isMatch: false,
      loginEyeOpenNormal: loginEyeOpenNormal,
      loginEyeOpenSelected: loginEyeOpenSelected,
      btnOptions: {
        name: 'Reset',
        isActive: false
      }
    }
  },
  computed: {
    isActive () {
      return this.newPassword && this.newPassword2 && this.newPassword === this.newPassword2 && this.isMatch
    }
  },
  watch: {
    isActive (val) {
      this.btnOptions.isActive = val
    },
    newPassword (val) {
      this.newPassword = val.replace(/\s*/g, '')
    },
    newPassword2 (val) {
      this.newPassword2 = val.replace(/\s*/g, '')
    }
  },
  methods: {
    showPassword (e) {
      const type = this.$refs.password.type
      if (type.indexOf('password') > -1) {
        this.$refs.password.type = 'text'
        e.target.style.backgroundImage = `url(${loginEyeOpenSelected})`
      } else {
        this.$refs.password.type = 'password'
        e.target.style.backgroundImage = `url(${loginEyeOpenNormal})`
      }
    },
    showPassword2 (e) {
      const type = this.$refs.password2.type
      if (type.indexOf('password') > -1) {
        this.$refs.password2.type = 'text'
        e.target.style.backgroundImage = `url(${loginEyeOpenSelected})`
      } else {
        this.$refs.password2.type = 'password'
        e.target.style.backgroundImage = `url(${loginEyeOpenNormal})`
      }
    },
    matchCheck () {
      if (!this.newPassword) {
        return false
      }
      if (this.newPassword.match(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/)) {
        this.isMatch = true
        this.$refs.validTip.innerHTML = ''
      } else {
        this.isMatch = false
        this.$refs.validTip.innerHTML = this.passwordNotMatch
      }
    },
    checkNewPassword () {
      if (!this.isMatch || !this.newPassword2) {
        return
      }
      if (this.newPassword !== this.newPassword2) {
        this.$refs.validTip.innerHTML = this.passwordNotSame
      } else {
        this.$refs.validTip.innerHTML = ''
      }
    },
    changePassword (val) {
      // this.password = this.newPassword
      this.password = md5(md5('xplosugar').toUpperCase() + this.newPassword).toUpperCase()
      this.$emit('resetPassword', this.password)
    }
  }
}
</script>

<style scoped>
/* 重置密码 */
.resetForm{
    padding: 0 1rem;
    font-family: SFUIDisplay-Medium;
    color:rgb(153,153,153);
}
.capture{
  text-align: center;
  font-size: 0.32rem;
  line-height: 0.4rem;
  color: rgb(130,167,208);
}
.resetForm .password{
    margin-bottom:0.6rem;
}
.border_bottom{
    position: relative;
    border-bottom: 0.02rem solid rgba(190,190,198,1);
    padding-bottom:0.2rem;
}
.checkbox{
    width:0.28rem;
    height: 0.24rem;
    border: 0.02rem solid rgba(54,101,167,1);
    border-radius: 0.04rem;
}
.valid_tips{
    position: absolute;
    margin-top:0.2rem;
    font-family: SFUIDisplay-Regular;
    color:rgb(255,21,13);
    font-size:0.28rem;
}
.input_eye{
    position: absolute;
    right: 0;
    top:0;
    z-index: 20;
    width:0.5rem;
    height: 0.4rem;
    background-position: 0 0;
    background-repeat:  no-repeat;
    background-image: url(../assets/img/loginEyeOpenNormal@2x.png);
    background-size: cover;
}
.btn{
  position: relative;
  margin-top: 1.5rem;
}
</style>
