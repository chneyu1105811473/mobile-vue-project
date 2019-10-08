import {Dialog} from 'vant'

export default{
  computed: {
    iosUrl () {
      return this.$store.state.iosDownloadUrl.url
    }
  },
  methods: {
    showDialog (obj) {
      const defaultObj = {
        title: 'Title',
        message: 'Message',
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
        closeOnClickOverlay: false,
        className: 'lessPadding'
      }
      const options = Object.assign({}, defaultObj, obj)
      Dialog.confirm({
        title: options.title,
        message: options.message,
        confirmButtonText: options.confirmButtonText,
        cancelButtonText: options.cancelButtonText,
        closeOnClickOverlay: options.closeOnClickOverlay,
        cancelButtonColor: options.cancelButtonColor,
        className: options.className
      }).then(() => {
        // 判断用户是否是android系统
        const ua = navigator.userAgent.toLowerCase()
        if (ua.includes('android')) {
          Dialog.alert({
            message: 'Only available on the IOS software,\nAndroid coming soon.',
            confirmButtonText: 'OK'
          }).then(() => {})
        } else {
          window.location.href = this.iosUrl
        }
      }).catch(() => {
        // 取消跳转
      })
    }
  }
}
