<template>
  <div class="messageList">
      <list
      v-model="loading"
      :finished="finished"
      finished-text="Already show all messages."
      @load="onLoad"
      v-show="!isEmpty"
      >
        <template slot="loading">
            <lottie :height="50"  :width="100" :options="defaultOptions2"/>
        </template>
        <cell v-for="(item,index) in list" :key="index">
          <div  class="messageItem">
            <!-- 消息类型 post  0 -->
            <div  @click="goDetailPage(item.msgDetail.postDto)" v-if="item.msgType === 0">
              <div class="avator" @click.stop="goProfilePage(item.msgDetail.memberDto)">
                <img v-lazy="item.msgDetail.memberDto.icon" alt="icon">
              </div>
              <div class="message">
                <div class="content">
                  <span class="username" @click.stop="goProfilePage(item.msgDetail.memberDto)">{{item.msgDetail.memberDto.username}}</span>
                   liked
                  <span @click.stop="goProfilePage(item.bearMemberDto)">
                    {{item.levelType===0?'your':item.bearMemberDto.username+"'s"}}
                  </span>
                  post.
                </div>
                <div class="time">
                  {{item.unixTime|timeAndDate}}
                </div>
              </div>
              <div class="detailImage">
                <img v-lazy="item.msgDetail.postDto.imageUrl" alt="post image">
              </div>
            </div>
            <!-- 消息类型 post collection 1 -->
            <div v-else-if="item.msgType === 1" @click="goDetailPage(item.msgDetail.postDto)">
              <div class="avator">
                <img v-lazy="item.msgDetail.icon" alt="icon">
              </div>
              <div class="message">
                <div class="content" >
                  <span class="username" @click.stop="goProfilePage(item.msgDetail.memberDtoList[0])">
                    {{item.msgDetail.memberDtoList[0].username}}
                  </span>,
                  <span class="username" @click.stop="goProfilePage(item.msgDetail.memberDtoList[1])">
                    {{item.msgDetail.memberDtoList[1].username}}
                  </span>
                  and others liked
                  <span @click.stop="goProfilePage(item.bearMemberDto)">
                    {{item.levelType===0?'your':item.bearMemberDto.username+"'s"}} post.
                  </span>
                </div>
                <div class="time">
                  {{item.unixTime|timeAndDate}}
                </div>
              </div>
              <div class="detailImage">
                <img v-lazy="item.msgDetail.postDto.imageUrl" alt="post image">
              </div>
            </div>
            <!-- 消息类型 like someone's comment 4 -->
            <div v-else-if="item.msgType === 4" @click="goCommentPage(item.msgDetail.postDto,item.msgDetail.commentDto)">
              <div class="avator" @click.stop="goProfilePage(item.msgDetail.memberDto)">
                <img v-lazy="item.msgDetail.memberDto.icon" alt="icon">
              </div>
              <div class="message">
                <div class="content" >
                  <span class="username" @click.stop="goProfilePage(item.msgDetail.memberDto)">
                    {{item.msgDetail.memberDto.username}}
                  </span>
                  liked
                  <span @click.stop="goProfilePage(item.bearMemberDto)">
                    {{item.levelType===0?'your':item.bearMemberDto.username+`'s`}}
                  </span>
                  comment.
                </div>
                <div class="time">
                  {{item.unixTime|timeAndDate}}
                </div>
              </div>
              <div class="detailImage">
                <img v-lazy="item.msgDetail.postDto.imageUrl" alt="post image">
              </div>
            </div>
            <!-- 消息类型 comment 8 -->
            <div v-else-if="item.msgType === 8" @click="goCommentPage(item.msgDetail.postDto,item.msgDetail.commentDto)">
              <div class="avator" @click.stop="goProfilePage(item.msgDetail.memberDto)">
                <img v-lazy="item.msgDetail.memberDto.icon" alt="icon">
              </div>
              <div class="message">
                <div class="content" >
                  <span class="username" @click.stop="goProfilePage(item.msgDetail.memberDto)">
                    {{item.msgDetail.memberDto.username}}
                  </span>
                  commented on
                  <span @click.stop="goProfilePage(item.bearMemberDto)">
                    {{item.levelType===0?'your':item.bearMemberDto.username+`'s`}}
                  </span>
                   post.
                </div>
                <div class="time">
                  {{item.unixTime|timeAndDate}}
                </div>
              </div>
              <div class="detailImage">
                <img v-lazy="item.msgDetail.postDto.imageUrl" alt="post image">
              </div>
            </div>
            <!-- 消息类型 comment collection 9 -->
            <div v-else-if="item.msgType === 9" @click="seeComment(item.msgDetail.postDto)">
              <div class="avator">
                <img v-lazy="item.msgDetail.icon" alt="icon">
              </div>
              <div class="message">
                <div class="content">
                  <span class="username" @click.stop="goProfilePage(item.msgDetail.memberDtoList[0])">
                    {{item.msgDetail.memberDtoList[0].username}}
                  </span>,
                  <span class="username" @click.stop="goProfilePage(item.msgDetail.memberDtoList[1])">
                    {{item.msgDetail.memberDtoList[1].username}}
                  </span>
                  and others commented on
                  <span  @click.stop="goProfilePage(item.bearMemberDto)">
                    {{item.levelType===0?'your':item.bearMemberDto.username+`'s`}}
                  </span>
                  post.
                </div>
                <div class="time">
                  {{item.unixTime|timeAndDate}}
                </div>
              </div>
              <div class="detailImage">
                <img v-lazy="item.msgDetail.postDto.imageUrl" alt="post image">
              </div>
            </div>
            <!-- 消息类型 reply comment 10 -->
            <div v-else-if="item.msgType === 10" @click="goCommentPage(item.msgDetail.postDto,item.msgDetail.commentDto)">
              <div class="avator" @click.stop="goProfilePage(item.msgDetail.memberDto)">
                <img v-lazy="item.msgDetail.memberDto.icon" alt="icon">
              </div>
              <div class="message">
                <div class="content" >
                  <span class="username"  @click.stop="goProfilePage(item.msgDetail.memberDto)">
                    {{item.msgDetail.memberDto.username}}
                  </span>
                   replied to
                  <span @click.stop="goProfilePage(item.bearMemberDto)">
                    {{item.levelType===2?item.bearMemberDto.username:'you'}}.
                  </span>
                </div>
                <div class="time">
                  {{item.unixTime|timeAndDate}}
                </div>
              </div>
              <div class="detailImage">
                <img v-lazy="item.msgDetail.postDto.imageUrl" alt="post image">
              </div>
            </div>
            <!-- 消息类型 mention post 20 -->
            <div v-else-if="item.msgType === 20" @click="goDetailPage(item.msgDetail.postDto)">
              <div class="avator" @click.stop="goProfilePage(item.msgDetail.memberDto)">
                <img v-lazy="item.msgDetail.memberDto.icon" alt="icon">
              </div>
              <div class="message">
                <div class="content" >
                  <span class="username" @click.stop="goProfilePage(item.msgDetail.memberDto)">
                    {{item.msgDetail.memberDto.username}}
                  </span>
                   mentioned
                   <span @click.stop="goProfilePage(item.bearMemberDto)">
                    {{item.levelType===2?item.bearMemberDto.username:'you'}}
                   </span>
                    on post.
                </div>
                <div class="time">
                  {{item.unixTime|timeAndDate}}
                </div>
              </div>
              <div class="detailImage">
                <img v-lazy="item.msgDetail.postDto.imageUrl" alt="post image">
              </div>
            </div>
            <!-- 消息类型 mention comment 21 -->
            <div v-else-if="item.msgType === 21" @click="goCommentPage(item.msgDetail.postDto,item.msgDetail.commentDto)">
              <div class="avator" @click.stop="goProfilePage(item.msgDetail.memberDto)">
                <img v-lazy="item.msgDetail.memberDto.icon" alt="icon">
              </div>
              <div class="message">
                <div class="content" >
                  <span class="username" @click.stop="goProfilePage(item.msgDetail.memberDto)">
                    {{item.msgDetail.memberDto.username}}
                  </span>
                   mentioned
                  <span @click.stop="goProfilePage(item.bearMemberDto)">
                    {{item.levelType===2?item.bearMemberDto.username:'you'}}
                  </span>
                   in comment.
                </div>
                <div class="time">
                  {{item.unixTime|timeAndDate}}
                </div>
              </div>
              <div class="detailImage">
                <img v-lazy="item.msgDetail.postDto.imageUrl" alt="post image">
              </div>
            </div>
            <!-- 消息类型 follow 24 -->
            <div v-else-if="item.msgType === 24">
              <div class="avator" @click="goProfilePage(item.msgDetail.memberDto)">
                <img v-lazy="item.msgDetail.memberDto.icon" alt="icon">
              </div>
              <div class="message">
                <div class="content" >
                  <span class="username" @click="goProfilePage(item.msgDetail.memberDto)">
                    {{item.msgDetail.memberDto.username}}
                  </span>
                   followed
                  <span @click="goProfilePage(item.bearMemberDto)">
                     {{item.levelType===2?item.bearMemberDto.username:'you'}}
                  </span>.
                </div>
                <div class="time">
                  {{item.unixTime|timeAndDate}}
                </div>
              </div>
              <!-- 如果是关于我的follow列表 -->
              <div
              v-if="type === 1"
              :class="{'followBtn':true,'following':item.msgDetail.memberDto.isFollowing}"
              @click="followPeopleFn(item.msgDetail.memberDto)">
                {{item.msgDetail.memberDto.isFollowing?'Following':'Follow'}}
              </div>
              <!-- 如果是关于好友的follow列表 -->
              <div
              v-else-if="type === 2"
              :class="{'followBtn':true,'following':item.bearMemberDto.isFollowing}"
              @click="followPeopleFn(item.bearMemberDto)">
                {{item.bearMemberDto.isFollowing?'Following':'Follow'}}
              </div>
            </div>
            <!-- 消息类型 follow 28 -->
            <div v-else-if="item.msgType === 28">
              <div class="avator">
                <img v-lazy="noticeIcon" alt="icon">
              </div>
              <div class="message">
                <div class="content" >{{item.msgDetail.content}}</div>
                <div class="time">{{item.unixTime|timeAndDate}}</div>
              </div>
            </div>
            <!-- 消息类型 like post 聚合 1001 -->
            <div v-else-if="item.msgType === 1001">
              <div class="avator">
                <img v-lazy="item.msgDetail.memberDto.icon" alt="icon">
              </div>
              <div class="message">
                <div class="content">
                  <span class="username" @click.stop="goProfilePage(item.msgDetail.memberDto)">
                    {{item.msgDetail.memberDto.username}}
                  </span> liked
                  {{item.msgDetail.postDtoList.length}}
                  posts.
                </div>
                <div class="time">
                  {{item.unixTime|timeAndDate}}
                </div>
              </div>
            </div>
            <div class="postList" v-if="item.msgType === 1001">
              <template v-for="post in item.msgDetail.postDtoList">
                <div class="postItem" :key="post.id" @click.stop="goDetailPage(post)">
                  <img v-lazy="item.thumbnails?item.thumbnails[0].src:$defaultCover" alt="icon">
                </div>
              </template>
            </div>
            <!-- 消息类型 following 聚合 1003 -->
            <div v-else-if="item.msgType === 1003" @click="goFollowingList(item.msgDetail.memberDto)">
              <div class="avator">
                <img v-lazy="item.msgDetail.memberDto.icon" alt="icon">
              </div>
              <div class="message">
                <div class="content">
                  <span class="username" @click.stop="goProfilePage(item.msgDetail.memberDto)">
                    {{item.msgDetail.memberDto.username}}
                  </span> is following
                  <span class="username" @click.stop="goProfilePage(item.msgDetail.followMemberDtoList[0])">
                    {{item.msgDetail.followMemberDtoList[0].username}}
                  </span>,
                  <span class="username" @click.stop="goProfilePage(item.msgDetail.followMemberDtoList[1])">
                    {{item.msgDetail.followMemberDtoList[1].username}}
                  </span>
                  {{item.msgDetail.followMemberDtoList.length>2?'and others':''}}.
                </div>
                <div class="time">
                  {{item.unixTime|timeAndDate}}
                </div>
              </div>
            </div>
          </div>
        </cell>
      </list>
    <!-- empty page -->
    <empty-page v-if="isEmpty" />
  </div>
