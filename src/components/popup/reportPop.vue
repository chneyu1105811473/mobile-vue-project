<template>
  <div class="dialog">
    <div class="title">{{title}}</div>
    <RadioGroup class="reasons" v-model="reason" icon-size="0.4rem">
      <div
      v-for="item in reasons"
      :key="item.id"
      :class="{'dialogItem':true,'checked':reason.id === item.id}"
      >
        <Radio :name="item">
          {{item.reason}}
          <div class="icon" slot="icon" slot-scope="props">
            <img :src="props.checked ? icon.active : icon.inactive">
          </div>
        </Radio>
      </div>
    </RadioGroup>
    <div class="btns">
      <div class="cancelBtn" @click.stop="closePop">Cancel</div>
      <div :class="{'reportBtn':true,'active':isActive}" @click.stop='reportFn(reason)'>Report</div>
    </div>
  </div>
</template>

<script>
import {RadioGroup, Radio, Toast} from 'vant'
import {reportPost, reportUser, reportComment} from '@/api/api'
import toLogin from '@/mixins/toLoginMix'
import icUncheck from '@/assets/img/icUncheck@2x.png'
import icSelected from '@/assets/img/icSelected@2x.png'

export default {
  name: 'AppCheck',
  props: ['type', 'title', 'reasons', 'rootId', 'commentType'],
  mixins: [toLogin],
  components: {RadioGroup, Radio},
  data () {
    return {
      reason: {},
      icon: {
        active: icSelected,
        inactive: icUncheck
      }
    }
  },
  computed: {
    isActive () {
      return this.reason.id
    }
  },
  methods: {
    closePop () {
      this.$emit('close', true)
    },
    reportFn (reason) { // 举报
      if (!this.isActive) { return false }
      this.reason = reason.reason
      if (this.type.includes('post')) { // 举报帖子
        this.reportPost()
      } else if (this.type.includes('user')) { // 举报用户
        this.reportUser()
      } else if (this.type.includes('comment')) { // 举报评论
        this.reportComment()
      }
    },
    reportPost () {
      // 举报帖子
      const query = {
        postId: this.$route.params.postId,
        reason: this.reason
      }
      reportPost(query).then(res => {
        if (res.data.code === '200') {
          this.$router.push({
            name: 'ReportSuccess'
          })
        } else {
          Toast({
            message: res.data.message
          })
        }
      }).catch(err => {
        this.toLogin(err)
      })
    },
    reportUser () {
      // 举报用户
      const query = {
        reportedMid: this.$route.params.userId,
        reason: this.reason
      }
      reportUser(query).then(res => {
        if (res.data.code === '200') {
          this.$router.push({
            name: 'ReportSuccess'
          })
        } else {
          Toast({
            message: res.data.message
          })
        }
      }).catch(err => {
        this.toLogin(err)
      })
    },
    reportComment () {
      // 举报评论
      const query = {
        commentId: this.rootId,
        commentType: this.commentType,
        reason: this.reason
      }
      reportComment(query).then(res => {
        if (res.data.code === '200') {
          this.$router.push({
            name: 'ReportSuccess'
          })
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
</script>

<style scoped>
    /* shadow & dialog */

.dialog{
  margin: .7rem;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 0.2rem;
  overflow: hidden;
}
.dialog .title{
  padding: 0.5rem 0.6rem;
  font-size:0.36rem;
  color:rgb(66,93,144);
  font-family: SFUIDisplay-Medium;
}
.dialogItem{
  padding:0 0.6rem 0.5rem;
  font-size:0.28rem;
  color:rgb(102,102,102)!important;
  font-family: SFUIDisplay-Regular;
}
.dialogItem.checked{
  color:rgb(66, 93, 144)!important;
}
.icon{
  width:0.3rem;
  height: 0.3rem;
}
.btns{
  width: 100%;
  height: 1rem;
  display: flex;
  justify-content: space-around;
  color: rgb(52 ,100 ,255);
  border-top:0.02rem solid rgb(190,190,198);
}
.cancelBtn,.reportBtn{
  display: flex;
  width: 50%;
  justify-content: center;
  align-items: center;
}
.reportBtn{
  color:rgb(153,153,153);
}
.reportBtn.active{
  color: rgb(52 ,100 ,255);
}
.cancelBtn{
  border-right:0.02rem solid rgb(190,190,198);
}
</style>
