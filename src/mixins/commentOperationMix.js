import {like, dislike, deleteComment, childComment} from '@/api/api'
import {Toast} from 'vant'
import toLogin from '@/mixins/toLoginMix'

export default{
  mixins: [toLogin],
  methods: {
    likeCommentFn (item) {
      item.isLike = !item.isLike
      if (item.isLike) {
        if (item.isDisLike) {
          item.dislikes--
        }
        item.likes++
      } else {
        item.likes--
      }
      item.isDisLike = false
      const query = {
        commentId: item.id,
        likeFlag: item.isLike,
        commentType: this.commentType
      }
      like(query).then(res => {
        if (res.data.code !== '200') {
          Toast({
            type: 'fail',
            message: res.data.message
          })
        }
      }).catch(err => {
        this.toLogin(err)
      })
    },
    dislikeCommentFn (item) {
      item.isDisLike = !item.isDisLike
      if (item.isDisLike) {
        if (item.isLike) {
          item.likes--
        }
        item.dislikes++
      } else {
        item.dislikes--
      }
      item.isLike = false
      const query = {
        commentId: item.id,
        disLikeFlag: item.isDisLike,
        commentType: this.commentType
      }
      dislike(query).then(res => {
        if (res.data.code !== '200') {
          Toast({
            type: 'fail',
            message: res.data.message
          })
        }
      }).catch(err => {
        this.toLogin(err)
      })
    },
    deleteCommentFn () {
      const queryDeleteComment = {
        commentId: this.commentId,
        commentType: this.commentType
      }
      deleteComment(queryDeleteComment).then(res => {
        if (res.data.code === '200') {
          Toast({
            type: 'success',
            message: 'Delete success'
          })
          if (this.childIndex >= 0) {
            this.commentItem.childCommentDtoList.splice(this.childIndex, 1)
            this.commentItem.replyNum--
            this.childIndex = null
          } else {
            this.$emit('deleteComment', this.commentIndex)
          }
        } else {
          Toast({
            type: 'fail',
            message: res.data.message
          })
        }
      }).catch(err => {
        this.toLogin(err)
      })
    },
    seeMoreChildComment () { // index表示父级评论的索引值
      const len = this.commentItem.childCommentDtoList.length
      if (!this.isSeeMoreReply) {
        // this.pageSize = len
        this.commentItem.childCommentDtoList.splice(1)
        this.isSeeMoreReply = true
        return
      }
      if (this.commentItem.replyNum > len) {
        // 查看更多评论
        const CommentIdList = this.commentItem.childCommentDtoList.map(item => item.id)
        const lastId = this.commentItem.childCommentDtoList[len - 1].id
        const data = {
          'commentType': this.commentType,
          'hotChildCommentIdList': CommentIdList,
          'lastId': lastId,
          'originCommentId': this.commentItem.id,
          'lastTimestamp': this.childCommentTimestamp || null,
          'pageSize': 10,
          'rootId': this.rootId
        }
        childComment(data).then(res => {
          if (res.data.code === '200') {
            this.commentItem.childCommentDtoList.splice(len, 0, ...res.data.result.resultData)
            if (res.data.result.hasNext) {
              this.isSeeMoreReply = true
            } else {
              this.isSeeMoreReply = false
            }
            this.childCommentTimestamp = this.commentItem.childCommentDtoList[this.commentItem.childCommentDtoList.length - 1].commentTime
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
