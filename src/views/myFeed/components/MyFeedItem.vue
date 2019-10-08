<template>
  <div class="postItem" ref="postItem">
    <!-- post -->
    <div class="top userInfo"  @click.stop.prevent="goDetailPage(item.data.id)">
      <div class="userIcon"  @click.stop.prevent="goProfilePage(item.data.creatorId)">
        <img v-lazy="item.data.icon">
      </div>
      <div class="username">
        <span>{{item.data.creatorName}}</span>
        <span class="location iconfont">&#xe601;{{item.data.locationShort}}</span>
      </div>
      <div class="createTime">{{item.data.createTime|createTime}}</div>
      </div>
      <banner :detailData="item.data" :key="item.data.id"/>
      <div class="bottomContainer"  @click.stop.prevent="goDetailPage(item.data.id)">
        <div class="operation">
          <div class="operationBtns" >
            <div class="like" v-cloak >
              <span :class="{'iconfont':true,'active':item.data.isLiked}" @click.stop="likeOrDislikeFn(1,item.data,item.recentlyLikeUserNameList)">
                {{item.data.isLiked?'&#xe801;':'&#xe618;'}}
              </span>
              <span :class="{'active':item.data.isLiked}">{{item.data.postStatisticsDto.likes}}</span>
            </div>
            <div class="dislike" v-cloak>
              <span :class="{'iconfont':true,'active':item.data.isDisLiked}" @click.stop="likeOrDislikeFn(0,item.data,item.recentlyLikeUserNameList)">
                {{item.data.isDisLiked?'&#xe800;':'&#xe613;'}}
              </span>
              <span :class="{'active':item.data.isDisLiked}">{{item.data.postStatisticsDto.dislikes}}</span>
            </div>
            <div class="comment" v-cloak @click.stop='openComment(item.data.id,0)'>
              <span class="iconfont">&#xe60c;</span>
              <span>{{item.data.postStatisticsDto.comments}}</span>
            </div>
          </div>
          <div class="life iconfont">
            <template v-for="(item,index) in getPostLife(item.data.postStatisticsDto.countDown)">
              <div class="lifeItem" :key="index" v-show="item.value">
                {{item.value}}
                <span>{{item.unit}}</span>
              </div>
            </template>
          </div>
        </div>
      <div
      class="likedMember"
      v-show="item.recentlyLikeUserNameList.length"
      >
      <!-- @click.stop="openPeople(item.data.id)" -->
        {{likedMembers(item.recentlyLikeUserNameList)}}
      </div>
      <div class="content">
        {{item.isSeeMore?item.data.content:seeMore(item.data.content,item)}}
        <span
        v-show="item.data.content && item.data.content.length > 130 && !item.isSeeMore"
        @click.stop="item.isSeeMore=true"
        >see more</span>
      </div>
      <div class="tags">
        <span
        v-for="(item,index) in item.data.tagDtoList"
        :key="index"
        >
        <!-- @click.stop="openTag(item.tagId)" -->
            #{{item.tagname.charAt(0).toUpperCase()+item.tagname.slice(1)}}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import Banner from '@/components/Banner'
import likeOrDislikePost from '@/mixins/likeOrDislikePostMix'
import getLifeOrCreateTime from '@/mixins/postLifeMix'

