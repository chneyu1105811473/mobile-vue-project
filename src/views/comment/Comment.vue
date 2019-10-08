<template>
    <div class="comment">
      <nav-bar :fixed="false">
        <span slot="left" class="iconfont leftIcon" v-show="!hasRightIcon" @click="onClickLeft">&#xe65b;</span>
        <span slot="title">Comment</span>
        <span slot="right" class="rightIcon iconfont" v-show="hasRightIcon" @click="onClickRight">&#xe711;</span>
      </nav-bar>
      <div class="messageContent">
        <list
        v-model="loading"
        :finished="finished"
        finished-text="Already show all comments."
        @load="getAllComments"
        v-show="!isEmpty"
        >
          <template slot="loading">
            <lottie :height="50"  :width="100" :options="defaultOptions2"/>
          </template>
          <template  v-for="(item,index) in allComments">
            <comment-item
            :finished="finished"
            :commentItem="item"
            :commentIndex="index"
            :rootId="rootId"
            :commentType="commentType"
            :key="item.id"
            class="itemContent"
            @deleteComment="deleteCommentFn"
            @deliverCommentId="getCommentIdFn"
            />
          </template>
        </list>
        <!-- empty page -->
        <empty-page v-if="isEmpty"/>
      </div>
       <!-- 输入框 -->
        <div class="commentInput" v-show="!isFriends">
          <notice-bar
          mode="closeable"
          color="rgb(153,153,153)"
          background="rgb(224,224,224)"
          v-if="showNotice" @click="closeFn"
          >
             {{this.notice}}
          </notice-bar>
          <cell-group :border="false" class="paddingBox">
              <Field
              v-model="comment"
              type="textarea"
              placeholder="Add a comment"
              :border="false"
              rows="1"
              autosize
              ref="input"
              class="fixedBottom"
              >
              <Button slot="button" size="small" @click="addCommentFn">Send</Button>
              </Field>
          </cell-group>
        </div>
      <!-- report pop -->
      <popup v-model="isReport" get-container="#app">
        <report-pop
        type="comment"
        title="Report comment"
        :reasons="reportReasons"
        :rootId="rootId"
        :commentType="commentType"
        @close="isReport = false"/>
      </popup>

      <!-- friends pop -->
      <popup
      :overlay="false"
      v-model="isFriends"
      position="bottom"
      get-container="#app"
      @open="showFriend = true"
      @closed="showFriend = false"
      >
        <friends v-if="showFriend||isFriends" @close="onClose"/>
      </popup>
    </div>
</template>

<script>
import {List, Cell, CellGroup, Field, Button, NoticeBar, Popup, Toast} from 'vant'
import EmptyPage from '@/components/EmptyPage'
import ReportPop from '@/components/popup/ReportPop'
import NavBar from '@/components/NavBar'
import CommentItem from './components/CommentItem'
import Friends from './Friends'
import commentOperations from '@/mixins/commentOperationMix'
import toLogin from '@/mixins/toLoginMix'
import {commentList, specificCommentList, addComment} from '@/api/api'
import Lottie from 'vue-lottie'
import animationData2 from '@/assets/data/refresh02.json'

