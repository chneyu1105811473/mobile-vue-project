<template>
    <div class="tourOrder">
      <nav-bar>
        <span slot="left" @click="goBack">Cancel</span>
        <span slot="title">Change order</span>
        <span slot="right" @click="changeOrderFn">Done</span>
      </nav-bar>

      <draggable
        class="list-group"
        tag="ul"
        v-model="postList"
        v-bind="dragOptions"
        @start="drag = true"
        @end="drag = false"
      >
        <transition-group type="transition" :name="!drag ? 'flip-list' : null" v-for="(item,index) in postList" :key="index">
          <li class="postItem" :key="'drag'+index">
            <div class="postCover">
              <img v-lazy="item.thumbnails?item.thumbnails[1].src:$defaultCover" alt="post cover">
            </div>
            <div class="username">{{item.creatorName}}</div>
            <div class="moveIcon">
              <Icon :name="moveIcon"/>
            </div>
          </li>
        </transition-group>
      </draggable>
    </div>
</template>

<script>
import {Toast, Icon} from 'vant'
import {tourPost, changeOrder} from '@/api/api'
import toLogin from '@/mixins/toLoginMix'
import moveIcon from '@/assets/img/icMove@2x.png'
import draggable from 'vuedraggable'
import NavBar from '@/components/NavBar'

export default {
  name: 'TourOrder',
  components: {NavBar, Icon, draggable},
  mixins: [toLogin],
  data () {
    return {
      postList: [],
      moveIcon: moveIcon,
      drag: false
    }
  },
  created () {
    this.getTourPost()
  },
  computed: {
    dragOptions () {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      }
    }
  },
  methods: {
    getTourPost () {
      const query = this.$route.params
      tourPost(query).then(res => {
        if (res.data.code === '200') {
          this.postList = res.data.result.resultData
        } else {
          Toast({
            message: res.data.message
          })
        }
      }).catch(err => {
        this.toLogin(err)
      })
    },
    changeOrderFn () {
      if (!this.postList.length) { return false }
      this.postIdList = this.postList.map(item => {
        return item.id
      })
      const data = {
        postIdList: this.postIdList,
        tourId: this.$route.params.tourId
      }
      changeOrder(data).then(res => {
        if (res.data.code === '200') {
          this.$router.go(-1)
        } else {
          Toast({
            message: res.data.message
          })
        }
      }).catch(err => {
        this.toLogin(err)
      })
    },
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.postItem{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.2rem;
  border-bottom: 0.02rem solid rgb(236,240,248);
  background-color: #fff;
  overflow: hidden;
}
.username{
  font-family: SFUIDisplay-Medium;
  font-size: 0.32rem;
  width: 100%;
}
.moveIcon{
  margin-right: 0.2rem;
}
.postCover{
  width:1rem;
  min-width: 1rem;
  height: 1rem;
  border-radius: 0.1rem;
  margin-right: 0.3rem;
  overflow: hidden;
}

.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.list-group {
  min-height: 20px;
}
.list-group-item {
  cursor: move;
}
</style>
