<template>
  <div class="download" :class="{'bounceInDown':isShow}" v-show="isShow">
    <div class="logo">
      <img :src="logo" alt="our logo">
    </div>
    <div class="downloadBtn" @click.stop="haveApp">Download</div>
    <div class="closeBtn" @click="isShow = false">&times;</div>
  </div>
</template>

<script>
import { Dialog } from 'vant'
import logo from '@/assets/img/logo_email.png'

export default {
  name: 'DownloadPop',
  data () {
    return {
      logo: logo,
      isShow: true,
      duration: 300000 // 关闭下载弹框之后，每隔5分钟再次弹出
    }
  },
  computed: {
    iosDownloadUrl () {
      return this.$store.state.iosDownloadUrl.url
    }
  },
  watch: {
    isShow (val) {
      if (!val) {
        setTimeout(() => {
          this.isShow = true
        }, this.duration)
      }
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
    left: 0;
    width: 100%;
    z-index: 9999;
    height: .9rem;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    box-shadow: 0 0.05rem 0.05rem rgba(201,201,201,.8);
}
.logo{
    margin-left: -.8rem;
    height: .6rem;
}
.logo img{
    object-fit: contain;
}
.downloadBtn{
    margin-right: .4rem;
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
