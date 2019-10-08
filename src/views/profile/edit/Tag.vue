<template>
    <div class="tagsSetting">
        <div class="btnBack iconfont" @click="goBack">&#xe65b;</div>
        <div class="tagContainer">
          <tabs
          v-model="tabActive"
          :line-width="lineWidth"
          :swipeable="true"
          :animated="false"
          :border="false"
          color="rgb(51,51,51)"
          @change="changeTabFn"
          >
            <tab title="Popular" class="tab1">
              <all-tags :refresh='refresh'/>
            </tab>
            <tab title="Following" class="tab2">
              <following-tags :refresh='refresh'/>
            </tab>
          </tabs>
        </div>
    </div>
</template>

<script>
import FollowingTags from './components/FollowingTags'
import AllTags from './components/AllTags'
import {Tab, Tabs} from 'vant'

export default {
  name: 'TagsSetting',
  components: {Tab, Tabs, FollowingTags, AllTags},
  data () {
    return {
      tabActive: 0,
      rightText: '',
      lineWidth: 40,
      refresh: false
    }
  },
  methods: {
    changeTabFn () {
      this.refresh = !this.refresh
    },
    goBack () {
      history.go(-1)
    }
  }
}
</script>

<style scoped>
.tagsSetting{
  position: relative;
}
.tagContainer::before{
  content: "";
  display: block;
  width:100%;
  height: 0.2rem;
}
.btnBack{
  position: fixed;
  top: .2rem;
  left:.1rem;
  font-size: .5rem;
  z-index: 999;
}
</style>
