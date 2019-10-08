<template>
  <div class="fileContainer">
    <template  v-for="(item,index) in fileList">
      <div class="fileItem" :key="index">
        <!-- if post -->
        <!-- 正常无item.flag，但是在需要展示tour的数组中需要手动添加一个flag -->
        <template v-if="!item.flag">
          <router-link :to="{'name':'PostDetail','params':{postId:item.id}}" class="link">
            <img
            v-lazy="item.thumbnails?item.thumbnails[1].src:$defaultCover"
            alt="post cover"
            >
            <div class="iconfont videoIcon">
              <span v-show="hasVideo(item.postFileDetailDtos).type === 1">
                &#xe614;
              </span>
              <span v-show="hasVideo(item.postFileDetailDtos).type === 0">
                &#xe623;
              </span>
            </div>
          </router-link>
          <slot name="choosePost" :props="item"></slot>
        </template>
        <!-- if tour -->
        <!-- <template v-else>
          <router-link :to="{name:'TourDetail',params:{tourId:item.tourDto.id}}" class="link">
            <img v-lazy="item.tourDto.coverImage">
            <TourCover :tourItem="item"></TourCover>
          </router-link>
        </template> -->
      </div>
    </template>
  </div>
</template>

<script>
import TourCover from '@/components/TourCover'

export default {
  name: 'TimelineList',
  props: {
    fileList: {
      default: function () {
        return []
      },
      type: Array
    }
  },
  components: {TourCover},
  data () {
    return {}
  },
  methods: {
    hasVideo (files) {
      const len = files.length
      const index = files.findIndex(item => {
        return item.type === 1
      })
      if (index >= 0 && len > 1) {
        return {
          type: 1
        }
      } else if (index < 0 && len > 1) {
        return {
          type: 0
        }
      } else {
        return {
          type: -1
        }
      }
    }
  }
}
</script>

<style scoped>
  img{
    object-fit: cover
  }
  .fileContainer{
    display: flex;
    flex-wrap: wrap;
    max-height: 100%;
    padding-left: 0.2rem;
    box-sizing: border-box;
  }
  .fileItem{
    position: relative;
    margin-right: 0.5%;
    margin-bottom:0.5%;
    width:31.5%;
    height: 0;
    padding-bottom: 31.5%;
    border-radius:0.2rem;
    margin-right: 0.1rem;
    margin-bottom: 0.1rem;
    overflow: hidden;
  }
  .fileItem:nth-child(3n){
    margin-right: 0;
  }
  .videoIcon{
    position: absolute;
    top:0;
    left: 2%;
    color: rgba(255,255,255,1);
    font-size: .32rem;
  }
  .link{
    position: absolute;
    top: 0;
    left: 0;
    width:100%;
    height:100%;
  }
</style>
