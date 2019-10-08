<template>
    <div class="friends" :style="{'height':winHeight+'px'}">
      <div class="sticky" ref="sticky">
        <nav-bar :fixed="false">
          <span slot="left" class="iconfont leftIcon" @click="goBack">&#xe65b;</span>
          <span slot="title" >Friends</span>
          <span slot="right" class="rightIcon" @click="nextFn">Next</span>
        </nav-bar>
        <!-- search -->
        <div class="searchBox">
          <search v-model="searchText"/>
        </div>

        <!-- 选择的好友列表 -->
        <p class="title">Chosen</p>
        <div class="chosenFriends">
            <p class="tip" v-show="!chosenFriends.length">
              You can see chosen people here
            </p>
            <!-- 选择的好友 swiper -->
            <swiper :options="swiperOptions">
              <swiper-slide v-for="(item,index) in chosenFriends" :key="index">
                <div class="icon selectedIcon">
                  <img v-lazy="item.icon" alt="icon">
                </div>
              </swiper-slide>
            </swiper>
        </div>
        <p class="title">Friends</p>
      </div>

        <!-- 互相关注的好友列表 -->
        <div class="allFriends" :style="{'height':this.height+'px'}">
          <list
          v-model="loading"
          :finished="finished"
          @load="onLoad"
          >
            <template slot="loading">
              <lottie :height="50"  :width="100" :options="defaultOptions2"/>
            </template>
            <cell v-for="(item,index) in allFriends" :key="index">
              <div class="friendItem">
                <label class="userInfo" :for="item.username">
                  <div class="icon">
                    <img v-lazy="item.icon" alt="icon">
                  </div>
                  <span class="username">{{item.username}}</span>
                </label>
                <div class="checkBox">
                  <input
                  type="checkbox"
                  :value="item"
                  :id="item.username"
                  v-model="chosenFriends">
                  <i></i>
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
import Search from '@/components/Search'
import NavBar from '@/components/NavBar'
import EmptyPage from '@/components/EmptyPage'
import toLogin from '@/mixins/toLoginMix'
import {getFriends, searchFollowingList} from '@/api/api'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import Lottie from 'vue-lottie'
import animationData2 from '@/assets/data/refresh02.json'
import {mapGetters} from 'vuex'

export default {
  name: 'Friends',
  mixins: [toLogin],
  components: {NavBar, Search, List, Cell, swiper, swiperSlide, Lottie, EmptyPage},
  data () {
    return {
      chosenFriends: [],
      allFriends: [],
      page: 1,
      pageSize: 20,
      loading: false,
      finished: false,
      searchText: '',
      height: 0,
      isEmpty: false,
      swiperOptions: {
        // some swiper options/callbacks
        // 所有的参数同 swiper 官方 api 参数
        slidesPerView: 'auto',
        freeMode: true
      },
      defaultOptions2: {
        animationData: animationData2
      }
    }
  },
  computed: {
    ...mapGetters([
      'winHeight'
    ])
  },
  mounted () {
    const sticky = this.$refs.sticky
    this.height = window.innerHeight - sticky.offsetHeight
  },
  watch: {
    allFriends (val) {
      this.isEmpty = !(val.length)
    },
    searchText () {
      this.allFriends = []
      this.page = 1
      this.onLoad()
    }
  },
  methods: {
    goBack () {
      this.$store.commit('changeCommentAtSomeone', [])
      this.$emit('close', true)
    },
    nextFn () {
      if (!this.chosenFriends.length) {
        Toast({
          message: 'You have not chosen anyone yet'
        })
        return
      }
      this.$store.commit('changeCommentAtSomeone', this.chosenFriends)
      this.$emit('close', true)
    },
    getFriend () {
      const data = {
        page: this.page,
        pageSize: this.pageSize
      }
      getFriends(data).then(res => {
        if (res.data.code === '200') {
          this.loading = false
          if (this.page === 1) {
            this.allFriends.splice(0, this.allFriends.length, ...res.data.result.resultData)
          } else {
            this.allFriends.splice(this.allFriends.length, 0, ...res.data.result.resultData)
          }
          this.page++
          if (this.page > res.data.result.totalPageNum) {
            this.finished = true
          } else {
            this.finished = false
          }
        } else {
          Toast({
            message: res.data.message
          })
        }
      }).catch(err => {
        this.toLogin(err)
      })
    },
    searchFriend () {
      const query = {
        userName: this.searchText,
        page: this.page,
        pageSize: this.pageSize
      }
      searchFollowingList(query).then(res => {
        if (res.data.code === '200') {
          this.loading = false
          if (this.page === 1) {
            this.allFriends.splice(0, this.allFriends.length, ...res.data.result.resultData)
          } else {
            this.allFriends.splice(this.allFriends.length, 0, ...res.data.result.resultData)
          }
          this.page++
          if (this.page > res.data.result.totalPageNum) {
            this.finished = true
          } else {
            this.finished = false
          }
        } else {
          Toast({
            message: res.data.message
          })
        }
      }).catch(err => {
        this.toLogin(err)
      })
    },
    onLoad () {
      if (this.searchText) {
        this.searchFriend()
      } else {
        this.getFriend()
      }
    }
  }
}
</script>

<style scoped>
.friends{
  width: 100%;
  background-color: #fff;
  overflow: auto;
}
.searchBox{
  padding: 0.2rem;
  box-sizing: border-box;
}
.title{
  width:100%;
  margin: 0;
  padding:0.1rem 0.4rem;
  box-sizing: border-box;
  background-color: rgb(234,239,247);
  color: rgb(130,167,208);
  font-size: 0.24rem;
  font-family: SFUIDisplay-Medium;
}
.tip{
  margin: 0.16rem 0;
  text-indent: 0.4rem;
  color: rgb(153,153,153);
  font-size: 0.26rem;
}
.icon{
  width: 0.6rem;
  height: 0.6rem;
  border:0.01rem solid #eee;
  background-color: #eee;
  border-radius: 50%;
  overflow: hidden;
}
.allFriends{
  overflow-y: auto;
}
.chosenFriends{
  padding: 0.3rem 0;
  box-sizing: border-box;
}
.chosenFriends .icon:nth-child(1){
  margin-left:0.4rem;
}
.friendItem{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.userInfo{
  width: 100%;
  display: flex;
  align-items: center;
  margin-left: 0.1rem;
}
.username{
  margin-left: 0.3rem;
  font-size: 0.3rem;
  font-family: SFUIDisplay-Medium;
}
.checkBox{
  position: relative;
  width: 0.4rem;
  height: 0.4rem;
}
input{
  position: absolute;
  top: 0;
  left: 0;
  width:100%;
  height: 100%;
  opacity: 0;
  z-index: 2;
}
input + i{
  position: absolute;
  top: 0;
  left: 0;
  width:100%;
  height: 100%;
  width: .3rem;
  height: .3rem;
  border:0.03rem solid rgb(153,153,153);
  border-radius: .08rem;
}
input:checked + i{
    border-color: rgb(23,101,255);
    background-repeat: no-repeat;
    background-position: center;
    background-size:75% 75%;
    background-image: url(../../assets/img/icSelect@2x.png);
}
.leftIcon{
  font-size: 0.5rem;
}
.rightIcon{
  font-size: 0.3rem;
  color: rgb(66,93,144);
}
</style>
