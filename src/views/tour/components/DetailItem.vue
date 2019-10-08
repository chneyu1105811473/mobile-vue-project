<template>
    <div>
        <list
        v-model="loading"
        :finished="finished"
        @load="onLoad"
        >
          <template slot="loading">
              <lottie :height="50"  :width="100" :options="defaultOptions2"/>
          </template>
          <template v-for="(item,index) in list">
            <swipe-cell :key="item.id" :right-width="50" :on-close="onClose">
              <div class="postItem"  @click.stop="goPostDetailPage(item)">
                  <div class="coverImage" v-lazy:background-image="item.thumbnails[1].src||$defaultCover">
                      <!-- <img v-lazy="item.thumbnails?item.thumbnails[1].src:''" alt="cover"> -->
                  </div>
                  <div class="postInfo">
                      <div class="userInfo" @click.stop="goProfilePage(item)">
                          <div class="userIcon">
                              <img v-lazy="item.icon" alt="icon">
                          </div>
                          <div class="username">
                              <p>{{item.creatorName}}</p>
                              <p class="iconfont">&#xe601;{{item.locationShort}}</p>
                          </div>
                      </div>
                      <div class="content">
                          {{item.content}}
                      </div>
                  </div>
              </div>
              <span slot="right" @click="savePostId(item,index)" class="iconfont deleteIcon">
                &#xe632;
              </span>
            </swipe-cell>
          </template>
        </list>
    </div>

</template>

<script>
import {List, SwipeCell, Dialog} from 'vant'
import Lottie from 'vue-lottie'
import animationData2 from '@/assets/data/refresh02.json'

export default {
  name: 'TourDetailItem',
  components: {List, SwipeCell, Lottie},
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
    }
  },
  data () {
    return {
      loading: false,
      defaultOptions2: {
        animationData: animationData2
      }
    }
  },
  watch: {
    list (val) {
      console.log('qwqw', val, this.finished)
      this.loading = false
    }
  },
  methods: {
    onLoad () {
      this.$emit('loading', true)
    },
    goPostDetailPage (item) {
      this.$router.push({
        name: 'PostDetail',
        params: {
          postId: item.id
        }
      })
    },
    goProfilePage (item) {
      this.$router.push({
        name: 'ProfileDetail',
        params: {
          userId: item.creatorId
        }
      })
    },
    savePostId (item, index) {
      this.postIdList = []
      this.postIdList.push(item.id)
      this.deleteIndex = index
    },
    onClose (clickPosition, instance) {
      switch (clickPosition) {
        case 'left':
        case 'cell':
        case 'outside':
          instance.close()
          break
        case 'right':
          Dialog.confirm({
            message: 'Delete post',
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            className: 'morePadding'
          }).then(() => {
            // 调删除评论接口
            this.$emit('deletePost', this.postIdList, this.deleteIndex)
          }).catch(() => {
            instance.close()
          })
          break
      }
    }
  }
}
</script>

<style scoped>
img{
  object-fit: cover;
}
.postItem{
    display: flex;
    padding: 0.1rem 0.2rem;
    box-sizing: border-box;
}
.coverImage{
    min-width: 2rem;
    width:2rem;
    height: 2rem;
    border-radius: .1rem;
    background-repeat: no-repeat;
    background-size: cover;
    overflow: hidden;
}
.postInfo{
    padding: .2rem;
}
.userInfo{
    display: flex;
    align-items: center;
}
.userIcon{
    margin-right: .1rem;
    width: 0.7rem;
    height: 0.7rem;
    border-radius: 50%;
    overflow: hidden;
}
.username p{
    margin:0;
}
.username p:nth-child(1){
    font-size: 0.28rem;
    font-family:'SFUIDisplay-Medium';
    font-weight: bold;
}
.username p.iconfont{
    width: 85%;
    font-family: 'SFUIDisplay-Regular';
    font-size: 0.2rem;
    color: rgb(102,102,102);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.content{
    max-height: 0.9rem;
    margin-top: .1rem;
    font-size: 0.24rem;
    line-height:0.3rem;
    color: rgb(153,153,153);
    overflow : hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}
.deleteIcon{
  color: #fff;
  font-size: 0.4rem;
  font-weight: bold;
}
</style>
