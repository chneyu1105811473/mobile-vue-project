import {timeFormate} from '@/plugins/timeFormate'
import {likeOrDislikePost} from '@/api/api'
import toLogin from './toLoginMix'
import {Toast} from 'vant'

export default{
  mixins: [toLogin],
  methods: {
    likeOrDislikeFn (val, item, likeList = []) { // val :0表示dislike,1表示like,2表示疯狂点赞,item表示detailData
      if (!this.tempCountDown) {
        this.tempCountDown = item.postStatisticsDto.countDown
      }
      this.crazyLikeArray = []
      if (val === 1) {
        item.isLiked = item.isLiked ? 0 : 1
        if (item.isLiked && item.isDisLiked) {
          item.postStatisticsDto.dislikes--
          item.postStatisticsDto.likes++
          this.tempCountDown += 30 * 60 * 1000 * 2
        } else if (item.isLiked && !item.isDisLiked) {
          item.postStatisticsDto.likes++
          this.tempCountDown += 30 * 60 * 1000
        } else if (!item.isLiked && !item.isDisLiked) {
          item.postStatisticsDto.likes--
          this.tempCountDown -= 30 * 60 * 1000
        }
        item.isDisLiked = 0
      } else if (val === 0) {
        item.isDisLiked = item.isDisLiked ? 0 : 1
        if (item.isLiked && item.isDisLiked) {
          item.postStatisticsDto.dislikes++
          item.postStatisticsDto.likes--
          this.tempCountDown -= 30 * 60 * 1000 * 2
          this.isDislike = true
        } else if (!item.isLiked && item.isDisLiked) {
          item.postStatisticsDto.dislikes++
          this.tempCountDown -= 30 * 60 * 1000
          this.isDislike = true
        } else if (!item.isLiked && !item.isDisLiked) {
          item.postStatisticsDto.dislikes--
          this.tempCountDown += 30 * 60 * 1000
          this.isDislike = false
        }
        item.isLiked = 0
      } else {
        if (!item.isLiked) {
          item.postStatisticsDto.likes++
          if (item.isDisLiked) {
            item.postStatisticsDto.dislikes--
          }
          this.tempCountDown += 30 * 60 * 1000 * 2
        }
        item.isLiked = 1
        item.isDisLiked = 0
        this.crazyLikeArray.push({
          isLike: true
        })
      }

      const countDown = this.tempCountDown + this.crazyLikeArray.length * 10 * 1000
      item.postStatisticsDto.countDown = countDown
      if (this.postLife) {
        this.postLife.splice(0, this.postLife.length, ...timeFormate(countDown).life)
      }
      this.toggleUsername(item, likeList)
      const data = {
        'dislike': item.isDisLiked,
        'like': item.isLiked,
        'likeAmount': this.crazyLikeArray.length,
        'postId': item.id
      }
      likeOrDislikePost(data).then(res => {
        if (res.data.code === '200') {
          // const countDown = this.tempCountDown + this.crazyLikeArray.length * 10 * 1000
          // this.postLife.splice(0, this.postLife.length, ...timeFormate(countDown).life)
        } else {
          Toast({
            message: res.data.message
          })
        }
      }).catch(err => {
        this.toLogin(err)
      })
    },
    toggleUsername (item, likeList) {
      const username = localStorage.getItem('username')
      if (item.isLiked) {
        likeList.unshift(username)
      } else {
        // 登录注册字母部分大小写，大写和小写是相同的
        const index = likeList.findIndex(item => item.toLowerCase() === username.toLowerCase())
        if (index >= 0) {
          likeList.splice(index, 1)
        }
      }
    }
  }
}