export default {
  name: 'MyFeedItem',
  components: {Banner},
  mixins: [likeOrDislikePost, getLifeOrCreateTime],
  props: {
    item: {
      default: function () {
        return {}
      },
      type: Object
    },
    index: {
      default: 0,
      type: Number
    }
  },
  created () {
    this.$nextTick(() => {
      const height = this.$refs.postItem.offsetHeight
      this.$emit('setHeight', height, this.index)
    })
  },
  methods: {
    seeMore (val, item) {
      if (!val) { return }
      let maxLength
      maxLength = item.type === 0 ? 130 : 150
      if (val.length > maxLength) {
        return item.type === 0 ? val.slice(0, maxLength) + `...` : val.slice(0, maxLength)
      } else {
        return val
      }
    },
    likedMembers (memberArr) {
      const len = memberArr.length
      if (!len) {
        return
      }
      if (len <= 3) {
        const likeMem = memberArr.reduce((preValue, currentVal) => {
          return preValue + ', ' + currentVal
        })
        return `Liked by ${likeMem}`
      } else {
        return `Liked by ${memberArr[0]}, ${memberArr[1]}, ${memberArr[2]} and ${len - 3} others`
      }
    },
    openComment (id, type) {
      this.$emit('openComment', id, type)
    },
    openPeople (id) {
      this.rootId = id
      this.isLikeList = true
      this.$emit('openPeople', id)
    },
    openTag (id) {
      this.$emit('openTag', id)
    },
    goDetailPage (id) {
      this.$router.push({
        name: 'PostDetail',
        params: {
          postId: id
        }
      })
    },
    goProfilePage (id) {
      this.$router.push({
        name: 'ProfileDetail',
        params: {
          userId: id
        }
      })
    }
  }
}
</script>

<style scoped>
.myfeed .iconfont{
    color: rgb(51,51,51);
    font-size: 0.4rem;
}
.postItem{
  padding-top: 0.1rem;
}
.postItem::after{
  content: "";
  display: block;
  margin-top: 0.1rem;
  width: 100%;
  height:0.1rem;
  background-color: rgb(238,238,238);
}
.userInfo.top{
    display: flex;
    align-items: center;
    margin: 0.2rem;
}
.top .userIcon{
    min-width: 0.7rem;
    width: 0.7rem;
    height: 0.7rem;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 0.1rem;
}
.top .username{
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    font-family: SFUIDisplay-Medium;
    font-size: 0.28rem;
}
.username span{
  color: rgb(51,51,51);
}
.top .shareText{
  display: flex;
  flex-wrap: nowrap;
  margin-top: 0.2rem;
  width: 100%;
  font-size: 0.24rem;
  color: rgb(153,153,153);
}
.top .location{
  display: flex;
  align-items: center;
  width: 100%;
  font-size: 0.25rem;
  transform-origin: left bottom;
  transform: scale(.8);
  color: rgb(153,153,153);
  white-space: nowrap;
  text-overflow: clip;
  overflow: hidden;
}
.top .createTime{
  display: flex;
  flex-wrap: nowrap;
  align-self: flex-start;
  justify-content: flex-end;
  width: 100%;
  margin-top: 0.1rem;
  color: rgb(153,153,153);
  font-size: 0.25rem;
  transform: scale(.8);
  transform-origin: right bottom;
}

.bottomContainer{
  padding: 0.1rem 0.2rem;
  box-sizing: border-box;
}

/* 生命值 */
.operation{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.operation .life.iconfont{
    display: flex;
    align-items:center;
    font-size:0.28rem;
}
.operation .life::before{
    content: "\e65a";
    display: inline-block;
}
.operation .life .lifeItem{
    display: flex;
    align-items:center;
}
.operation .life span{
    font-size:0.22rem;
    transform: scale(.8);
    transform-origin: left bottom;
}

.likedMember{
  margin-top: .1rem;
  font-size: 0.25rem;
  transform: scale(.8);
  transform-origin: bottom left;
  color: rgb(153,153,153);
}
.content{
  font-family: SFUIDisplay-Regular;
  font-size: 0.24rem;
  margin: 0.1rem 0;
}
.tags{
  font-size: 0.25rem;
  transform: scale(.8);
  transform-origin: bottom left;
  color: rgb(153,153,153);
}
.tags span{
  margin-right: 0.2rem;
}
.operationBtns{
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  color: rgb(102,102,102);
}
.operationBtns div{
  display: flex;
  align-items: center;
  margin-right: 0.4rem;
  font-size: 0.24rem;
}
.operationBtns .active{
  color: rgb(26,140,253);
  animation:likeAnim 300ms;
}
.content span{
  color: rgb(153,153,153);
  margin-left: 0.1rem;
}
</style>
