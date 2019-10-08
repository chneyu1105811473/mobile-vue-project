<template>
  <div class="nickSetting">
    <div class="btnBack iconfont" @click="goBack">&#xe65b;</div>
    <P class="title">Create your username.</P>
    <input-field placeholder="Username" v-model="text"/>
    <p class="tips">{{invalidTip}}</p>
    <big-button name="Continue" @click.native="goNext"/>
    <!-- loading -->
    <loading v-show="isLoading"/>
  </div>
</template>

<script>
import {Toast} from 'vant'
import Loading from '@/components/Loading'
import InputField from '@/components/InputField'
import BigButton from '@/components/BigButton'
import axios from 'axios'

export default {
  name: 'UsernameSetting',
  components: {InputField, BigButton, Loading},
  data () {
    return {
      invalidTip: '',
      text: '',
      tips: {
        lengthInvalid: 'This length should between 3 and 20!'
      },
      baseUrl: process.env.BASE_API,
      isLoading: false
    }
  },
  methods: {
    goBack () {
      this.$router.push('/login')
    },
    goNext () {
      this.checkUsername(this.text)
    },
    checkUsername (text) {
      if (!text) {
        Toast({
          message: 'Please enter your username.'
        })
        return false
      }
      this.isLoading = true
      this.nick = text.replace(/\s*|\W|\.|_/g, '')
      if (this.nick.length < 3 || this.nick.length > 20) {
        this.invalidTip = this.tips.lengthInvalid
        this.isLoading = false
        return false
      } else {
        this.invalidTip = ''

        //   this.nick接口验证是否已经使用
        axios.get(`${this.baseUrl}/public/checkNameUnique?newUserName=${this.nick}`)
          .then(res => {
            if (res.data.code === '200') {
              this.invalidTip = ''
              this.$store.state.userInfo.username = this.nick
              this.$router.push({
                name: 'Birthday'
              })
            } else {
              this.invalidTip = res.data.message
            }
            this.isLoading = false
          }).catch(() => {
            this.isLoading = false
          })
      }
    }
  }
}
</script>

<style scoped>
.nickSetting{
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
  font-family: 'Lato', sans-serif;
  font-size: 0.35rem;
  color: rgb(102,102,102);
  margin:1.65rem 0.54rem 0.54rem;
}
.tips{
  margin-top: -0.1rem;
  font-family:'Lato', sans-serif;
  text-indent: 0.54rem;
  color:rgb(243,95,89);
  font-size:0.26rem;
}
</style>
