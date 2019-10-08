import {followPeople, cancelFollowPeople} from '@/api/api'
import toLogin from '@/mixins/toLoginMix'
import {Dialog, Toast} from 'vant'

export default{
  mixins: [toLogin],
  methods: {
    followPeopleFn (item) { // 关注某人和取关  item为memberDto
      const query = {
        userId: item.id
      }
      if (item.isFollowing) {
        Dialog.confirm({
          message: 'Are you sure to unfollow?',
          confirmButtonText: 'Yes',
          cancelButtonText: 'Cancel',
          closeOnClickOverlay: true,
          className: 'morePadding'
        }).then(() => { // 确认取消关注
          cancelFollowPeople(query).then(res => {
            if (res.data.code === '200') {
              item.isFollowing = false
            } else {
              Toast({
                message: res.data.message
              })
            }
          }).catch(err => {
            this.toLogin(err)
          })
        }).catch(() => {
          // 取消
          console.log('取消')
        })
      } else {
        followPeople(query).then(res => {
          if (res.data.code === '200') {
            item.isFollowing = true
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
}
