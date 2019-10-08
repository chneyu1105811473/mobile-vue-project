<template>
  <div class="timeline">
    <nav-bar>
      <span slot="left" class="iconfont leftIcon" @click="goBack">&#xe65b;</span>
      <span slot="title" class="title">Timelines</span>
    </nav-bar>
    <div class="posts">
      <list
      v-model="loading"
      :finished="finished"
      @load="onload"
      class="containerBox"
      >
        <template slot="loading">
          <lottie :height="50"  :width="100" :options="defaultOptions2"/>
        </template>
        <div v-for="(item,index) in postList" :key="index">
          <h4 class="title">{{item[0].timeline}}</h4>
          <post-cell
          :fileList="item"
          :finished="true"
          :disabled="true"
          :bottom="index===(postList.length-1)?true:false"
          />
        </div>
      </list>
    </div>
    <!-- EmptyPage -->
    <empty-page v-if="isEmpty"/>
  </div>
</template>

<script>
import {List, Toast} from 'vant'
import {profileTimelines} from '@/api/api'
import toLogin from '@/mixins/toLoginMix'
import PostCell from '@/components/PostCell'
import NavBar from '@/components/NavBar'
import EmptyPage from '@/components/EmptyPage'
import Lottie from 'vue-lottie'
import animationData2 from '@/assets/data/refresh02.json'

export default {
  name: 'TimeLines',
  components: {NavBar, List, PostCell, Lottie, EmptyPage},
  mixins: [toLogin],
  data () {
    return {
      pageSize: 15,
      hasNext: true,
      postList: [],
      timeline: '',
      loading: false,
      finished: false,
      isEmpty: false,
      defaultOptions2: {
        animationData: animationData2
      }
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    async getTimelines () {
      if (!this.hasNext) { return false }
      const query = {
        ...this.$route.params,
        pageSize: this.pageSize,
        lastDate: this.lastDate // yyyy-MM-dd HH:mm:ss，例 2019-01-05 15:39:20
      }
      await profileTimelines(query).then(res => {
        if (res.data.code === '200') {
          this.loading = false
          this.hasNext = res.data.result.hasNext
          if (!this.hasNext) {
            this.finished = true
          } else {
            this.finished = false
          }
          let result = res.data.result.resultData
          this.lastDate = null
          // 此处筛选出post数据，过滤掉tour数据
          result = result.filter(item => !item.type)
          // 构造数据,data中带有时间标记的timeline属性
          result.map((item) => {
            this.lastDate = item.type ? item.data.tourDto.createTime : item.data.createTime
            item.data.timeline = this.getYearAndMonth(this.lastDate)
          })
          // 形成最终渲染数据
          result.forEach(item => {
            if (this.timeline.includes(item.data.timeline)) {
              this.postList[this.postList.length - 1].push(item.data)
            } else {
              this.postList.push([item.data])
            }
            this.timeline = item.data.timeline
          })
        } else {
          Toast({
            message: res.data.message
          })
        }
        this.isEmpty = !(this.postList.length)
      }).catch(err => {
        this.toLogin(err)
      })
    },
    getYearAndMonth (time) {
      let date = new Date(time.replace(/-/g, '/'))
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      return `${months[date.getMonth()]}, ${date.getFullYear()}`
    },
    onload () {
      this.getTimelines()
    }
  }
}
</script>

<style scoped>
.timeline{
  height:100%;
  min-height:100%;
}
.leftIcon{
  font-size: 0.5rem;
}
.posts .title{
  text-indent: .2rem;
  margin-bottom: 0.2rem;
}
.posts{
  padding:0 0.2rem;
}
</style>
