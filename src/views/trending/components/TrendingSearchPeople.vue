<template>
  <div>
    <List
    v-model="loading"
    :finished="finished"
    finished-text="Already at the bottom!"
    @load="onload"
    class="paddingBottom"
    v-show="!isEmpty"
    >
      <template slot="loading">
        <lottie :height="50"  :width="100" :options="defaultOptions2"/>
      </template>
      <Cell v-for="(item,index) in peopleList" :key="index">
         <div class="fileItem">
            <div class="userItem">
              <div class="userInfo">
                <router-link :to="{name:'ProfileDetail',params:{userId:item.memberDto.id}}">
                  <img v-lazy="item.memberDto.icon" alt="icon">
                </router-link>
                <div class="username">
                    <div class="name">{{item.memberDto.username}}</div>
                    <div class="memberStatic">
                      <span>{{item.memberDto.memberStatisticsDto.posts}} Posts</span>
                      <span>{{item.memberDto.memberStatisticsDto.followings|formateNum}} Following</span>
                      <span>{{item.memberDto.memberStatisticsDto.followers|formateNum}} Followers</span>
                    </div>
                </div>
              </div>
              <div :class="{'followBtn':true,'following':item.memberDto.isFollowing}" @click.stop="followPeopleFn(item.memberDto)">
                {{item.memberDto.isFollowing?'Following':'Follow'}}
              </div>
            </div>
            <!-- <p class="selfIntroduction van-ellipsis">{{item.memberDto.introduction}}</p>
            <template v-if="item.postDtoList">
               <SwiperWall :fileList='item.postDtoList' />
            </template> -->
          </div>
      </Cell>
    </List>
    <!-- EmptyPage -->
    <empty-page v-if="isEmpty"/>
  </div>
</template>

<script>
import {List, Cell, Toast} from 'vant'
import {searchPeople} from '@/api/api'
import SwiperWall from '@/components/swiper/SwiperWall'
import EmptyPage from '@/components/EmptyPage'
import changePeopleFollowType from '@/mixins/changePeopleFollowTypeMix'
import toLogin from '@/mixins/toLoginMix'
import Lottie from 'vue-lottie'
import animationData2 from '@/assets/data/refresh02.json'

export default {
  name: 'TrendingSearchPeople',
  mixins: [changePeopleFollowType, toLogin],
  components: {List, Cell, SwiperWall, Lottie, EmptyPage},
  props: ['searchText'],
  data () {
    return {
      loading: false,
      finished: false,
      page: 1,
      pageSize: 10,
      peopleList: [],
      isRefresh: false,
      isEmpty: false,
      defaultOptions2: {
        animationData: animationData2
      }
    }
  },
  watch: {
    searchText () {
      this.page = 0
      this.peopleList = []
      this.searchPepleList()
    },
    peopleList (val) {
      this.isEmpty = !(val.length)
    }
  },
  methods: {
    onload () {
      this.searchPepleList()
    },
    searchPepleList () { // 搜索people
      const query = {
        page: this.page,
        pageSize: this.pageSize,
        name: this.searchText
      }
      searchPeople(query).then(res => {
        if (res.data.code === '200') {
          this.peopleList.splice(this.peopleList.length, 0, ...res.data.result.resultData)
          this.loading = false
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
    }
  }

}
</script>

<style scoped>
.fileItem{
  overflow: hidden;
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
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
}
.username{
  color:rgb(51,51,51);
  font-size:0.32rem;
  margin-left: 0.2rem;
}
.username div:nth-child(1){
  font-family: SFUIDisplay-Medium;
}
.username div:nth-child(2){
  font-size: 0.24rem;
  color: rgb(153,153,153);
}
.memberStatic span{
  margin-right: 0.12rem;
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
.selfIntroduction{
  color:rgb(153,153,153);
  font-size: 0.3rem;
  margin:0;
}
.paddingBottom{
  padding-bottom: 1.2rem;
  padding-bottom: calc(1.2rem + constant(safe-area-inset-bottom));
  padding-bottom: calc(1.2rem + env(safe-area-inset-bottom));
}
</style>
