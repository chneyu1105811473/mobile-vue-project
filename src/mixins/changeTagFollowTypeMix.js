import { changeTagFollowTypeFn } from '@/api/api'
import toLogin from '@/mixins/toLoginMix'
import {Toast} from 'vant'

export default {
  mixins: [toLogin],
  methods: {
    changeTagFollowType (item) {
      this.query = {
        tagId: item.id,
        type: item.isFollowed ? 0 : 1
      }
      changeTagFollowTypeFn(this.query).then(res => {
        if (res.data.code === '200') {
          this.page = 1
          this.allTags = []
          item.isFollowed = !item.isFollowed
          if (this.getTagData) {
            this.getTagData()
          }
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
