<template>
    <div class="appeal">
        <div class="btnBack iconfont" @click="goBack">&#xe65b;</div>
        <div class="appealContainer">
            <div class="emailInput">
                <p class="label">Email</p>
                <input type="text" v-model="email" placeholder="Please enter your email...">
            </div>
            <div class="appealContent">
                <p class="label">Appeal reasons</p>
                <textarea name="" cols="30" rows="10" placeholder="Please enter your reasons" v-model="reason"></textarea>
            </div>
        </div>
        <settings-btn :options="btnOptions" @click="appealFn"/>
    </div>
</template>

<script>
import axios from 'axios'
import SettingsBtn from '@/components/SettingsBtn'
import { Toast } from 'vant'

export default {
  name: 'Appeal',
  components: {SettingsBtn},
  data () {
    return {
      email: '',
      reason: '',
      baseUrl: process.env.BASE_API
    }
  },
  computed: {
    btnOptions () {
      return {
        name: 'Submit',
        isActive: this.reason && this.email
      }
    }
  },
  methods: {
    appealFn () {
      // 调用提交申诉内容
      const query = {
        email: this.email,
        reason: this.reason,
        userId: this.$route.params.userId
      }
      axios.get(`${this.baseUrl}/public/appealAccount`, {params: query}).then(res => {
        if (res.data.code === '200') {
          this.$router.push({
            name: 'AppealReceived',
            params: this.$route.params
          })
        } else {
          Toast({
            message: res.data.message
          })
        }
      })
    },
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.btnBack{
  position: absolute;
  top: .2rem;
  left: .2rem;
  font-size: .5rem;
  z-index: 999;
}
.appeal{
    font-family: SFUIDisplay-Medium;
}
.appealContainer{
    padding: 1rem;
    box-sizing: border-box;
}
.label{
    font-size: 0.32rem;
    color: rgb(153,153,153);
}
.emailInput{
    border-bottom: 0.02rem solid rgb(190,190,198);
}
.emailInput input{
    padding: 0.1rem 0;
    width: 100%;
    font-size: 0.4rem;
    color: rgb(102,102,102);
}
.emailInput input::placeholder{
  color: rgb(190,190,198);
}
.appealContent{
    margin-top: 1rem;
}
.appealContent textarea::placeholder{
    font-size: 0.4rem;
    color: rgb(190,190,198);
}
.appealContent textarea{
    width: 100%;
    font-size: 0.4rem;
    color: rgb(153,153,153);
}
</style>
