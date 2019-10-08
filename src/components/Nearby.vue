// 1大5小型瀑布流
<template>
  <div class="nearby">
    <template v-for="(item,index) in fileList">
      <div  :key="index" class="fileItem" ref="imageItem">
        <router-link :to="{name:'PostDetail',params:{postId:item.id}}" class="link">
          <img v-lazy="(index%12 === 2 || index%12 === 6)?item.thumbnails[2].src:item.thumbnails[1].src" alt="item.id">
          <div class="iconfont videoIcon">
            <span v-show="hasVideo(item.postFileDetailDtos).type === 1">
              &#xe614;
            </span>
            <span v-show="hasVideo(item.postFileDetailDtos).type === 0">
              &#xe623;
            </span>
          </div>
        </router-link>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'Nearby',
  props: {
    fileList: {
      default: function () {
        return []
      },
      type: Array
    }
  },
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
  object-fit: cover;
}
.nearby{
    position: relative;
    padding-left: 2%;
    padding-top: 2%;
    box-sizing: border-box;
}
.nearby::after{
    content: "";
    display: block;
    clear: both;
}
.link{
    position: absolute;
    top: 0;
    left: 0;
    width:100%;
    height:100%;
}
.fileItem{
    position: relative;
    width: 32%;
    height: 0;
    padding-bottom: 32%;
    margin:0 1% 1% 0;
    border-radius: .1rem;
    overflow: hidden;
}
.nearby .fileItem:nth-child(12n+3){
    width: 65%;
    height: 0;
    padding-bottom: 65%;
    margin-top: -66%;
    margin-left: 33%;
    border-radius: .2rem;
}
.nearby .fileItem:nth-child(12n+7){
    width: 65%;
    height: 0;
    padding-bottom: 65%;
}
.nearby .fileItem:nth-child(12n+8){
    margin-top:-66%;
    margin-left: 66%;
}
.nearby .fileItem:nth-child(12n+9){
    margin-left: 66%;
}
.fileItem:nth-child(12n+4),
.fileItem:nth-child(12n+5),
.fileItem:nth-child(12n+6),
.fileItem:nth-child(12n+10),
.fileItem:nth-child(12n+11),
.fileItem:nth-child(12n+12){
    float: left;
}
.videoIcon{
    position: absolute;
    top:0;
    left: 0.1rem;
    color: rgba(255,255,255,1);
    font-size: .34rem;
}
</style>
