<template>
  <div class="tagsList">
    <search-input v-model="searchText" class="search"/>
    <tags-list :tagList="tagList" :finished="finished" @getMoreData="getMoreDataFn" />
  </div>
</template>
<script>
import SearchInput from '@/components/Search'
import TagsList from '@/components/TagsList'
import {getRecommendTags} from '@/api/api.js'
import toLogin from '@/mixins/toLoginMix.js'
import changeTagFollowType from '@/mixins/changeTagFollowTypeMix'
import {Toast} from 'vant'

export default {
  name: 'AllTags',
  components: {SearchInput, TagsList},
  props: ['refresh'],
  mixins: [toLogin, changeTagFollowType],
  data () {
    return {
      finished: false,
      tagList: [],
      searchText: '',
      page: 1,
      pageSize: 15,
      isRefresh: false
    }
  },
  watch: {
    searchText () {
      this.page = 1
      this.tagList = []
      this.getTagData()
    },
    refresh () {
      this.isRefresh = true
      this.page = 1
      this.getTagData()
    }
  },
  methods: {
    async getTagData () {
      const data = {
        page: this.page,
        pageSize: this.pageSize,
        tagName: this.searchText
      }
      await getRecommendTags(data).then(res => {
        if (res.data.code === '200') {
          if (res.data.result.resultData.length) {
            if (this.isRefresh) {
              this.tagList.splice(0, this.tagList.length, ...res.data.result.resultData)
            } else {
              this.tagList.splice(this.tagList.length, 0, ...res.data.result.resultData)
            }
          }
          this.isRefresh = false
          this.loading = false
          this.page++
          // 数据全部加载完成
          if (this.page >= res.data.result.totalPageNum) {
            this.finished = true
          } else {
            this.finished = false
          }
        } else {
          Toast({
            message: res.data.message
          })
        }
      }).catch(err => {
        this.toLogin(err)
      })
    },
    getMoreDataFn () {
      this.getTagData()
    }
  }

}
</script>
<style scoped>
.search{
  margin:0.2rem;
}
</style>
