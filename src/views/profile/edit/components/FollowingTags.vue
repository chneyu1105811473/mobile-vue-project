<template>
  <div class="tagsList">
    <search-input v-model="searchText" class="search"/>
    <tags-list :tagList="tagList" :finished="finished" @getMoreData="getMoreDataFn"/>
  </div>
</template>
<script>
import SearchInput from '@/components/Search'
import TagsList from '@/components/TagsList'
import {getFollowingTags} from '@/api/api'
import changeTagFollowType from '@/mixins/changeTagFollowTypeMix'
import toLogin from '@/mixins/toLoginMix'
import {Toast} from 'vant'

export default {
  name: 'FollowingTags',
  props: ['refresh'],
  mixins: [changeTagFollowType, toLogin],
  components: {SearchInput, TagsList},
  data () {
    return {
      finished: false,
      searchText: '',
      page: 1,
      pageSize: 15,
      tagList: [],
      isRefresh: false
    }
  },
  watch: {
    searchText () {
      this.onRefresh()
    },
    refresh () {
      this.onRefresh()
    }
  },
  methods: {
    async getTagData () {
      const data = {
        page: this.page,
        pageSize: this.pageSize,
        tagName: this.searchText
      }
      await getFollowingTags(data).then(res => {
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
    },
    onRefresh () {
      this.isRefresh = true
      this.page = 1
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
