import { Notify } from 'vant'

export default {
  methods: {
    toLogin (err) {
      console.log(err)
      this.isLoading = false
      this.loading = false
      if (!err.response) return
      const status = err.response.status
      if (status === 403) {
        this.$router.replace('/login')
      } else if (status === 500) {
        // 显示network error page，此处需要再商议
        Notify('Network error')
      }
    }

  }
}
