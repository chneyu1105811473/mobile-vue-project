<template>
  <div>
    <nav-bar>
      <span slot="left" class="iconfont leftIcon" @click="goBack">&#xe65b;</span>
      <span slot="title" class="title">Choose posts</span>
      <span slot="right" class="iconfont rightIcon" @click="savePostToTour">&#xe60e;</span>
    </nav-bar>
    <!-- 如下展示所有的post -->
    <history-post @sendCheckList="getCheckList"/>
  </div>
</template>

<script>
import {Toast} from 'vant'
import HistoryPost from './components/HistoryPost'
import NavBar from '@/components/NavBar'
import {saveOrDeleteTour} from '@/api/api'
import toLogin from '@/mixins/toLoginMix'

export default{
  name: 'ChoosePosts',
  mixins: [toLogin],
  components: {NavBar, HistoryPost},
  data () {
    return {
      postIdList: []
    }
  },
  methods: {
    goBack () {
      this.$router.back()
    },
    getCheckList (val) {
      this.postIdList = val
    },
    savePostToTour () {
      if (this.postIdList.length) {
        const data = {
          operationType: 1, // 1:新增，0，删除
          postIdList: this.postIdList,
          tourId: this.$route.params.tourId
        }
        saveOrDeleteTour(data).then(res => {
          Toast({
            message: res.data.message
          })
          if (res.data.code === '200') {
            // 成功之后回到上一个页面
            this.$router.go(-1)
          } else {
            Toast({
              message: res.data.message
            })
          }
        }).catch(err => {
          this.toLogin(err)
        })
      }
    }
  }
}
</script>

<style scoped>
.leftIcon{
  font-size: 0.5rem;
}
.rightIcon{
  font-size:0.5rem;
}
</style>
