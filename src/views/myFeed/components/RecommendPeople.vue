<template>
  <div class="suggest">
    <p class="title">
      <span>Suggestions for you</span>
      <span @click="goRecommendPage">See more</span>
    </p>
    <div class="swiper">
      <swiper :options="swiperOptions" ref="mySwiper" @reachEnd="reachEndFn">
        <swiper-slide v-for="(item,index) in list" :key="index" class="slides" v-show="!item.memberDto.isFollowing">
            <div class="sliderItem">
              <div class="closeBtn" @click="removePeople(index)">&times;</div>
              <div class="imageCover">
                <div class="icon">
                  <img v-lazy="item.memberDto.icon" alt="icon">
                </div>
              </div>
              <p class="username van-ellipsis">{{item.memberDto.username}}</p>
              <div class="followBtn iconfont" @click="follow(item.memberDto.id,index)">&#xe612; Follow</div>
            </div>
        </swiper-slide>
      </swiper>
      <!-- loading -->
      <loading v-show="isLoading"/>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import {recommendUserWithPost, followPeople} from '@/api/api'
import Loading from '@/components/Loading'

export default {
  name: 'RecommendPeople',
  components: {swiper, swiperSlide, Loading},
  data () {
    return {
      swiperOptions: {
        direction: 'horizontal',
        height: 'auto',
        freeMode: true,
        slidesPerView: 'auto'
      },
      list: [],
      page: 1,
      pageSize: 10,
      hasNext: true,
      isLoading: false
    }
  },
  created () {
    this.getRecommendPeople()
  },
  computed: {
    mySwiper () {
      return this.$refs.mySwiper.swiper
    }
  },
  methods: {
    reachEndFn () {
      this.isLoading = true
      this.getRecommendPeople()
    },
    getRecommendPeople () {
      const query = {
        size: 10
      }
      recommendUserWithPost(query).then(res => {
        if (res.data.code === '200') {
          this.list.splice(this.list.length, 0, ...res.data.result)
          this.page++
        } else {
          Toast({
            message: res.data.message
          })
        }
        this.isLoading = false
      }).catch(() => {
        this.isLoading = false
        Toast({
          message: 'Oops,something went wrong!'
        })
      }
      )
    },
    removePeople (index) {
      this.list.splice(index, 1)
    },
    follow (id, index) {
      const query = {
        userId: id
      }
      followPeople(query).then(res => {
        if (res.data.code === '200') {
          this.list.splice(index, 1)
        } else {
          Toast({
            message: res.data.message
          })
        }
      })
    },
    goRecommendPage () {
      this.$store.state.isEdit = true
      this.$router.push({
        path: '/recommend',
        query: {
          isInit: 0
        }
      })
    }
  }
}
</script>

<style scoped>
.slides{
  width:auto;
  padding-bottom: 0.2rem;
  margin-right:0.24rem;
}
.slides:nth-child(1){
  padding-left: 0.24rem;
}
.title{
  display:flex;
  justify-content:space-between;
  padding:0 0.2rem;
  box-sizing:border-box;
  font-family: SFUIDisplay-Medium;
  font-size: 0.28rem;
  color: rgb(102,102,102);
}
.sliderItem{
  position: relative;
  width:2.66rem;
  height: 3.6rem;
  margin-top:.1rem;
  padding: .4rem .4rem;
  box-sizing: border-box;
  border-radius: .2rem;
  box-shadow: 0.01rem 0.01rem 0.16rem rgb(202,215,236,.8);
  background-color: #fff;
}
.imageCover{
  margin-top: 0.1rem;
  display: flex;
  justify-content: center;
}
.icon{
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  overflow: hidden;
}
.closeBtn{
  position: absolute;
  top: 0;
  right: 0.1rem;
  font-size: 0.46rem;
  color:rgb(202,215,236);
}
.username{
  font-family: SFUIDisplay-Medium;
  font-size: 0.28rem;
  color:rgb(51,51,51);
  text-align: center;
  margin: 0.2rem;
}
.followBtn{
  width: 100%;
  height: .56rem;
  border-radius: .28rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size:0.24rem;
  background: linear-gradient(to right,rgb(52,147,212),rgb(54,100,167));
}
</style>
