<template>
  <div class="commentOperation">
    <div class="like icon" @click="likeCommentFn(commentObj)">
      <span class="iconfont" :class="{'active':commentObj.isLike}">
        {{commentObj.isLike?'&#xe801;':'&#xe618;'}}
      </span>
      <span :class="{'active':commentObj.isLike}">
          {{commentObj.isLike?'+':''}}{{commentObj.likes|formateNum}}
      </span>
    </div>
    <div class="dislike icon" @click="dislikeCommentFn(commentObj)">
      <span class="iconfont" :class="{'active':commentObj.isDisLike}">
        {{commentObj.isDisLike?'&#xe800;':'&#xe613;'}}
      </span>
      <span :class="{'active':commentObj.isDisLike}">
        {{commentObj.isDisLike?'+':''}}{{commentObj.dislikes|formateNum}}
      </span>
    </div>
    <div class="flexEnd">
    <div class="delete" v-if="isSelf" @click="deleteComment">Delete</div>
    <div class="report" v-else @click="deliverCommentObj(commentObj,0)">Report</div>
    <div class="reply" @click="deliverCommentObj(commentObj,1)">Reply</div>
    </div>
  </div>
</template>

<script>
import commentOperations from '@/mixins/commentOperationMix'

export default {
  name: 'CommentOperations',
  props: {
    commentObj: {
      default: function () {
        return {}
      },
      type: Object
    },
    index: {
      default: -1,
      type: Number
    }
  },
  mixins: [commentOperations],
  data () {
    return {
      commentType: 0
    }
  },
  computed: {
    isSelf () {
      return this.commentObj.creatorId === localStorage.getItem('id') * 1
    }
  },
  methods: {
    deliverCommentObj (obj, type) { // type  0表示举报，1表示评论
      this.$emit('deliverCommentObj', obj, type)
    },
    deleteComment () {
      this.$emit('handleDelete', this.commentObj, this.index)
    }
  }

}
</script>

<style scoped>
.commentOperation{
    display: flex;
    align-items: center;
    padding-left: .84rem;
    font-size: 0.24rem;
    color: rgb(153,153,153);
}
.commentOperation .icon{
    display: flex;
    align-items: center;
}
.like{
    margin-right: 0.4rem;
}
.flexEnd{
    width: 100%;
    display: flex;
    justify-content: flex-end;
    padding-right: 0.2rem;
}
.report,.delete{
    margin-right: 0.5rem;
}
.iconfont{
  font-size:0.4rem;
}
.active{
  color: rgb(66,93,144);
  animation:likeAnim 300ms;
}
</style>