</template>

<script>
import {List, Cell, PullRefresh, Toast} from 'vant'
import {getFollowingMessage, getMessage} from '@/api/api'
import EmptyPage from '@/components/EmptyPage'
import noticeIcon from '@/assets/img/myfeedVolume@2x.png'
import toLogin from '@/mixins/toLoginMix'
import changePeopleFollowType from '@/mixins/changePeopleFollowTypeMix'
import Lottie from 'vue-lottie'
import animationData2 from '@/assets/data/refresh02.json'
import animationData1 from '@/assets/data/refresh01.json'

export default {
  name: 'MessageList',
  mixins: [toLogin, changePeopleFollowType],
  components: {List, Cell, EmptyPage, PullRefresh, Lottie},
  props: {
    type: {// 1表示you 2表示following
      default: 0,
      type: Number
    }
  },
  data () {
    return {
      loading: false,
      finished: false,
      pageSize: 10,
      hasNext: true,
      list: [],
      noticeIcon: noticeIcon,
      isLoading: false,
      isRefresh: false,
      isEmpty: false,
      defaultOptions1: {
        animationData: animationData1
      },
      defaultOptions2: {
        animationData: animationData2
      }
    }
  },
  computed: {
    userId () {
      return localStorage.getItem('id') * 1
    }
  },
  methods: {
    getMessageFn () {
      if (!this.hasNext) {
        return false
      }
      const query = {
        pageSize: this.pageSize,
        lastTimestamp: this.lastTimestamp
      }
      if (this.type === 1) {
        this.getMessage = getMessage
      } else if (this.type === 2) {
        this.getMessage = getFollowingMessage
      }
      this.getMessage(query).then(res => {
        if (res.data.code === '200') {
          if (res.data.result.resultData.length) {
            if (this.isRefresh) { // 0 表示加载，!=0表示刷新
              this.list.splice(0, this.list.length, ...res.data.result.resultData)
            } else {
              this.list.splice(this.list.length, 0, ...res.data.result.resultData)
            }
            this.isRefresh = false
            this.lastTimestamp = this.list[this.list.length - 1].unixTime
          }
          this.hasNext = res.data.result.hasNext
          this.loading = false
          this.isLoading = false
          this.finished = !this.hasNext
        } else {
          Toast({
            message: res.data.message
          })
        }
        this.isEmpty = !(this.list.length)
      }).catch(err => {
        this.toLogin(err)
      })
    },
    onLoad () {
      this.getMessageFn()
    },
    goProfilePage (item) {
      if (item) {
        this.$router.push({
          name: 'ProfileDetail',
          params: {
            userId: item.id
          }
        })
      }
    },
    goDetailPage (postDto) {
      this.$router.push({
        name: 'PostDetail',
        params: {
          postId: postDto.id
        }
      })
    },
    goCommentPage (postDto, commentDto) {
      if (!commentDto) {
        Toast('This comment has been deleted!')
        return
      }
      this.$router.push({
        name: 'PostDetail',
        params: {
          postId: postDto.id
        },
        query: {
          commentId: commentDto.id
        }
      })
    },
    seeComment (postDto) {
      this.$router.push({
        name: 'Comment',
        params: {
          commentType: 0,
          rootId: postDto.id
        }
      })
    },
    goFollowingList (userInfo) {
      this.$router.push({
        name: 'PeopleList',
        params: {
          userId: userInfo.id
        },
        query: {
          type: 'following'
        }
      })
    }
    // onRefresh () {
    //   // 进行数据更新
    //   this.isRefresh = true
    //   this.hasNext = true
    //   this.lastTimestamp = null
    //   this.getMessageFn()
    // },
    // handleAnimation (anim) {
    //   this.anim = anim
    //   this.anim.pause()
    // }
  }
}
</script>

