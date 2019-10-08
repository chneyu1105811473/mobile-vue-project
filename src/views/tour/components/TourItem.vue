<template>
  <div>
    <list
    v-model="loading"
    :finished="finished"
    @load="onLoad"
    >
      <template slot="loading">
          <lottie :height="50"  :width="100" :options="defaultOptions2"/>
      </template>
      <template v-for="(item,index) in list">
          <div class="tourItem" :key="index" @click="goTourDetailPage(item)">
              <div class="coverImage" v-lazy:background-image="item.tourDto.coverImage||$defaultCover">
                  <!-- <img v-show="item.tourDto.coverImage" v-lazy="item.tourDto.coverImage" alt="cover"> -->
              </div>
              <div class="tourName">
                  {{item.tourDto.name}}
              </div>
              <div class="postNum" v-if="item.tourDto.postNum">
                  {{item.tourDto.postNum|formateNum}}
              </div>
          </div>
      </template>
    </list>
    </div>
</template>

<script>
import {List} from 'vant'
import Lottie from 'vue-lottie'
import animationData2 from '@/assets/data/refresh02.json'

export default {
  name: 'TourListItem',
  components: {List, Lottie},
  props: {
    list: {
      default: function () {
        return []
      },
      type: Array
    },
    finished: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      loading: false,
      defaultOptions2: {
        animationData: animationData2
      }
    }
  },
  watch: {
    list () {
      this.loading = false
    }
  },
  methods: {
    onLoad () {
      this.$emit('loading', true)
    },
    goTourDetailPage (item) {
      this.$router.push({
        name: 'TourDetail',
        params: {
          tourId: item.tourDto.id
        }
      })
    }
  }
}
</script>

<style scoped>
img{
  object-fit: cover;
}
.tourItem{
    position: relative;
    width: 47%;
    height: 0;
    padding-bottom:47%;
    margin: 1%;
    float: left;
    border-radius: .1rem;
    overflow: hidden;
}
.tourItem:nth-child(2n+1){
    margin-left: 2%;
}
.coverImage{
    position: absolute;
    top: 0;
    left:0;
    right: 0;
    bottom:0;
    background-size: cover;
    background-repeat: no-repeat;
}
.tourName{
    position: absolute;
    bottom: 0;
    display: flex;
    align-items: center;
    text-indent: .2rem;
    color: #fff;
    font-size: 0.28rem;
    width: 100%;
    height: .6rem;
    background: linear-gradient(to bottom,rgb(0,0,0,0),rgb(0,0,0,.53));
}
.postNum{
    position: absolute;
    display: flex;
    align-items: center;
    top: .1rem;
    right: .1rem;
    color:#fff;
    font-size: .2rem;
}
.postNum::before{
    content: "";
    margin-right: 0.05rem;
    width:0.24rem;
    height: 0.28rem;
    background-position:0 0;
    background-repeat:no-repeat;
    background-image: url(../../../assets/img/ic_post@2x.png);
    background-size: contain;
}
</style>
