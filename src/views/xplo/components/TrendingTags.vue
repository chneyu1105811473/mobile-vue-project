<template>
   <div class="tagsList">
    <div class="trendingTab">
      <span class="title">Trending Tags in {{country.country}}</span>
      <div :class="`em-flag-${country.code}`" class="flagIcon"></div>
    </div>
    <div class="tagSwiper">
      <swiper :options="swiperOptions">
        <swiper-slide v-for="item in tagList" :key="item.id" class="slider">
          <div class="tagItem" @click="goTagDetailPage(item.id)">
            <div class="cover">
              <img v-lazy="item.coverImage||$defaultCover" alt="item.name">
            </div>
            <div class="tagName">
              <div class="name van-ellipsis">
                #{{item.name[0].toUpperCase() + item.name.slice(1)}}
              </div>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  name: 'TrendingTags',
  components: {swiper, swiperSlide},
  props: {
    country: Object,
    tagList: Array
  },
  data () {
    return {
      swiperOptions: {
        slidesPerView: 'auto',
        freeMode: true
      }
    }
  },
  methods: {
    goTagDetailPage (id) {
      this.$router.push({
        name: 'TagDetail',
        params: {
          tagId: id
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.trendingTab
    display flex
    align-items center
    margin-top 0.26rem
.trendingTab::before
    content ''
    margin-right 0.1rem
    width 0.06rem
    height 0.26rem
    border-radius 0.02rem
    background-color rgb(26,140,253)
.trendingTab .title
    font-family SFUIDisplay-Medium
    font-weight bold
    margin-right 0.1rem
    font-size 0.28rem
    color rgb(51,51,51)
.flagIcon
    width 0.4rem
    height 0.4rem
    background-size contain
.tagSwiper
    margin-top 0.2rem
.tagItem
    width 2rem
    height 2.4rem
    border-radius 0.1rem
    padding 0.1rem
    box-sizing border-box
    background-color #fff
.cover
    width 100%
    height 1.8rem
    border-radius 0.1rem
    overflow hidden
.cover img
    object-fit cover
.tagName
    margin-top 0.1rem
    font-family SFUIDisplay-Regular
    font-size 0.24rem

.slider
    width auto
    height auto
    margin-right 0.1rem

</style>
