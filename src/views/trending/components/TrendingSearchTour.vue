<template>
    <List
    v-model="loading"
    :finished="finished"
    finished-text="Already at the bottom!"
    @load="onload"
    class="paddingBottom"
    >
      <template slot="loading">
        <lottie :height="50"  :width="100" :options="defaultOptions2"/>
      </template>
      <Cell v-for="(item,index) in fileList" :key="index">
        <div class="fileItem">
          <router-link :to="{name:'TourDetail',params:{tourId:item.tourDto.id}}">
            <div class="flexBox">
              <div class="userInfo">
                <h3 class="tourName">{{item.tourDto.name}}</h3>
                <div class="userIcon">
                  <img v-lazy="item.memberDto.icon" alt="">
                  <span class="username">{{item.memberDto.username}}</span>
                </div>
                <div class="postInfo">
                  <span>{{item.tourDto.saveNum|formateNum}} Saves</span>
                  <span>{{item.tourDto.commentNum|formateNum}} Comments</span>
                </div>
              </div>
              <div class="userCover" v-lazy:background-image="item.tourDto.coverImage||$defaultCover">
                <!-- <img v-lazy="item.tourDto.coverImage" alt="cover"> -->
                <p class="postNum">{{item.tourDto.postNum|formateNum}}</p>
              </div>
            </div>
            <p class="introduction" v-show="item.memberDto.introduction">{{item.memberDto.introduction}}</p>
          </router-link>
        </div>
      </Cell>
    </List>
</template>

<script>
import {List, Cell, Toast} from 'vant'
import {searchTour} from '@/api/api'
import toLogin from '@/mixins/toLoginMix'
import Lottie from 'vue-lottie'
import animationData2 from '@/assets/data/refresh02.json'

export default {
  name: 'TrendingSearchTour',
  components: {List, Cell, Lottie},
  props: ['searchText'],
  mixins: [toLogin],
  data () {
    return {
      loading: false,
      finished: false,
      page: 1,
      pageSize: 10,
      fileList: [],
      defaultOptions2: {
        animationData: animationData2
      }
    }
  },
  methods: {
    onload () {
      this.searchTourList()
    },
    searchTourList () { // 搜索tour
      const query = {
        tourName: this.searchText,
        page: this.page,
        pageSize: this.pageSize
      }
      searchTour(query).then(res => {
        if (res.data.code === '200') {
          this.fileList.splice(this.fileList.length, 0, ...res.data.result.resultData)
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
  },
  watch: {
    searchText (val) {
      this.page = 1
      this.fileList = []
      this.searchTourList()
    }
  }
}
</script>

<style scoped>
  .paddingBottom{
    padding-bottom: 1.2rem;
    padding-bottom: calc(1.2rem + constant(safe-area-inset-bottom));
    padding-bottom: calc(1.2rem + env(safe-area-inset-bottom));
  }
  .paddingBottom a{
    color: rgb(53,53,53);
  }
  .fileItem{
    padding:0.1rem 0;
    box-sizing:border-box;
  }
  .flexBox{
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  .userIcon {
    margin-bottom: 0.2rem;
  }
  .userIcon img{
    width: 0.4rem;
    height: 0.4rem;
    border-radius: 50%;
  }
  .tourName{
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .username{
    color:rgb(153,153,153);
    font-size: 0.24rem;
    margin-left: 0.1rem;
  }
  .introduction{
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-size:0.3rem;
    color: rgb(102,102,102);
  }
  .userInfo{
    width: 3rem;
    margin-top: -0.2rem;
  }
  .postInfo{
    display: flex;
    justify-content: space-between;
    color:rgb(153,153,153);
    font-size: 0.26rem;
  }
  .userCover{
    position: relative;
    min-width: 3.5rem;
    width: 3.5rem;
    height: 1.74rem;
    border-radius: 0.12rem;
    overflow: hidden;
    background-size: cover;
    background-repeat: no-repeat;
  }
.postNum{
    position: absolute;
    width: 100%;
    left:0;
    bottom:0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin: 0;
    padding:0.14rem;
    box-sizing: border-box;
    font-size: 0.24rem;
    color: #fff;
    background:linear-gradient(to bottom,rgba(0,0,0,0),rgba(0,0,0,.53));
}
.postNum::before{
  content: "";
  margin-right: 0.1rem;
  width:0.26rem;
  height: 0.32rem;
  background-position:0 0;
  background-repeat:no-repeat;
  background-image: url(../../../assets/img/ic_post@2x.png);
  background-size: cover;
}
</style>
