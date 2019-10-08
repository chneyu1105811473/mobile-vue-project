<template>
  <div class="likeList">
    <nav-bar :fixed="false" ref="header">
      <!-- <span slot="left" class="iconfont leftIcon" @click="onClickLeft">&#xe65b;</span> -->
      <span slot="title" class="title">Likes</span>
      <span slot="right" class="rightIcon iconfont" @click="onClickRight">&#xe711;</span>
    </nav-bar>
    <div class="likeContainer" :style="{'height':height+'px'}">
      <list
      v-model="loading"
      :finished="finished"
      @load="onLoad"
      >
        <template slot="loading">
          <lottie :height="50"  :width="100" :options="defaultOptions2"/>
        </template>
        <cell v-for="(item,index) in peopleList" :key="index">
          <div class="listItem">
            <div class="userInfo" @click.stop="goProfilePage(item)">
              <div class="userIcon">
                <img v-lazy="item.icon" alt="icon">
              </div>
              <div class="username">
                <span>{{item.username}}</span>
                <span>{{item.nickname}}</span>
              </div>
            </div>
            <div
            :class="{'followBtn':true,'following':item.isFollowing}"
            @click="followPeopleFn(item)"
            v-show="!item.isSelf"
            >
              {{item.isFollowing?'Following':'Follow'}}
            </div>
          </div>
        </cell>
      </list>
      <!-- empty page -->
      <empty-page v-if="isEmpty"/>
    </div>
  </div>
</template>

<script>
import {List, Cell, Toast} from 'vant'
import {getLikeOrDislikeMembers} from '@/api/api'
import changePeopleFollowType from '@/mixins/changePeopleFollowTypeMix'
import toLogin from '@/mixins/toLoginMix'
import NavBar from '@/components/NavBar'
import EmptyPage from '@/components/EmptyPage'
import Lottie from 'vue-lottie'
import animationData2 from '@/assets/data/refresh02.json'

export default {
  name: 'LikeList',
  mixins: [changePeopleFollowType, toLogin],
  props: ['rootId'],
  components: {NavBar, List, Cell, Lottie, EmptyPage},
  data () {
    return {
      peopleList: [],
      page: 1,
      pageSize: 10,
      loading: false,
      finished: false,
      height: 0,
      isEmpty: false,
      defaultOptions2: {
        animationData: animationData2
      }
    }
  },
  mounted () {
    this.height = window.innerHeight * 0.8 - this.$refs.header.$el.offsetHeight
  },
  methods: {
    // onClickLeft () {
    //   this.$router.go(-1)
    // },
    onClickRight () {
      this.$emit('close', true)
    },
    getPeopleList () {
      const query = {
        actionType: 1,
        postId: this.rootId,
        page: this.page,
        pageSize: this.pageSize
      }
      getLikeOrDislikeMembers(query).then(res => {
        if (res.data.code === '200') {
          this.peopleList.splice(this.peopleList.length, 0, ...res.data.result.resultData)
          this.page++
          this.loading = false
          if (this.page > res.data.result.totalPageNum) {
            this.finished = true
          }
        } else {
          Toast({
            message: res.data.message
          })
        }
      }).catch(err => {
        // 若返回403,则跳到登录页面重新登录
        this.toLogin(err)
      })
    },
    onLoad () {
      this.getPeopleList()
    },
    goProfilePage (item) {
      this.$router.push({
        name: 'ProfileDetail',
        params: {
          userId: item.id
        }
      })
    }
  },
  watch: {
    peopleList (val) {
      this.isEmpty = !(val.length)
    }
  }
}
</script>

<style scoped>
.likeList{
  height: 100%;
  background-color: #fff;
}
.likeContainer{
  overflow-y:auto;
}
.listItem{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.userInfo{
    display: flex;
    align-items: center;
}
.userIcon{
    width: 0.8rem;
    height: 0.8rem;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 0.2rem;
}
.username span{
    display: block;
}
.username span:nth-child(1){
    color:rgb(51,51,51);
    font-size: 0.32rem;
}
.username span:nth-child(2){
    color:rgb(153,153,153);
    font-size: 0.24rem;
}
.followBtn{
  display: flex;
  justify-content: center;
  align-items: center;
  color:#fff;
  width:1.4rem;
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
.leftIcon{
  font-size: 0.5rem;
}
.title{
  font-family: SFUIDisplay-Medium;
}
.rightIcon{
  font-size: 0.5rem;
}
</style>
