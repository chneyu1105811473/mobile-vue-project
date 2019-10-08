import inobounce from 'iNoBounce'

export default{
  created () {
    // 阻止浏览器的弹簧行为
    let u = navigator.userAgent
    if (u.indexOf('iPhone') > -1) {
      inobounce.enable()
    }
  },
  beforeDestroy () {
    inobounce.disable()
  }
}
