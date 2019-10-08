<template>
  <div class="tour-dialog">
    <div class="album-list">
      <div class="dialog-create" v-cloak>
        <span>Album name</span>
        <span class="create-btn" @click.stop="createTour">
          <span class="iconfont create-icon">&#xe612;</span>
          New Album
        </span>
      </div>
      <div class="tourNameContainer">
        <ul class="dialog-content">
          <li v-for="(tour,index) in tourList" :key="index" class="content-item" @click="chooseTour(tour.id,index)">
            <div class="album-cover" v-lazy:background-image="tourInfo.tourDto.coverImage||$defaultCover"/>
              <!-- <img v-show="tour.coverImage" v-lazy="tour.coverImage" alt="cover"> -->
            <!-- </div> -->
            <span class="tour-name">{{tour.name}}</span>
            <div class="check-icon" v-if="chooseIndex === index">
              <img
              :src="checkedIcon"
               alt="checked icon">
            </div>
          </li>
          <li class="content-item">
            <div @click="closeDialog">Cancel</div>
            <div @click="saveTour">Submit</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import {Toast} from 'vant'
import CheckedIcon from '@/assets/img/icSelect@2x.png'
import {saveOrDeleteTour} from '@/api/api'
import toLogin from '@/mixins/toLoginMix'

export default {
  name: 'SaveTour',
  props: {
    tourList: {
      default: function () {
        return []
      },
      type: Array
    },
    postId: {
      default: 0,
      type: Number
    }
  },
  mixins: [toLogin],
  data () {
    return {
      checkedIcon: CheckedIcon,
      chooseIndex: 0,
      tourId: 0,
      tourName: ''
    }
  },
  methods: {
    createTour () {
      this.tourId = null
      this.$emit('create', true)
    },
    chooseTour (id, index) {
      this.tourId = id
      this.chooseIndex = index
    },
    closeDialog () {
      this.tourId = this.tourList[0].id
      this.chooseIndex = 0
      this.tourName = ''
      this.$emit('close', true)
    },
    saveTour () {
      const postIdList = []
      postIdList.push(this.postId)
      const data = {
        tourId: this.tourId || this.tourList[0].id,
        postIdList: postIdList,
        operationType: 1 // 1新增，0 删除
      }
      saveOrDeleteTour(data).then(res => {
        if (res.data.code === '200') {
          Toast({
            type: 'success',
            message: 'Success!'
          })
        } else {
          Toast({
            type: 'fail',
            message: res.data.message
          })
        }
        this.tourId = null
        this.chooseIndex = 0
        this.$emit('saveTour', false)
      }).catch(err => {
        this.toLogin(err)
      })
    }
  }
}
</script>
<style scoped>
    /* shadow & dialog */
img{
  object-fit: cover;
}
.tour-dialog{
    width:100%;
    padding:0.2rem;
    box-sizing: border-box;
    color: rgb(66,93,144);
    font-size: 0.32rem;
}
.album-cover{
  width: 0.8rem;
  min-width: 0.8rem;
  height: 0.8rem;
  border-radius: 0.1rem;
  margin-right: 0.2rem;
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden;
}
.tour-name{
  width: 100%;
  display: flex;
  justify-content: flex-start;
}
.dialog-create{
    display: flex;
    justify-content: space-between;
    background-color: #fff;
    border-radius:0.16rem;
    padding:0.3rem 0.6rem;
    box-sizing: border-box;
    margin-bottom:0.1rem;
}
.dialog-content{
    background-color: #fff;
    border-radius:0.16rem;
    box-sizing: border-box;
    text-align: center;
}
.content-item{
    position: relative;
    padding: 0.3rem 0.6rem;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    border-bottom:0.02rem solid rgb(236,240,248);
}
.content-item:last-child{
    padding:0;
    display: flex;
    justify-content: space-around;
    border-bottom:none;
    color: rgb(52,100,255);
}
.content-item:last-child div{
    padding: 0.3rem 0;
    width: 100%;
}
.content-item:last-child div:nth-child(1){
    border-right: 0.02rem solid rgb(236,240,248);
}
.check-icon{
  width:0.5rem;
}
/* 限制高度 */
.tourNameContainer{
  max-height: 5rem;
  overflow-y: auto;
}

</style>
