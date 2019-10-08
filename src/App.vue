<template>
  <div id="app">
    <Download/>
    <keep-alive :exclude="excludePage">
      <!-- vue-router -->
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
import MsgMix from '@/mixins/initMsgMix'
import Preload from '@/mixins/preloadMix'
import inobounce from '@/mixins/iNoBounceMix'
import Download from '@/components/popup/DownloadBtn'

export default {
  name: 'App',
  mixins: [
    MsgMix,
    Preload,
    inobounce],
  components: {Download},
  data () {
    return {
      excludePage: [
        'ChoosePosts',
        'TagDetail',
        'PeopleRecommend']
    }
  },
  computed: {
    offline () {
      return this.$store.state.offline
    }
  },
  watch: {
    offline (val) {
      if (val) {
        this.$router.push('/offline')
      } else {
        this.$router.replace('xplo')
      }
    }
  }
}
</script>

<style>
#app {
  height: 100%;
  font-family:'SFUIDisplay-Regular';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
  font-size: 0.32rem;
  -webkit-overflow-scrolling: touch;
}
</style>
