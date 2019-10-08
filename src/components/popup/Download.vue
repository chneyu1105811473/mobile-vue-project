<template>
    <div class="download">
      <div class="logo">
        <img :src="logo" alt="our logo">
      </div>
      <div class="downloadBtn" @click.stop="haveApp">Download</div>
    </div>
</template>

<script>
import { Dialog } from 'vant'
import logo from '@/assets/img/logo_email.png'

export default {
  name: 'Download',
  data () {
    return {
      logo: logo
    }
  },
  computed: {
    iosDownloadUrl () {
      return this.$store.state.iosDownloadUrl.url
    }
  },
  methods: {
    haveApp () {
      const UA = window.navigator.userAgent.toLowerCase()
      if (UA.includes('android')) {
        Dialog.alert({
          message: 'Only available on the IOS software,\nAndroid coming soon.',
          confirmButtonText: 'OK'
        }).then(() => {})
      } else {
        window.location.href = this.iosDownloadUrl
      }
    }
  }
}
</script>

<style scoped>
.download{
    position: fixed;
    top: 0;
    width: 100%;
    height: .9rem;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    border-bottom: 0.02rem slold rgb(102,102,102);
    z-index: 9999;
}
.logo{
    margin-left: -1rem;
    height: .6rem;
}
.logo img{
    object-fit: contain;
}
.downloadBtn{
    margin-right: .2rem;
    width: 1.6rem;
    height: .6rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 0.24rem;
    color: #fff;
    background: linear-gradient(to right,rgb(52,147,212),rgb(54,100,167));
    border-radius: .3rem;
}
.closeBtn{
    font-size: .4rem;
    position: absolute;
    top: 0;
    right: 0.1rem;
    color: #ccc;
}
.androidPop{
    z-index: 999;
}
@media screen and (min-width:1024px) {
    .download{
        display: none;
    }
}
</style>
