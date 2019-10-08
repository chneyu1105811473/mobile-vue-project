<template>
  <div class="trendingTab">
    <post-panel
    v-show="!isList"
    :list="fileList"
    :finished="finished"
    @onLoading="load"
    @onRefresh="refresh"
    @openComment="openComment"
    />
    <post-list
    v-show="isList"
    :fileList="fileList"
    :finished="finished"
    @onLoading="load"
    @onRefresh="refresh"
    />
  </div>
</template>

<script>
import PostPanel from './PostPanel'
import PostList from '@/components/PostList'
export default {
  name: 'TrendingTab',
  components: {PostPanel, PostList},
  props: {
    isList: {
      default: false
    },
    finished: {
      default: false
    },
    fileList: {
      default: function () {
        return []
      },
      type: Array
    }
  },
  methods: {
    load () {
      this.$emit('load', true)
    },
    refresh () {
      this.$emit('refresh', true)
    },
    openComment (val) {
      this.$emit('openComment', val)
    }
  }
}
</script>
