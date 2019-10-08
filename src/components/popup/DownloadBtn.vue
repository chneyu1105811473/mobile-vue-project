<template>
    <div
    class="downloadBtn"
    @click.stop="haveApp"
    @touchstart="touchstartFn"
    @touchmove="touchmoveFn"
    @touchend="touchendFn">
      XPLO&nbsp;&nbsp;>>
    </div>
</template>

<script>

import { Dialog } from 'vant'

export default {
  name: 'DownloadBtn',
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
    },
    touchstartFn (e) {
      e.stopPropagation()
      this.X = e.changedTouches[0].pageX - e.target.offsetLeft
      this.Y = e.changedTouches[0].pageY - e.target.offsetTop
      e.target.style.borderRadius = '.3rem .3rem .3rem .3rem'
    },
    touchmoveFn (e) {
      e.stopPropagation()
      e.preventDefault()
      this.dragX = e.changedTouches[0].pageX - this.X
      this.dragY = e.changedTouches[0].pageY - this.Y
      e.target.style.top = this.dragY + 'px'
      e.target.style.left = this.dragX + 'px'
    },
    touchendFn (e) {
      e.stopPropagation()
      const offset = e.target.getBoundingClientRect()
      if (offset.left < 0) {
        this.dragX = 0
        e.target.style.borderRadius = ' 0 .3rem .3rem 0'
      }
      if (offset.top < 0) {
        this.dragY = 0
        e.target.style.borderRadius = ' 0 0 .3rem .3rem'
      }
      if (offset.top + e.target.offsetHeight > window.innerHeight) {
        this.dragY = window.innerHeight - e.target.offsetHeight
        e.target.style.borderRadius = '.3rem .3rem 0 0 '
      }
      if (offset.left + e.target.offsetWidth > window.innerWidth) {
        this.dragX = window.innerWidth - e.target.offsetWidth
        e.target.style.borderRadius = '.3rem 0 0 .3rem'
      }
      e.target.style.top = this.dragY + 'px'
      e.target.style.left = this.dragX + 'px'
    }
  }
}
</script>

<style scoped>
.downloadBtn{
  position: fixed;
  top: 40%;
  right: 0;
  width: 1.5rem;
  height: .6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.24rem;
  color: #fff;
  background: rgb(26,140,253);
  border-radius:.3rem 0 0 .3rem;
  z-index:9999;
}
</style>
