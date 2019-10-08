<template>
  <div>
    <NoDataPage v-if="empty"/>
    <RecommendPeople v-show="finished"/>
    <p class="bottom">—— Already at the bottom ——</p>
  </div>
</template>

<script>
import NoDataPage from './NoDataPage'
import RecommendPeople from './RecommendPeople'

export default {
  name: 'NoMyFeedItem',
  props: {
    empty: {
      default: false,
      type: Boolean
    },
    finished: {
      default: false,
      type: Boolean
    }
  },
  components: {NoDataPage, RecommendPeople}
}
</script>

<style scoped>
.bottom{
  text-align: center;
  font-size: 0.28rem;
  color: rgb(153,153,153);
  margin-bottom: constant(safe-area-inset-bottom);
  margin-bottom: env(safe-area-inset-bottom);
}
</style>