<style scoped>
img{
  object-fit: cover;
}
.messageItem>div{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.avator{
  min-width: 0.8rem;
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
  overflow: hidden;
}
.detailImage{
  min-width: 0.8rem;
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 0.1rem;
  overflow: hidden;
}
.message{
  width: 100%;
  margin-left:0.2rem;
}
.content{
  font-family: 'SFUIDisplay-Regular';
  font-size: 0.24rem;
  line-height: 0.3rem;
  color: rgb(51,51,51);
}
.username{
  font-family: 'SFUIDisplay-Medium';
  font-weight: bold;
}
.time{
  font-size: 0.22rem;
  transform: scale(.9);
  transform-origin: left top;
  color: rgb(153,153,153);
}
.notice{
  width: 100%;
  margin-left: 0.2rem;
}
.followBtn{
  display: flex;
  justify-content: center;
  align-items: center;
  color:#fff;
  width:1.4rem;
  min-width: 1.4rem;
  height: 0.5rem;
  font-size: 0.24rem;
  border-radius:0.25rem;
  background:rgb(26,140,253);
}
.followBtn.following{
  height: 0.48rem;
  color:rgb(26,140,253);
  background: #fff;
  border:0.01rem solid rgb(26,140,253);
}
.messageItem .postList{
  margin-left: 1rem;
  margin-top: 0.1rem;
  display: flex;
  justify-content: flex-start;
}
.postItem{
  min-width: 0.8rem;
  width: 0.8rem;
  height: 0.8rem;
  margin-right: 0.22rem;
  border-radius: 0.1rem;
  overflow: hidden;
}
.postItem:last-child{
  margin-right: 0;
}
</style>
