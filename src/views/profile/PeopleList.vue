<template>
  <div>
    <nav-bar>
      <span slot="left" class="iconfont leftIcon" @click="goBack">&#xe65b;</span>
      <span slot="title" class="title">{{title}}</span>
    </nav-bar>
    <div class="containerBox">
          <div class="searchBox">
              <search v-model="searchText"/>
          </div>
          <list
          v-model="loading"
          :finished="finished"
          finished-text="Already show all users!"
          @load="onLoad"
          v-show="!isEmpty"
          >
            <template slot="loading">
              <lottie :height="50"  :width="100" :options="defaultOptions2"/>
            </template>
            <cell v-for="(item,index) in list" :key="index">
              <div class="userContent">
                <div class="userInfo">
                  <div class="userIcon">
                    <router-link :to="{name:'ProfileDetail',params:{userId:item.id}}">
                      <img v-lazy="item.icon" alt="user icon">
                    </router-link>
                  </div>
                  <div class="username">
                    <p class="userItem">{{item.username}}</p>
                    <p class="userItem">{{item.nickname}}</p>
                    <p class="userItem">
                      <span class="iconfont">&#xe65a;</span>
                      <span v-for="(time,timeIndex) in getPostLife(item.totalCountDown)" :key="timeIndex">
                        <span class="num">{{time.value}}</span><span class="unit">{{time.unit}}</span>
                      </span>
                    </p>
                  </div>
                </div>
                <div
                v-show="!item.isSelf"
                :class="{'followBtn':true,'following':item.isFollowing}"
                @click.stop="followPeopleFn(item)"
                >
                    {{item.isFollowing?'Following':'Follow'}}
                </div>
              </div>
            </cell>
          </list>
          <!-- EmptyPage -->
          <empty-page v-if="isEmpty"/>
    </div>
  </div>
</template>

<script>
import {profileFollowers, profileFollowing, searchProfileFollowers, searchProfileFollowing} from '@/api/api'
import {List, Cell, Toast} from 'vant'
import Search from '@/components/Search'
import NavBar from '@/components/NavBar'
import EmptyPage from '@/components/EmptyPage'
import getLifeOrCreateTime from '@/mixins/postLifeMix'
import changePeopleFollowType from '@/mixins/changePeopleFollowTypeMix'
import toLogin from '@/mixins/toLoginMix'
import Lottie from 'vue-lottie'
import animationData2 from '@/assets/data/refresh02.json'

export default {
  name: 'PeopleList',
  components: {List, Cell, Search, NavBar, Lottie, EmptyPage},
  mixins: [getLifeOrCreateTime, changePeopleFollowType, toLogin],
  data () {
    return {
      list: [],
      page: 1,
      pageSize: 10,
      loading: false,
      finished: false,
      searchText: '',
      isEmpty: false,
      defaultOptions2: {
        animationData: animationData2
      }
    }
  },
  computed: {
    title () {
      return this.$route.query.type.slice(0, 1).toUpperCase() + this.$route.query.type.slice(1)
    },
    type () {
      return this.$route.query.type
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    getFollowingList () {
      if (!this.searchText) {
        // 查询
        this.getFollowing()
      } else { // 搜索
        this.searchFollowing()
      }
    },
    async getFollowing () {
      const query = {
        userId: this.$route.params.userId,
        page: this.page,
        pageSize: this.pageSize
      }
      await profileFollowing(query).then(res => {
        if (res.data.code === '200') {
          this.list.splice(this.list.length, 0, ...res.data.result.resultData)
          this.loading = false
          this.page++
          if (this.page > res.data.result.totalPageNum) {
            this.finished = true
          } else {
            this.finished = false
          }
        } else {
          Toast({
            message: res.data.code + ': ' + res.data.message
          })
        }
      }).catch(err => {
        this.toLogin(err)
      })
    },
    async searchFollowing () {
      const query = {
        userId: this.$route.params.userId,
        page: this.page,
        pageSize: this.pageSize,
        userNameLike: this.searchText
      }
      await searchProfileFollowing(query).then(res => {
        if (res.data.code === '200') {
          this.list.splice(this.list.length, 0, ...res.data.result.resultData)
          this.loading = false
          this.page++
          if (this.page > res.data.result.totalPageNum) {
            this.finished = true
          } else {
            this.finished = false
          }
        } else {
          Toast({
            message: res.data.code + ': ' + res.data.message
          })
        }
      }).catch(err => {
        this.toLogin(err)
      })
    },
    getFollowerList () {
      if (!this.searchText) {
        // 查询
        this.getFollowers()
      } else { // 搜索
        this.searchFollowers()
      }
    },
    async getFollowers () {
      const query = {
        userId: this.$route.params.userId,
        page: this.page,
        pageSize: this.pageSize
      }
      await profileFollowers(query).then(res => {
        if (res.data.code === '200') {
          this.loading = false
          this.list.splice(this.list.length, 0, ...res.data.result.resultData)
          this.page++
          if (this.page > res.data.result.totalPageNum) {
            this.finished = true
          } else {
            this.finished = false
          }
        } else {
          Toast({
            message: res.data.code + ': ' + res.data.message
          })
        }
      }).catch(err => {
        this.toLogin(err)
      })
    },
    async searchFollowers () {
      const query = {
        userId: this.$route.params.userId,
        page: this.page,
        pageSize: this.pageSize,
        userNameLike: this.searchText
      }
      await searchProfileFollowers(query).then(res => {
        if (res.data.code === '200') {
          this.loading = false
          this.list.splice(this.list.length, 0, ...res.data.result.resultData)
          this.page++
          if (this.page > res.data.result.totalPageNum) {
            this.finished = true
          } else {
            this.finished = false
          }
        } else {
          Toast({
            message: res.data.code + ': ' + res.data.message
          })
        }
      }).catch(err => {
        this.toLogin(err)
      })
    },
    onLoad () {
      if (this.type === 'following') { // 查询关注的列表
        this.getFollowingList()
      } else if (this.type === 'followers') { // 查询粉丝列表
        this.getFollowerList()
      }
    }
  },
  watch: {
    list (val) {
      this.isEmpty = !(val.length)
    },
    searchText () {
      this.list = []
      this.page = 1
      this.onLoad()
    }
  }
}
</script>

<style scoped>
.num{
    font-size: 0.3rem;
}
.unit{
    font-size: 0.20rem;
}
.searchBox{
    padding: 0.2rem;
}
.userContent{
    display:flex;
    justify-content: space-between;
    align-items: center;
}
.userInfo{
    display: flex;
}
.userIcon{
    margin-right: 0.2rem;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    overflow: hidden;
}
.username{
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
}
.username .userItem{
    margin: 0;
    width: 100%;
    line-height: 0.32rem;
}
.username .userItem:nth-child(1){
    font-size: 0.3rem;
    font-family: SFUIDisplay-Medium;
}
.username .userItem:nth-child(2){
    font-size: 0.24rem;
    font-family: SFUIDisplay-Regular;
    color:rgb(137,137,137);
}
.username .userItem:nth-child(3){
    color: rgb(66,93,144);
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
</style>
