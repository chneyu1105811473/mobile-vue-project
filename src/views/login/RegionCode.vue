<template>
  <div class="areaCode">
    <nav-bar>
      <span slot="left" class="iconfont leftIcon" @click="goBack">&#xe65b;</span>
      <span slot="title" class="title">Select area code</span>
    </nav-bar>
    <telphone-code @sendCountryCode="getCountryCode"/>
  </div>
</template>

<script>
import telphoneCode from './components/TelephoneCode'
import NavBar from '@/components/NavBar'

export default {
  name: 'TelCode',
  components: {telphoneCode, NavBar},
  methods: {
    getCountryCode (val) {
      localStorage.setItem('telCode', val)
    },
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.areaCode{
  font-family: 'Lato', sans-serif;
  height: 100%;
}
.leftIcon{
  font-size: 0.5rem;
}
.title{
  font-family: SFUIDisplay-Medium;
}
</style>
