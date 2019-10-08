<template>
  <div class="tagsList">
    <list
    v-model="loading"
    :finished="finished"
    finished-text="Already at the bottom!"
    @load="onLoad">
      <template slot="loading">
        <lottie :height="50"  :width="100" :options="defaultOptions2"/>
      </template>
      <cell v-for="(item,index) in tagList" :key="index">
        <div class="tagItem">
          <div>
            <p class="tagName ellipsis">{{'#'+item.name}}</p>
            <p class="tagInfo">
              <span class="tagFollowers">{{item.followAmount|formateNum}} Followers</span>
              <span class="tagPosts">{{item.postAmount|formateNum}} Posts</span>
            </p>
          </div>
          <div :class="{'followBtn':true,'following':item.isFollowed}" @click="changeTagFollowType(item)">
            {{item.isFollowed?'Following':'Follow'}}
          </div>
        </div>
      </cell>
    </list>
    <div class="paddingBottom" v-show="finished&&bottom"></div>
  </div>
</template>

<script>
import {List, Cell} from 'vant'
import changeTagFollowType from '@/mixins/changeTagFollowTypeMix'
import Lottie from 'vue-lottie'
import animationData2 from '@/assets/data/refresh02.json'

export default {
  name: 'AllTags',
  components: {List, Cell, Lottie},
  props: {
    bottom: {
      default: true,
      type: Boolean
    },
    tagList: {
      default: function () {
        return []
      },
      type: Array
    },
    finished: {
      default: false,
      type: Boolean
    }
  },
  mixins: [changeTagFollowType],
  data () {
    return {
      loading: false,
      allTags: [],
      filterTags: [],
      searchText: '',
      totalNum: 0,
      page: 1,
      pageSize: 15,
      defaultOptions2: {
        animationData: animationData2
      }
    }
  },
  methods: {
    onLoad () {
      // 异步更新数据
      this.$emit('getMoreData', true)
    }
  },
  watch: {
    finished (val) {
      if (val) {
        this.loading = false
      }
    },
    tagList () {
      this.loading = false
    }
  }
}
</script>
<style scoped>
.searchInput.search{
  margin:0.2rem;
}
.tagsList{
  font-family: SFUIDisplay-Regular;
}
.tagItem{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.tagInfo{
  margin: 0 0.1rem;
  color: rgb(153,153,153);
  font-size: 0.26rem;
}
.tagName{
  font-family: SFUIDisplay-Medium;
  color:rgb(51,51,51);
  /* font-weight: 600; */
  font-size:0.32rem;
  margin: 0 0.1rem;
}
.tagName.ellipsis{
  width: 4rem;
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow:ellipsis;
}
.tagFollowers{
  margin-right: 0.2rem;
}
.followBtn{
  display: flex;
  justify-content: center;
  align-items: center;
  color:#fff;
  width:1.4rem;
  height: 0.5rem;
  font-size: 0.24rem;
  border-radius:0.25rem;
  background:rgb(26,140,253);
}
.followBtn.following{
  height: 0.48rem;
  color:rgb(26,140,253);
  background: #fff;
  border:0.01rem solid rgb(26,140,253);
}
.addIcon{
  font-size:0.4rem;
}
.paddingBottom{
  height: 1.2rem;
  height: calc(1.2rem + constant(safe-area-inset-bottom));
  height: calc(1.2rem + env(safe-area-inset-bottom));
  width:100%;
}

</style>
