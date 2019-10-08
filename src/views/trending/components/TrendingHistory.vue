<template>
    <swiper :options="swiperOptions" ref="mySwiper" @reachEnd="reachEndFn">
        <swiper-slide v-for="(item,index) in fileList" :key="index">
            <div
            class="sliderItem"
            :style="{'height':height}"
            @click="goTourDetail(item.tourDto.id)"
            v-lazy:background-image="item.tourDto.coverImage||$defaultCover"
            >
              <tour-cover :tourItem="item"/>
             </div>
        </swiper-slide>
    </swiper>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import tourCover from '@/components/TourCover'

export default {
  name: 'SwiperWall',
  props: ['fileList', 'getMoreData'],
  components: {swiper, swiperSlide, tourCover},
  data () {
    return {
      swiperOptions: {
        // some swiper options/callbacks
        // 所有的参数同 swiper 官方 api 参数
        slidesPerView: 10.5,
        spaceBetween: 50,
        breakpoints: {
          1400: {
            slidesPerView: 6.4,
            spaceBetween: 30
          },
          1024: {
            slidesPerView: 5.4,
            spaceBetween: 30
          },
          768: {
            slidesPerView: 3.4,
            spaceBetween: 20
          },
          640: {
            slidesPerView: 2.5,
            spaceBetween: 10
          },
          320: {
            slidesPerView: 2.3,
            spaceBetween: 10
          }
        }

      },
      height: null
    }
  },
  computed: {
    swiper () {
      return this.$refs.mySwiper.swiper
    }
  },
  updated () {
    this.$nextTick(() => {
      if (this.swiper) {
        this.height = this.swiper.slides[0].childNodes[0].clientWidth + 'px'
      }
    })
  },
  methods: {
    reachEndFn () {
      if (this.getMoreData) {
        this.$emit('getMoreFiles', true)
      }
    },
    goTourDetail (id) {
      this.$router.push({
        name: 'TourDetail',
        params: {
          tourId: id
        }
      })
    }
  }
}
</script>

<style scoped>
.sliderItem{
    position: relative;
    border-radius: 0.1rem;
    height: 0;
    box-sizing: border-box;
    overflow: hidden;
    background-size: cover;
    background-repeat: no-repeat;
}
.item_detail{
    position: absolute;
    top:0;
    left:0;
}
.swiper-container{
  padding: 0.1rem 0;
  z-index: 3;
}
.sliderItem{
    position: relative;
    border-radius: 0.1rem;
    box-sizing: border-box;
    overflow: hidden;
}
.item_detail{
    position: absolute;
    top:0;
    left:0;
    bottom: 0;
    right: 0;
}
.swiper-container{
  padding: 0.2rem 0;
  z-index: 3;
}
</style>
