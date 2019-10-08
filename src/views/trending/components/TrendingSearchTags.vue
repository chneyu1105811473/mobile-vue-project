<template>
  <tags-list :tagList="fileList" :finished="finished" @getMoreData="getMoreDataFn"/>
</template>

<script>
import tagsList from '@/components/TagsList'
import {Toast} from 'vant'
import {searchTag} from '@/api/api'
import toLogin from '@/mixins/toLoginMix'

export default {
  name: 'TrendingSearchTags',
  components: {tagsList},
  props: ['searchText'],
  mixins: [toLogin],
  data () {
    return {
      finished: false,
      page: 1,
      pageSize: 15,
      fileList: []
    }
  },
  methods: {
    getMoreDataFn (val) {
      this.getTagData()
    },
    async getTagData () {
      const data = {
        page: this.page,
        pageSize: this.pageSize,
        tagName: this.searchText
      }
      await searchTag(data).then(res => {
        if (res.data.code === '200') {
          this.fileList.splice(this.fileList.length, 0, ...res.data.result.resultData)
          this.page++
          if (this.page > res.data.result.totalPageNum) {
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
    }
  },
  watch: {
    searchText () {
      this.page = 1
      this.fileList = []
      this.getTagData()
    }
  }

}
</script>
