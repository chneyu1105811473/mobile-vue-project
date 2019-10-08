<template>
  <pull-refresh
  v-model="isLoading"
  :disabled="disabled"
  @refresh="onRefresh"
  >
    <template slot="pulling">
      <lottie :key="1" :height="50"  :width="100" :options="defaultOptions1"/>
    </template>
    <template slot="loosing">
      <lottie :key="2" :height="50"  :width="100" :options="defaultOptions1" v-on:animCreated="handleAnimation"/>
    </template>
    <template slot="loading">
      <lottie :key="3" :height="50"  :width="100" :options="defaultOptions2"/>
    </template>
    <list
    v-model="loading"
    :finished="finished"
    @load="onload"
    >
    <template slot="loading">
      <lottie :height="50"  :width="100" :options="defaultOptions2"/>
    </template>
      <div class="fileContainer">
        <template  v-for="(item,index) in fileList">
          <div class="fileItem" :key="index">
            <router-link :to="{'name':'PostDetail','params':{postId:item.id}}" class="link">
              <img
              v-lazy="item.thumbnails?item.thumbnails[0].src:$defaultCover"
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
          </div>
        </template>
      </div>
    </list>
      <div class="paddingBottom" v-show="finished&&bottom&&!isEmpty"></div>
    <!-- empty page -->
    <empty-page v-if="isEmpty"/>
  </pull-refresh>
</template>

<script>
import {List, PullRefresh} from 'vant'
import EmptyPage from './EmptyPage'
import Lottie from 'vue-lottie'
import animationData2 from '@/assets/data/refresh02.json'
import animationData1 from '@/assets/data/refresh01.json'

export default {
  name: 'PostCell',
  components: {List, PullRefresh, Lottie, EmptyPage},
  props: {
    fileList: {
      default: function () {
        return []
      },
      type: Array
    },
    finished: {
      default: false,
      type: Boolean
    },
    disabled: {
      default: false,
      type: Boolean
    },
    bottom: {
      default: true,
      type: Boolean
    }
  },
  data () {
    return {
      loading: false,
      isLoading: false,
      isEmpty: false,
      defaultOptions1: {
        animationData: animationData1
      },
      defaultOptions2: {
        animationData: animationData2
      }
    }
  },
  methods: {
    onload () {
      this.$emit('onLoading', true)
    },
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
    },
    onRefresh () {
      this.$emit('onRefresh', true)
    },
    handleAnimation (anim) {
      this.anim = anim
      this.anim.pause()
    }
  },
  watch: {
    fileList (val) {
      this.loading = false
      this.isLoading = false
      this.isEmpty = !(val.length)
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
    box-sizing: border-box;
  }
  .paddingBottom{
    height: 1.2rem;
    height: calc(1.2rem + constant(safe-area-inset-bottom));
    height: calc(1.2rem + env(safe-area-inset-bottom));
    width:100%;
  }
  .fileItem{
    width:32.4%;
    height: 0;
    position: relative;
    margin-right: 0.5%;
    margin-bottom:0.5%;
    padding-bottom: 32.4%;
    border-radius:0.1rem;
    margin-right: 1.4%;
    margin-bottom: 1.4%;
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