export default {
  name: 'Comment',
  props: {
    rootId: {
      default: 0,
      type: Number
    },
    commentType: {
      default: 0,
      type: Number
    }
  },
  components: {
    CellGroup,
    Cell,
    Field,
    Button,
    CommentItem,
    NoticeBar,
    List,
    EmptyPage,
    ReportPop,
    Popup,
    NavBar,
    Friends,
    Lottie
  },
  mixins: [commentOperations, toLogin],
  data () {
    return {
      comment: '',
      allComments: [],
      commentList: [],
      commentId: null,
      notice: '',
      focus: false,
      finished: false,
      showNotice: false,
      loading: false,
      pageSize: 5,
      isReport: false,
      isFriends: false,
      showFriend: false,
      reportReasons: [{
        id: 1,
        reason: 'Unwanted commercial content or spam'
      }, {
        id: 2,
        reason: 'Pornography or sexually explicit material'
      }, {
        id: 3,
        reason: 'Hate speech or graphic violence'
      }, {
        id: 4,
        reason: 'Harassment or bullying'
      } ],
      defaultOptions2: {
        animationData: animationData2
      },
      isEmpty: false
    }
  },
  computed: {
    atSomeone () {
      return this.$store.state.commentAtSomeone
    },
    hasRightIcon () {
      return !this.$route.name.includes('Comment')
    }
  },
  watch: {
    comment (val, old) {
      this.showNotice = !!((this.commentId && !val.match(this.tempText)))
      if (val.match(/(\w*|\w+\s*)@$/) && val.length > old.length) {
        this.$refs.input.blur()
        // 弹出好友列表
        setTimeout(() => {
          this.isFriends = true
        }, 200)
      }
    },
    allComments (val) {
      this.isEmpty = !(val.length)
    }
  },
  methods: {
    onClickLeft () {
      this.$router.go(-1)
    },
    onClickRight () {
      this.$emit('close', true)
    },
    getAllComments () {
      const query = {
        rootId: this.$route.params.rootId || this.rootId,
        commentType: this.$route.params.commentType || this.commentType || 0, // 0：post的评论，1：tour的评论
        topCommentId: this.$route.query.commentId, // 消息置顶
        lastTimestamp: this.lastTimestamp || null,
        pageSize: this.pageSize
      }
      Promise.all([specificCommentList(query), commentList(query)]).then(res => {
        this.specificCommentList = res[0].data.result// 特殊评论
        this.commentList.splice(this.commentList.length, 0, ...res[1].data.result.resultData)// 一般评论
        this.allComments = this.specificCommentList.concat(this.commentList)
        this.loading = false
        this.lastTimestamp = this.commentList.length ? this.commentList[this.commentList.length - 1].commentTime : null
        this.finished = !res[1].data.result.hasNext
      }).catch(err => {
        this.toLogin(err)
      })
    },
    addCommentFn () {
      if (!this.comment) return
      const data = {
        commentContent: this.comment,
        commentType: this.$route.params.commentType || this.commentType || 0,
        parentCommentId: this.commentId,
        rootId: this.rootId
      }
      addComment(data).then(res => {
        if (res.data.code === '200') {
          if (this.commentId) {
            if (!this.allComments[this.commentIndex].childCommentDtoList) {
              this.allComments[this.commentIndex].childCommentDtoList = []
            }
            this.allComments[this.commentIndex].childCommentDtoList.push(res.data.result)
            this.allComments[this.commentIndex].replyNum++
          } else {
            this.allComments.push(res.data.result)
          }
          this.comment = ''
          this.commentId = null
          this.commentList = []
        } else {
          Toast(res.data.message)
          return false
        }
      }).catch(err => {
        this.toLogin(err)
      })
    },
    getCommentIdFn (val, type) { // type  0表示举报，1表示评论
      this.commentId = val.obj.id
      this.commentIndex = val.index
      if (type === 1) { // 评论
        this.notice = `Replying to ${val.obj.creatorName}`
        this.tempText = `@${val.obj.creatorName} `
        this.comment = this.tempText
        this.focus = true
      } else if (type === 0) { // 举报
        this.isReport = true
      }
    },
    deleteCommentFn (i) {
      this.allComments.splice(i, 1)
    },
    closeFn () {
      this.commentId = null
    },
    fillComment () {
      const str = this.comment.slice(0, -1) + ' '
      const temp = this.atSomeone.reduce((accu, currentVal) => {
        return accu + '@' + currentVal.username + ' '
      }, str)
      this.comment = temp
    },
    onClose () {
      this.isFriends = false
      if (this.atSomeone.length) {
        this.fillComment()
      }
    }
  }
}
</script>

<style scoped>
.comment{
  position: relative;
  background-color: #fff;
  height: 100%;
}
.messageContent{
  height: calc(100% - 1.1rem - 1rem);
  overflow-y: auto;
}
.itemContent{
  padding:0.2rem 0;
}
.commentInput{
  position: absolute;
  bottom: 0;
  left:0;
  width: 100%;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
.paddingBox{
  padding: 0.14rem;
  box-sizing: border-box;
  background-color: rgb(239,239,246);
}
.fixedBottom{
  padding: 0.1rem 0 0.1rem 0.1rem;
  box-sizing: border-box;
  border-radius:0.1rem;
  background-color: #fff;
}
/* field 样式 */
.fixedBottom button{
  border:none;
  color:rgb(54,101,167);
  font-size: 0.28rem;
}
.leftIcon{
  font-size: 0.5rem;
}
.rightIcon{
  font-size: 0.5rem;
}
</style>
