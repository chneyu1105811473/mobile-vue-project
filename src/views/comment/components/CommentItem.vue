<template>
  <div class="contentItem">
    <!-- parentComment -->
    <swipe-cell :disabled="!commentItem.isAbleDelete" :on-close="onClose">
      <div :class="{'parentContainer':true,'topComment':topCommentId === commentItem.id}">
        <div class="userInfo">
            <div class="userIcon">
              <router-link :to="{'name':'ProfileDetail',params:{'userId':commentItem.memberDto.id}}">
                <img v-lazy="commentItem.memberDto.icon">
              </router-link>
            </div>
            <div class="username">{{commentItem.memberDto.username}}</div>
            <div class="commentTime">{{commentItem.commentTime|createTime}}</div>
        </div>
        <content-formate :content="commentItem.commentContent"/>
        <comment-operation
        :commentObj="commentItem"
        @deliverCommentObj="deliverCommentObjFn"
        @handleDelete="handleDeleteFn"
        />
      </div>
      <span slot="right" class="iconfont deleteIcon" @click="saveCommentId(commentItem)">&#xe632;</span>
    </swipe-cell>

      <!-- reply -->
      <swipe-cell
      v-for="(replyItem,replayIndex) in commentItem.childCommentDtoList"
      :key="replyItem.id"
      :disabled="!commentItem.isAbleDelete"
      :on-close="onClose">
        <div :class="{'hasReply':true,'topComment':topCommentId === replyItem.id}">
          <div class="userInfo" >
              <div class="userIcon">
                <router-link :to="{'name':'ProfileDetail','params':{userId:replyItem.memberDto.id}}">
                  <img v-lazy="replyItem.memberDto.icon">
                </router-link>
              </div>
              <div class="username">{{replyItem.memberDto.username}}</div>
              <div class="commentTime">{{replyItem.commentTime|createTime}}</div>
          </div>
          <content-formate :content="replyItem.commentContent"/>
          <comment-operation
          :commentObj="replyItem"
          :index="replayIndex"
          @deliverCommentObj="deliverCommentObjFn"
          @handleDelete="handleDeleteFn"
          />
        </div>
        <span slot="right" class="iconfont deleteIcon" @click="saveCommentId(replyItem,replayIndex)">&#xe632;</span>
      </swipe-cell>
    <!-- see more replies -->
    <template v-if="replyNum>1">
      <div class="moreReplies" @click="seeMoreChildComment">
        {{isSeeMoreReply?`———— See more comments(${num})`:`———— Hide reply`}}
      </div>
    </template>
  </div>
</template>

<script>
import {SwipeCell, Dialog} from 'vant'
import commentOperation from './CommentOperations'
import ContentFormate from './ContentFormate'
import commentOperations from '@/mixins/commentOperationMix'

export default {
  name: 'CommentItem',
  props: {
    commentItem: {
      default: function () {
        return {
          childCommentDtoList: []
        }
      },
      type: Object
    },
    commentIndex: {
      default: 0,
      type: Number
    },
    rootId: {
      default: 0,
      type: Number
    },
    commentType: {
      default: 0,
      type: Number
    }
  },
  components: {SwipeCell, Dialog, commentOperation, ContentFormate},
  mixins: [commentOperations],
  computed: {
    replyNum () {
      return this.commentItem.replyNum
    },
    topCommentId () {
      return this.$route.query.commentId
    },
    num () {
      // this.commentItem.childCommentDtoList = this.commentItem.childCommentDtoList || []
      const num = this.commentItem.replyNum ? (this.commentItem.replyNum - this.commentItem.childCommentDtoList.length) : this.commentItem.replyNum
      if (num >= 1000000000000) {
        return Math.round(num / 1000000000000) + 't'
      } else if (num >= 1000000000) {
        return Math.round(num / 1000000000) + 'b'
      } else if (num >= 1000000) {
        return Math.round(num / 1000000) + 'm'
      } else if (num >= 1000) {
        return Math.round(num / 1000) + 'k'
      } else {
        return num
      }
    },
    isSeeMoreReply: {
      get () {
        const notZore = this.commentItem.replyNum && (this.commentItem.replyNum - this.commentItem.childCommentDtoList.length)
        return !!(notZore)
      },
      set () {}
    }
  },
  methods: {
    deliverCommentObjFn (item, type) {
      this.$emit('deliverCommentId',
        {obj: item, index: this.commentIndex},
        type
      )
    },
    handleDeleteFn (item, index) {
      this.saveCommentId(item, index)
      Dialog.confirm({
        message: 'Delete comment',
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        className: 'morePadding'
      }).then(() => {
        // 调删除评论接口
        this.deleteCommentFn()
      }).catch(() => {})
    },
    saveCommentId (item, index) {
      this.commentId = item.id
      this.childIndex = index
    },
    onClose (clickPosition, instance) {
      switch (clickPosition) {
        case 'left':
        case 'cell':
        case 'outside':
          instance.close()
          break
        case 'right':
          Dialog.confirm({
            message: 'Delete comment',
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            className: 'morePadding'
          }).then(() => {
            // 调删除评论接口
            this.deleteCommentFn()
          }).catch(() => {
            instance.close()
          })
          break
      }
    }
  }
}
</script>

<style scoped>
.parentContainer{
    padding:0 0.2rem;
}
.userInfo{
    display: flex;
    align-items: center;
}
.userIcon{
    min-width: 0.64rem;
    width: 0.64rem;
    height: 0.64rem;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 0.2rem;
}
.username{
    font-family: SFUIDisplay-Medium;
    font-size: 0.32rem;
}
.commentTime{
    width: 100%;
    display: flex;
    justify-content: flex-end;
    color: rgb(153,153,153);
    font-size: 0.24rem;
}
.content{
    padding-left: .84rem;
    font-family: SFUIDisplay-Regular;
    font-size: 0.28rem;
}
.content span{
    font-family: SFUIDisplay-Medium;
}
.hasReply{
    padding: 0.2rem 0.2rem 0.1rem 0.8rem;
    box-sizing:border-box;
}
.hasReply .userIcon{
    width: 0.48rem;
    height: 0.48rem;
    min-width: 0.48rem;
    min-height: 0.48rem;
}
.hasReply .content{
    padding-left: 0.64rem;
}
.moreReplies{
  font-size: 0.2rem;
  color: rgb(153,153,153);
  text-indent: .6rem;
}
.deleteIcon{
  font-size: 0.42rem;
  color: #fff;
}
.topComment{
  animation: highlightAnimation 500ms ease-in-out 500ms 2;
}
@keyframes highlightAnimation{
  0%{
    background: rgba(153,153,153,.1)
  }
  25%{
    background: rgba(153,153,153,.3)
  }
  50%{
    background: rgba(153,153,153,.5)
  }
  75%{
    background: rgba(153,153,153,.2)
  }
  100%{
    background: rgba(153,153,153,0)
  }
}
</style>
