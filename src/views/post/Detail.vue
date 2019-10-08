<template>
    <div class="posts" v-if="!updating">
      <!-- detail page -->
      <Article
      v-if="detailData"
      :detailData="detailData"
      :sticky="isSticky"
      @open="onOpen"
      >
        <template v-slot:back>
          <span class="iconfont goBack" @click="goBack">&#xe774;</span>
        </template>
      </Article>
      <!-- nearby -->
       <list
        v-model="loading"
        :finished="finished"
        finished-text="Already at the bottom!"
        @load="onLoad"
        >
          <template slot="loading">
            <lottie :height="50"  :width="100" :options="defaultOptions2"/>
          </template>
          <template v-for="(item,index) in postNearbyList" >
            <Article :detailData="item" :key="index" @open="onOpen"/>
          </template>
       </list>

      <!-- comment pop -->
      <popup
      round
      style="height:80%"
      position="bottom"
      v-model="isComment"
      @open="showComment = true"
      @closed="showComment = false">
          <comment
          v-if="showComment||isComment"
          :commentType="commentType"
          :rootId="rootId"
          @close="isComment = false"
          />
      </popup>

      <!-- likes List pop -->
      <popup
      round
      position="bottom"
      style="height:80%"
      v-model="isLikeList"
      @open="showLikes = true"
      @closed="showLikes = false"
      >
          <like-list
          v-if="showLikes||isLikeList"
          :rootId="rootId"
          @close="isLikeList = false"
          />
      </popup>

      <!-- tag detail pop -->
      <popup
      round
      style="height:80%"
      position="bottom"
      v-model="isTagDetail"
      @open="showTag = true"
      @closed="showTag = false"
      >
          <tag-detail
          v-if="showTag||isTagDetail"
          :rootId="rootId"
          @close="isTagDetail = false"
          />
      </popup>

    </div>
</template>
<script>
import {postNearby, postDetail} from '@/api/api'
import {Popup, List, Toast} from 'vant'
import toLogin from '@/mixins/toLoginMix'
import Article from '@/components/Article'
import Comment from '@/views/comment/Comment'
import TagDetail from '@/views/tag/TagDetail'
import LikeList from './LikeList'
import Lottie from 'vue-lottie'
import animationData2 from '@/assets/data/refresh02.json'

export default {
  name: 'PostDetail',
  mixins: [toLogin],
  components: {Popup, List, Article, Comment, LikeList, TagDetail, Lottie},
  data () {
    return {
      detailData: null,
      pageSize: 10,
      postNearbyList: [],
      hasNext: false,
      loading: false,
      updating: false,
      finished: false,
      isSticky: true,
      commentType: 0,
      isComment: false,
      isLikeList: false,
      isTagDetail: false,
      showComment: false,
      showLikes: false,
      showTag: false,
      rootId: 0,
      defaultOptions2: {
        animationData: animationData2
      }
    }
  },
  activated () {
    this.postNearbyList = []
    this.getDetailData()
    this.rootId = JSON.parse(this.$route.params.postId)
  },
  computed: {
    postId () {
      return this.$route.params.postId
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    getDetailData () { // 数据请求
      this.updating = true
      const query = {
        postId: this.postId
      }
      postDetail(query)
        .then((res) => {
          if (res.data.code === '200') {
            this.detailData = Object.assign({}, res.data.result)
            // 如果从消息跳转弹出评论框
            this.isComment = this.$route.query.commentId >= 0
            // 获取post nearby数据
            this.latitude = this.detailData.latitude
            this.longitude = this.detailData.longitude
            this.tagIdList = this.detailData.tagDtoList.map(item => {
              return item.tagId
            })
            this.getPostNearby()
          // 分享
          } else {
            Toast(res.data.message)
            if (res.data.code.includes('6')) {
              this.$router.go(-1)
            }
          }
          this.updating = false
        })
        .catch((err) => {
          this.updating = false
          this.toLogin(err)
        })
    },
    getPostNearby () {
      const data = {
        'latitude': this.latitude,
        'levelType': this.levelType,
        'longitude': this.longitude,
        'maxDistance': this.maxDistance,
        'minDistance': this.minDistance || 0,
        'pageSize': this.pageSize,
        'tagIdList': this.tagIdList
      }
      postNearby(data).then(res => {
        if (res.data.code === '200') {
          // 判断评论的初始状态
          this.hasNext = res.data.result.hasNext
          this.loading = false
          if (!this.hasNext) {
            this.finished = true
          }
          if (!res.data.result.resultData.length) { return false }
          this.levelType = res.data.result.levelType
          this.postNearbyList.splice(this.postNearbyList.length, 0, ...res.data.result.resultData)
          this.latitude = res.data.result.resultData[res.data.result.resultData.length - 1].latitude
          this.longitude = res.data.result.resultData[res.data.result.resultData.length - 1].longitude
          this.minDistance = res.data.result.resultData[res.data.result.resultData.length - 1].distance
        } else {
          Toast({
            message: res.data.message
          })
        }
      }).catch((err) => {
        this.toLogin(err)
      })
    },
    onLoad () {
      if (this.hasNext) {
        this.getPostNearby()
      }
    },
    onOpen (id, name) {
      this.rootId = id
      if (name.includes('comment')) {
        this.isComment = true
      } else if (name.includes('like')) {
        this.isLikeList = true
      } else if (name.includes('tag')) {
        this.isTagDetail = true
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.posts{
  background-color: rgb(45,46,51)
}
.goBack{
  margin-left: .2rem;
  font-size: 0.6rem;
  color:#fff;
}
</style>
