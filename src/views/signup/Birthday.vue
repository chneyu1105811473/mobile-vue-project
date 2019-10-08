<template>
    <div class="birthdaySetting">
        <div class="iconfont btnBack" @click="goBack">&#xe65b;</div>
        <P class="title">When is your birthday?</P>
        <input-field placeholder="Birthday" value="birthday" :clear="false">
          <template slot="input">
            <div class="birthday">
              {{birthday}}
              <input type="date" placeholder="Birthday" ref="myInput" v-model.trim="birthdayOrigin" @blur="onBlur"
            />
            </div>
          </template>
        </input-field>
        <big-button name="Continue" @click.native="goNext"/>
        <!-- 生日选择器 暂时不用，直接调原生-->
    </div>
</template>

<script>
import InputField from '@/components/InputField'
import BigButton from '@/components/BigButton'
import {Dialog} from 'vant'

export default {
  name: 'BirthdaySetting',
  components: {InputField, BigButton},
  data () {
    return {
      birthdayOrigin: new Date(),
      birthday: ''
    }
  },
  created () {
    this.getBirthday()
  },
  methods: {
    getBirthday (val) {
      let dateData = val ? new Date(val) : new Date()
      const year = dateData.getFullYear()
      let month = dateData.getMonth() + 1
      month = month < 10 ? '0' + month : month
      let day = dateData.getDate()
      day = day < 10 ? '0' + day : day
      this.birthday = `${year}-${month}-${day}`
    },
    goBack () {
      this.$router.push({
        name: 'Username'
      })
    },
    goNext () {
      this.onBlur()
      if (this.isValid) {
        this.$router.push({
          name: 'SignUp',
          query: {
            type: 0
          }
        })
      }
    },
    onBlur () {
      if (!this.birthdayOrigin) {
        return false
      }
      this.getBirthday(this.birthdayOrigin)
      const yearOld = new Date().getFullYear() - new Date(this.birthdayOrigin).getFullYear()
      if (yearOld < 13) {
        // 弹出小于13岁无法注册。。。
        this.isValid = false
        Dialog.alert({
          message: 'You need to be 13 years or older to use XPLO app and services.',
          confirmButtonText: 'OK',
          className: 'morePadding'
        }).then(res => { // close...
        })
        return false
      } else {
        this.isValid = true
        this.$store.state.userInfo.birthday = this.birthday
      }
    }

  }
}
</script>

<style scoped>
.birthdaySetting{
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
.birthday{
  position:relative;
  min-height:0.4rem;
  font-size:0.28rem;
  font-family:'Lato', sans-serif;
  margin-top:0.1rem;
}
.birthday input{
  position:absolute;
  left:0;
  top:0;
  opacity:0;
  z-index: 99;
}
</style>
