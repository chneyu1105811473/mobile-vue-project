<template>
    <swiper :options="swiperOptions" ref="mySwiper" @reachEnd="reachEndFn" v-if="list">
        <swiper-slide v-for="(item,index) in list" :key="index" ref="slides">
            <div class="sliderItem" :style="{'height':height+'px'}">
              <img
              v-lazy="item.thumbnails?item.thumbnails[1].src:$defaultCover"
              alt="post cover">
             </div>
        </swiper-slide>
    </swiper>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
  name: 'SignUpSwiperWall',
  props: ['fileList', 'getMoreData'],
  components: {swiper, swiperSlide},
  data () {
    return {
      swiperOptions: {
        // some swiper options/callbacks
        // 所有的参数同 swiper 官方 api 参数
        slidesPerView: 4.3,
        spaceBetween: 10,
        breakpoints: {
          1400: {
            slidesPerView: 7.4,
            spaceBetween: 30
          },
          1024: {
            slidesPerView: 6.4,
            spaceBetween: 30
          },
          768: {
            slidesPerView: 5.4,
            spaceBetween: 20
          },
          640: {
            slidesPerView: 4.3,
            spaceBetween: 10
          },
          320: {
            slidesPerView: 3.5,
            spaceBetween: 10
          }
        }
      },
      height: 0
    }
  },
  computed: {
    mySwiper () {
      return this.$refs.mySwiper.swiper
    },
    list: {
      get () {
        return this.fileList
      },
      set () {}
    }
  },
  updated () { // not best but help
    this.$nextTick(() => {
      if (this.height) { return false }
      if (this.$refs.slides) {
        this.height = this.$refs.slides[0].$el.offsetWidth
      }
    })
  },
  mounted () {
    this.$nextTick(() => {
      if (this.height) { return false }
      if (this.$refs.slides) {
        this.height = this.$refs.slides[0].$el.offsetWidth
      }
    })
  },
  methods: {
    reachEndFn () {
      if (this.getMoreData) {
        this.$emit('getMoreFiles', true)
      }
    }
  }
}
</script>

<style scoped>
img{
  object-fit: cover;
}
.sliderItem{
    position: relative;
    width: 100%;
    border-radius: 0.1rem;
    box-sizing: border-box;
    overflow: hidden;
}
.swiper-container{
  padding: 0.2rem 0;
  z-index: 3;
}
</style>
