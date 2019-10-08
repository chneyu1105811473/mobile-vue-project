<template>
    <div class="peopleFollow">
        <nav-bar>
          <span slot="left" class="iconfont leftIcon" @click="onClickLeft">&#xe65b;</span>
          <span slot="title" class="title">People you might like</span>
          <span slot="right" class="rightIcon iconfont" v-show="isInit" @click="onClickRight">&#xe60e;</span>
        </nav-bar>
        <div class="containerBox">
            <list
            v-model="loading"
            :finished="finished"
            finished-text="Already at the bottom!"
            @load="onLoad"
            >
            <template slot="loading">
              <lottie :height="50"  :width="100" :options="defaultOptions2"/>
            </template>
            <div v-for="(item,index) in peopleList" :key="index" class="userContainer">
              <div class="userItem">
                <div class="userInfo">
                  <img v-lazy="item.memberDto.icon" alt="user icon">
                  <div class="username">
                    <span>{{item.memberDto.username}}</span>
                    <!-- <span>{{item.memberDto.nickname}}</span> -->
                  </div>
                </div>
                <div
                :class="{'followBtn':true,'following':item.memberDto.isFollowing}"
                @click="followPeopleFn(item.memberDto)"
                >
                  {{item.memberDto.isFollowing?'Following':'Follow'}}
                </div>
              </div>
              <p class="selfIntroduction van-ellipsis">
                {{item.memberDto.selfIntroduction}}
              </p>
              <swiper-wall :fileList='item.postDtoList'/>
            </div>
            </list>
        </div>
    </div>
</template>

<script>
import {List, Toast} from 'vant'
import {recommendUserWithPost} from '@/api/api'
import SwiperWall from '@/components/swiper/SignUpSwiper'
import NavBar from '@/components/NavBar'
import toLogin from '@/mixins/toLoginMix'
import followOrUnfollow from '@/mixins/changePeopleFollowTypeMix'
import Lottie from 'vue-lottie'
import animationData2 from '@/assets/data/refresh02.json'

export default {
  name: 'PeopleRecommend',
  components: {NavBar, List, SwiperWall, Lottie},
  mixins: [toLogin, followOrUnfollow],
  data () {
    return {
      pageName: 'People you might like',
      rightText: 'Finish',
      peopleList: [],
      totalNum: 0,
      loading: false,
      finished: false,
      defaultOptions2: {
        animationData: animationData2
      }
    }
  },
  computed: {
    isInit () {
      return parseInt(this.$route.query.isInit)
    }
  },
  methods: {
    onClickLeft () {
      this.$router.go(-1)
    },
    onClickRight () {
      this.$router.push('/xplo')
    },
    onLoad () {
      // 异步更新数据
      this.getPeopleData()
    },
    async getPeopleData () {
      const query = {
        size: 10
      }
      await recommendUserWithPost(query).then(res => {
        if (res.data.code === '200') {
          this.peopleList.splice(this.peopleList.length, 0, ...res.data.result)
          // 加载状态结束
          this.loading = false
        } else {
          Toast({
            message: res.data.message
          })
        }
      }).catch(err => {
        // 若返回403,则跳到登录页面重新登录
        this.toLogin(err)
      })
    }
  }

}
</script>

<style scoped>
.containerBox{
  padding-top: 0.2rem;
  padding-left: 0.2rem;
  box-sizing: border-box;
}
.userItem{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.userItem .userInfo{
  display: flex;
  align-items: center;
}
.userInfo img{
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 50%;
}
.username{
  color:rgb(51,51,51);
  font-size:0.28rem;
  margin-left: 0.2rem;
}
.username span{
    display: block;
}
.username span:nth-child(1){
    font-family: SFUIDisplay-Regular;
}
.username span:nth-child(2){
    font-size: 0.24rem;
    color: rgb(153,153,153);
}
.followBtn{
    margin-right: 0.2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color:#fff;
    width:1.4rem;
    height: 0.5rem;
    font-size: 0.24rem;
    border-radius:0.25rem;
    background: rgb(26,140,253);
}
.followBtn.following{
    height: 0.46rem;
    color:rgb(26,140,253);
    background: #fff;
    border:0.02rem solid rgb(26,140,253);
}
.selfIntroduction{
    color:rgb(153,153,153);
    font-size: 0.3rem;
    margin:0;
}
.leftIcon{
    font-size: 0.4rem;
}
.rightIcon{
    font-size: 0.4rem;
    color: rgb(51,51,51);
}
.title{
    font-family: SFUIDisplay-Medium;
}
</style>
