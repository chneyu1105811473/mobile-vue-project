<template>
  <div>
    <div class="fileContainer">
      <template  v-for="item in list">
        <div class="fileItem" :key="item.id">
          <router-link :to="{'name':'PostDetail','params':{postId:item.id}}" class="link">
            <img v-lazy="item.thumbnails?item.thumbnails[0].src:$defaultCover" alt="img">
          </router-link>
        </div>
      </template>
    </div>
    <div class="showMore" v-show="fileList.length > 6 && isShow" @click="seeMore" />
  </div>
</template>

<script>
export default {
  name: 'TagTrending',
  props: ['fileList'],
  data () {
    return {
      isShow: true
    }
  },
  computed: {
    list () {
      if (this.fileList.length > 6 && this.isShow) {
        const tempList = this.fileList.filter((item, index) => {
          return index < 6
        })
        return tempList
      } else {
        return this.fileList
      }
    }
  },
  methods: {
    seeMore () {
      this.isShow = false
    }
  }
}
</script>

<style scoped>
  .fileContainer{
    margin-left:2%;
    display: flex;
    flex-wrap: wrap;
    max-height: 100%;
    padding: 0.2rem 0;
    box-sizing: border-box;
  }
  .fileItem{
    position: relative;
    margin-right: 1.5%;
    margin-bottom:1.5%;
    padding-bottom: 31.5%;
    width:31.5%;
    height: 0;
    border-radius: .15rem;
    overflow: hidden;
    transition: all 1s ease-in-out;
    backface-visibility: hidden;
  }
  .fileItem:nth-child(3n){
    margin-right: 0;
  }
  .showMore{
    margin:0 auto;
    width: 1.4rem;
    height: 0.72rem;
    background-position:0 0;
    background-repeat:no-repeat;
    background-image:url(../../../assets/img/icPulldown@2x.png);
    background-size: cover;
  }
  .link{
    position:absolute;
    left:0;
    top:0;
    width:100%;
    height:100%;
  }
</style>
