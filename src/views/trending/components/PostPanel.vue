<template>
  <div class="postPanel">
    <pull-refresh
    v-model="isLoading"
    pulling-text="pull down to refresh"
    loosing-text="release to refresh"
    @refresh="onRefresh">
        <template slot="pulling">
          <lottie :key="1" :height="50"  :width="100" :options="defaultOptions1"/>
        </template>
        <template slot="loosing">
          <lottie :key="2" :height="50"  :width="100" :options="defaultOptions1"  v-on:animCreated="handleAnimation"/>
        </template>
        <template slot="loading">
          <lottie :key="3" :height="50"  :width="100" :options="defaultOptions2"/>
        </template>
        <list
        v-model="loading"
        :loading="loading"
        :finished="finished"
        finished-text="Already at the bottom!"
        @load="onLoad"
        >
          <template slot="loading">
            <lottie :height="50"  :width="100" :options="defaultOptions2"/>
          </template>
          <div class="postItem" v-for="(item,index) in list" :key="index">
              <div class="fileItem" @click="goPostDetailPage(item)">
                  <div class="cover">
                      <img
                      v-lazy="item.thumbnails?item.thumbnails[1].src:$defaultCover"
                      alt="post cover">
                  </div>
                  <div class="postInfo">
                      <div class="userInfo" @click.stop="goProfilePage(item)">
                          <div class="userIcon">
                              <img v-lazy="item.icon" alt="icon"/>
                          </div>
                          <div class="username">
                              <div class="name">{{item.creatorName}}</div>
                              <div class="time">{{item.createTime|createTime}}</div>
                          </div>
                      </div>
                      <div class="content">{{item.content}}</div>
                      <div class="operation">
                          <div class="comment" @click.stop="openCommentPage(item.id)">
                              <span class="iconfont">&#xe60c;</span>
                              <span class="num">{{item.postStatisticsDto.comments}}</span>
                          </div>
                          <div class="like" :class="{'active':item.isLiked}" @click.stop="changeLikeType(item)">
                              <span class="iconfont" >{{item.isLiked?'&#xe801;':'&#xe618;'}}</span>
                              <span class="num">{{item.postStatisticsDto.likes}}</span>
                          </div>
                      </div>
                      <div class="location">
                          <span class="iconfont icon">&#xe601;</span>
                          <span class="text">{{item.locationShort}}</span>
                      </div>
                  </div>
              </div>
          </div>
        </list>
    </pull-refresh>

    <div class="paddingBottom" v-show="finished&&bottom"></div>

  </div>
</template>

<script>
import {List, Cell, PullRefresh} from 'vant'
import likeOrDislikePost from '@/mixins/likeOrDislikePostMix'
import Lottie from 'vue-lottie'
import animationData2 from '@/assets/data/refresh02.json'
import animationData1 from '@/assets/data/refresh01.json'

export default {
  name: 'PostPanel',
  components: {List, Cell, PullRefresh, Lottie},
  mixins: [likeOrDislikePost],
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
      defaultOptions1: {
        animationData: animationData1
      },
      defaultOptions2: {
        animationData: animationData2
      }
    }
  },
  watch: {
    list () {
      this.loading = false
      this.isLoading = false
    }
  },
  methods: {
    onLoad () {
      this.$emit('onLoading', true)
    },
    onRefresh () {
      this.$emit('onRefresh', true)
    },
    goProfilePage (item) {
      this.$router.push({
        name: 'ProfileDetail',
        params: {
          userId: item.creatorId
        }
      })
    },
    goPostDetailPage (item) {
      this.$router.push({
        name: 'PostDetail',
        params: {
          postId: item.id
        }
      })
    },
    openCommentPage (id) {
      this.$emit('openComment', id)
    },
    changeLikeType (item) {
      this.likeOrDislikeFn(1, item)
    },
    handleAnimation (anim) {
      this.anim = anim
      this.anim.pause()
    }
  }
}
</script>

<style scoped>
img{
    object-fit: cover;
}
.postPanel{
  background-color: rgb(248,248,248);
}
.postItem{
    padding: 0 .2rem;
    margin-bottom: 0.2rem;
    box-sizing: border-box;
    background-color: #fff;
}
.fileItem{
    display: flex;
    align-items: flex-start;
    overflow: hidden;
}
.cover{
    min-width: 40%;
    width: 40%;
    height: 2.9rem;
}
.userIcon{
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 100%;
    overflow: hidden;
}
.postInfo{
    max-height: 2.9rem;
    width: 60%;
    padding: 0.3rem 0 0.3rem 0.3rem;
    box-sizing: border-box;
    font-family: 'SFUIDisplay-Regular';
}
.userInfo{
    display:flex;
    align-items: center;
}
.username{
    margin-left: .1rem;
}
.username .name{
    font-size: 0.28rem;
    line-height: 0.3rem;
    font-weight: bold;
    color: rgb(51,51,51);
}
.username .time{
    margin-top: .1rem;
    font-size: 0.22rem;
    line-height: 0.24rem;
    transform: scale(.9);
    transform-origin: left bottom;
    color: rgb(153,153,153);
}
.content{
    max-height: 0.92rem;/*为兼容移动端safari*/
    padding-top: .2rem;
    box-sizing: border-box;
    font-size: 0.24rem;
    line-height: 0.24rem;
    color: rgb(102,102,102);
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    overflow : hidden;
}
.operation{
    display: flex;
    align-items: center;
    font-size: 0.22rem;
    color: rgb(187,187,187);
}
.operation .comment,.operation .like{
    display: flex;
    align-items: center;
}
.operation .active{
  animation:likeAnim 300ms;
}
.operation .comment{
    margin-right: .2rem;
}
.operation .num{
  transform: scale(.9);
  transform-origin: left center;
}
.location{
    display: flex;
    align-items: center;
    font-size: 0.24rem;
    color: rgb(130,167,208);
}
.location .text{
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
.location .icon{
    font-size: 0.25rem;
    transform: scale(.8);
    transform-origin: center left;
}
.paddingBottom{
    height: 1.2rem;
    height: calc(1.2rem + constant(safe-area-inset-bottom));
    height: calc(1.2rem + env(safe-area-inset-bottom));
    width:100%;
}
</style>
