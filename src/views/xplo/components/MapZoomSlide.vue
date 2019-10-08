<template>
    <div class="zoomSlide">
        <slider
        v-model="zoom"
        :step="0.1"
        :vertical="true"
        :min="3"
        :max="15"
        bar-height="0.05rem"
        inactive-color="rgba(255,255,255,.5)"
        active-color="rgba(255,255,255,0)"
        @drag-start="isActive = true"
        @drag-end="onDragEnd"
        >
            <template slot="button">
                <div class="btn" :class="{'active':isActive}">
                  <div class="zoomIcon">
                    <img :src="icon" alt="icon">
                  </div>
                </div>
            </template>
        </slider>
    </div>
</template>

<script>
import {Slider} from 'vant'
import dog from '@/assets/img/ic_zoom_dog@2x.png'
import elephant from '@/assets/img/ic_zoom_elephant@2x.png'
import hippos from '@/assets/img/ic_zoom_hippos@2x.png'
import ladybug from '@/assets/img/ic_zoom_ladybug@2x.png'
import squirrel from '@/assets/img/ic_zoom_squirrel@2x.png'
import tiger from '@/assets/img/ic_zoom_tiger@2x.png'
import whale from '@/assets/img/ic_zoom_whale@2x.png'

export default {
  name: 'ZoomSlide',
  components: {Slider},
  data () {
    return {
      isActive: false,
      zoomIcons: [ladybug, squirrel, dog, hippos, tiger, elephant, whale]
    }
  },
  computed: {
    icon () {
      return this.zoomIcons[7 - Math.floor((this.zoom) / 2)]
    },
    zoom: {
      get () {
        return 18 - this.$store.state.zoom
      },
      set (val) {
        this.$store.commit('updateZoom', 18 - val)
      }
    }
  },
  methods: {
    onDragEnd () {
      this.isActive = false
      this.$emit('dragSlideEnd', true)
    }
  }
}
</script>

<style lang="stylus" scoped>
.zoomSlide
    position fixed
    height 5rem
    right 0
    bottom: 45%;
    z-index 2
.btn
    padding 0.04rem
    margin-right 0.5rem
    width 0.5rem
    height 0.5rem
    background-color #fff
    border-radius 0.1rem 0 0 0.1rem
    overflow hidden
    transform-origin right bottom
    transition all 500ms

.btn.active
    padding 0.04rem
    width 2.5rem
    height 0.8rem
    transform-origin right bottom

.zoomIcon{
    height 100%
    width 0.5rem
}
.btn.active .zoomIcon
    width 0.8rem
</style>
