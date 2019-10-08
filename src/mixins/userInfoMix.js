import { getUserInfo } from '@/api/api'
import toLogin from '@/mixins/toLoginMix'
import { Toast } from 'vant'

export default {
  mixins: [toLogin],
  methods: {
    getUserInfoFn () {
      const myId = localStorage.getItem('id') * 1
      if (!myId) {
        this.$router.push('/login')
        return
      }
      this.getMyInfo()
      if (this.$route.params.userId !== myId) {
        // 如果id是自己，则获取自己的profile
        // 如果id不是自己，则获取其他用户的profile
        getUserInfo(this.$route.params).then(res => {
          if (res.data.code === '200') {
            this.$store.state.userInfo = Object.assign({}, this.$store.state.userInfo, res.data.result)
            this.$store.state.userInfo.gender = JSON.stringify(this.$store.state.userInfo.gender)
            this.isLoaded = true
          } else {
            Toast({
              message: res.data.message
            })
          }
        }).catch(err => {
          this.toLogin(err)
        })
      }
    },
    getMyInfo () {
      const myId = localStorage.getItem('id') * 1
      getUserInfo({userId: myId}).then(res => {
        if (res.data.code === '200') {
          this.$store.commit('saveMyInfo', res.data.result)
          if (this.$route.params.userId === myId) {
            this.$store.state.userInfo = Object.assign({}, res.data.result)
          }
          localStorage.setItem('username', res.data.result.username)
          this.isLoaded = true
        } else {
          Toast({
            message: res.data.message
          })
        }
      }).catch(err => {
        this.toLogin(err)
      })
    }
  }
}
