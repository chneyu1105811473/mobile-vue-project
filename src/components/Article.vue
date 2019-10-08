<template>
    <div class="postDetail">
        <!-- header -->
        <header class="postHeader" :class="{'fixed':sticky}" ref='header'>
            <slot name="back"></slot>
            <div class="userContainer">
                <router-link
                class="userInfo"
                tag="div"
                :to="{name:'ProfileDetail',params:{userId:detailData.creatorId}}"
                >
                    <img v-lazy="detailData.icon">
                    <span class="username" v-cloak>
                        {{detailData.creatorName}}
                    </span>
                </router-link>
                <div class="followBtn" v-if="!isSelf && detailData.memberDto" @click="followPeopleFn(detailData.memberDto)">
                  {{detailData.memberDto.isFollowing?'Following':'Follow'}}
                </div>
            </div>
            <div class="btns">
                <div class="saveTour iconfont" @click.stop.prevent="saveOrCancelAlbum">
                  {{detailData.saveFlag?'&#xe605;':'&#xe661;'}}
                </div>
                <div class="report iconfont" @click.stop.prevent="reportFn">&#xe60f;</div>
            </div>
            <div class="deletePop" v-show="dialog.headPop" @click.stop="deleteOrReportFn">
               {{isSelf?'Delete':'Report'}}
             </div>
        </header>
        <div class="postContainer">
          <!-- banner -->
          <banner :detailData="detailData" @deliverSwiperIndex="getSwiperIndex"/>
          <!-- post content -->
          <div class="postContent">
              <!-- operations -->
              <div class="postOperations">
                <div class="like btn">
                    <span class="iconfont icon" :class="{'isActive':detailData.isLiked}" @click="likeOrDislikeFn(1,detailData)">
                        {{detailData.isLiked?'&#xe801;':'&#xe618;'}}
                    </span>
                    <div class="number" @click="openLikesPage(detailData.id)">
                      {{detailData.postStatisticsDto.likes|formateNum}}
                    </div>
                </div>
                <div class="dislike btn">
                    <span class="iconfont icon" :class="{'isActive':detailData.isDisLiked}" @click="likeOrDislikeFn(0,detailData)">
                        {{detailData.isDisLiked?'&#xe800;':'&#xe613;'}}
                    </span>
                    <span class="number">
                        {{detailData.postStatisticsDto.dislikes|formateNum}}
                    </span>
                </div>
                <div class="comment btn" @click="openCommentPage(detailData.id)">
                    <span class="iconfont icon">&#xe60c;</span>
                    <span class="number">
                        {{detailData.postStatisticsDto.comments|formateNum}}
                    </span>
                </div>
              </div>
              <!-- location -->
              <div class="postLocation" v-cloak @click="goXploPage">
                <div class="locationText">
                  <span class="locationItem">{{detailData.location}}</span>
                  <span class="locationItem">{{detailData.locationShort}}</span>
                </div>
              </div>
              <!-- tags -->
              <div class="postTags" v-cloak>
                  <template v-for="(item,index) in detailData.tagDtoList">
                      <span :key="index" @click="openTagDetailPage(item.tagId)">
                          #{{item.tagname.charAt(0).toUpperCase()+item.tagname.substring(1)}}
                      </span>
                  </template>
              </div>
              <div class="postText">
                  <p class="content" ref="content" v-html="detailData.content"></p>
                  <div class="postLife">
                    <div class="life iconfont">
                      <template v-for="(item,index) in postLife">
                        <div class="lifeItem" :key="index" v-show="item.value">
                          {{item.value}}
                          <span>{{item.unit}}</span>
                        </div>
                        </template>
                    </div>
                    <span class="textTime" v-cloak>
                      {{detailData.createTime|createTime}}
                    </span>
                  </div>
              </div>
              <!-- links -->
              <template v-if="detailData.isxplo">
                <div class="links" v-for="(item,index) in detailData.postFileDetailDtos" :key="index" v-show="index === swiperIndex">
                    <span class="label">From</span>
                    <a :href="item.link" v-cloak>
                      {{item.link && item.link.length > 20?item.link.slice(0,20)+'...':item.link}}
                    </a>
                    <a :href="item.link" class="visit">Visit</a>
                </div>
              </template>
          </div>
        </div>

        <!-- report -->
        <popup v-model="dialog.isReport">
          <report-pop
          type="post"
          :reasons="reportReasons"
          :title="reportTitle"
          @close="dialog.isReport = false"
          />
        </popup>

        <!-- setting -->
        <div class="postPop" v-show="dialog.headPop" @click.prevent="closeReport"/>

        <!-- tour list-->
        <popup v-model="dialog.isSaveTour" position="bottom">
          <save-tour
          :tourList="tourList"
          :postId="detailData.id"
          @close="dialog.isSaveTour = false"
          @saveTour="saveTourFn"
          @create="createFn"
          />
        </popup>

        <!-- 创建新的相册 -->
        <popup v-model="dialog.isCreateAlbum">
          <create-album @reloadTourList="reloadTourListFn" @close="dialog.isCreateAlbum=false">
            <template slot="submit" slot-scope="albumName">
              <div class="submitBtn" @click="submitFn(albumName)">Submit</div>
            </template>
          </create-album>
        </popup>
    </div>
</template>
<script>
import {getMyTours, addTour, deletePost, saveOrDeleteTour} from '@/api/api'
import {Popup, Dialog, Toast} from 'vant'
import ReportPop from '@/components/popup/ReportPop'
import SaveTour from '@/components/popup/SaveTourPop'
import Banner from '@/components/Banner'
import CreateAlbum from '@/components/popup/NewTourPop'
import getLifeOrCreateTime from '@/mixins/postLifeMix'
import likeOrDislikePost from '@/mixins/likeOrDislikePostMix'
import changePeopleFollowType from '@/mixins/changePeopleFollowTypeMix'
import toLogin from '@/mixins/toLoginMix'

export default {
  name: 'Article',
  props: {
    detailData: {
      default: function () {
        return {}
      },
      type: Object
    },
    sticky: {
      default: false,
      type: Boolean
    }
  },
  mixins: [getLifeOrCreateTime, likeOrDislikePost, toLogin, changePeopleFollowType],
  components: {ReportPop, SaveTour, Popup, Banner, Dialog, CreateAlbum},
  data () {
    return {
      swiperIndex: 0, // 轮播指示
      dialog: {// 弹框
        isReport: false,
        isSaveTour: false,
        headPop: false,
        isCreateAlbum: false
      },
      tourList: [],
      reportTitle: 'Report post',
      reportReasons: [{
        id: 1,
        reason: 'Sexual content'
      }, {
        id: 2,
        reason: 'Violent or repulsive content'
      }, {
        id: 3,
        reason: 'Hateful or abusive content'
      }, {
        id: 4,
        reason: 'Harmful dangerous acts'
      }, {
        id: 5,
        reason: 'Child abuse'
      }, {
        id: 6,
        reason: 'Infringes my rights'
      }, {
        id: 7,
        reason: 'Promotes terrorism'
      }, {
        id: 8,
        reason: 'Spam or misleading'
      }]
    }
  },
  mounted () {
    if (this.sticky) {
      this.$refs.header.parentNode.style.paddingTop = '1rem'
      this.$refs.header.parentNode.style.boxSizing = 'border-box'
    }
  },
  computed: {
    postLife: {
      get () {
        return this.getPostLife(this.detailData.postStatisticsDto.countDown)// 获取帖子的生命周期
      },
      set () {}
    },
    isSelf () {
      return localStorage.getItem('id') * 1 === this.detailData.creatorId
    }
  },
  methods: {
    reportFn () {
      this.dialog.headPop = !this.dialog.headPop
    },
    closeReport () {
      this.dialog.headPop = false
    },
    deleteOrReportFn () {
      if (this.isSelf) { // 如果是自己可以删除
        // 弹出是否删除对话框
        Dialog.confirm({
          message: 'Are you sure to delete post?',
          confirmButtonText: 'Yes',
          cancelButtonText: 'Cancel',
          closeOnClickOverlay: true
        }).then(() => { // 确认
          const query = {
            postId: this.detailData.id
          }
          deletePost(query).then(res => {
            if (res.data.code === '200') {
              Toast({
                message: 'Delete success'
              })
              this.$router.go(-1)
            } else {
              Toast({
                message: res.data.message
              })
            }
          })
        }).catch(() => { // 取消
          console.log('取消')
        })
      } else { // 如果是不是自己，可以举报
        this.dialog.isReport = true
      }
      this.dialog.headPop = false
    },
    saveOrCancelAlbum () {
      if (this.detailData.saveFlag) {
        // cancel
        this.cancelSaveTour()
      } else {
        // save
        this.getMyAlbum()
      }
    },
    getMyAlbum () {
      // 获取用户的tour列表,pemission(0表示公开,1表示私有)
      this.dialog.isSaveTour = true
      const data = {
        page: 1,
        pageSize: 10
      }
      getMyTours(data).then(res => {
        if (res.data.code === '200') {
          this.tourList = res.data.result.resultData
        } else {
          Toast({
            message: res.data.message
          })
        }
      }).catch((err) => {
        this.toLogin(err)
      })
    },
    cancelSaveTour () {
      const data = {
        operationType: 0, // 1:新增，0，删除
        postIdList: [this.detailData.id],
        tourId: 0
      }
      saveOrDeleteTour(data).then(res => {
        if (res.data.code === '200') {
          // 成功之后去除已经删除的post
          this.detailData.saveFlag = false
        } else {
          Toast({
            message: res.data.message
          })
        }
        Toast({
          message: res.data.message
        })
      }).catch(err => {
        this.toLogin(err)
      })
    },
    saveTourFn () {
      this.dialog.isSaveTour = false
      this.detailData.saveFlag = true
    },
    submitFn (name) {
      const data = {
        tourName: name.albumName,
        permission: 0
      }
      addTour(data).then(res => {
        if (res.data.code === '200') {
          this.dialog.isCreateAlbum = false
          this.dialog.isSaveTour = true
          this.reloadTourListFn()
        } else {
          Toast({
            message: res.data.message
          })
        }
      }).catch(err => {
        this.toLogin(err)
      })
    },
    reloadTourListFn () {
      this.getMyAlbum()
    },
    createFn () {
      this.dialog.isSaveTour = false
      this.dialog.isCreateAlbum = true
    },
    getSwiperIndex (val) {
      this.swiperIndex = val
    },
    openCommentPage (id) {
      this.$emit('open', id, 'comment')
    },
    openLikesPage (id) {
      this.$emit('open', id, 'likes')
    },
    openTagDetailPage (id) {
      this.$emit('open', id, 'tag')
    },
    goXploPage () {
      this.$store.commit('updateRecordLocation', this.detailData)
      this.$router.push('/xplo')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.postDetail{
    min-height: 100%;
    background-color:rgb(45,46,51);
}
/* header */
.postHeader{
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height:1rem;
    background-color:rgb(45,46,51);
}
.userContainer{
    width: 100%;
    display: flex;
    align-items: center;
}
.userInfo{
    display: flex;
    align-items: center;
    margin-left: .2rem;
}
.userInfo img{
    width: 0.5rem;
    height:0.5rem;
    vertical-align: middle;
    border-radius:50%;
}
.userInfo .username{
    font-family:'SFUIDisplay-Medium';
    font-size: 0.28rem;
    color: rgb(224,224,224);
    margin-left: .2rem;
}
.followBtn{
    margin-left: .4rem;
    padding-left: .16rem;
    padding-right: .16rem;
    height: 0.3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'SFUIDisplay-Regular';
    font-size: 0.24rem;
    color: rgb(54,101,167);
    border:0.02rem solid rgb(54,101,167);
    border-radius: 0.15rem;
}
.btns{
    display: flex;
    align-items: center;
    color: #fff;
}
.postHeader .report{
    margin-right: .1rem;
    font-size: 0.52rem;
}
.postHeader .saveTour{
    margin-right: .1rem;
    font-size: 0.45rem;
}
/* oprations */
.postOperations{
    width:45%;
    transform: translateY(20%);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: nowrap;
    color:rgb(153,153,153);
}
.postOperations .btn{
    display: flex;
}
.postOperations .icon{
    font-size:0.4rem;
}
.postOperations .icon.isActive{
    color: rgb(54,101,167);
    animation:likeAnim 300ms;
}
.postOperations .number{
    font-size: 0.2rem;
}
.postOperations .like{
    align-items: center;
}
.postOperations .like .number{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 0.66rem;
    height: 0.36rem;
    border-radius: 0.2rem;
    background-color: rgb(54,101,167);
    color: rgb(174,187,226);
}
.postOperations .like .number:hover{
    background-color: rgb(40,80,140);
}
/* location */
.postLocation{
    position: absolute;
    top: .2rem;
    right: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    width:50%;
    height:0.66rem;
    margin-bottom:0.2rem;
    border-radius:0.33rem 0 0 0.33rem;
    font-size:0.2rem;
    color: #fff;
    background: linear-gradient(to right,rgb(52,147,212),rgb(54,100,167));
}
.locationText{
  width: 80%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
}
.locationItem{
    transform: scale(.9);
    align-self: center;
    line-height: .2rem;
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    text-indent: .2rem;
}
.postLocation::after{
    content: "";
    min-width: 0.6rem;
    width:0.4rem;
    height:0.4rem;
    background-position: 0 0;
    background-repeat: no-repeat;
    background-image: url(../assets/img/icSpacecraft.png);
    background-size: contain;
}
/* popup */
.postPop{
    position: fixed;
    top:0;
    left:0;
    right:0;
    bottom:0;
    z-index: 10;
}
.deletePop{
    position: absolute;
    z-index: 999;
    top:.9rem;
    right: 0.1rem;
    background-color: #fff;
    border-radius: 0.15rem;
    padding: 0.15rem 0.5rem;
    color: rgb(66,93,144);
    font-size: 0.28rem;
}
.deletePop::before{
    content: "";
    top: 0;
    width: 0;
    height: 0;
    position: absolute;
    right: .2rem;
    top:-.35rem;
    border-bottom: 0.2rem solid #fff;
    border-top: 0.2rem solid transparent;
    border-left: 0.1rem solid transparent;
    border-right: 0.1rem solid transparent;
}
/* content */
.postContent{
    position: relative;
    padding:0.2rem 0.2rem 0;
    background: rgb(45,46,51);
}
/* from / link*/
.links{
    margin-bottom: 0.1rem;
    color: rgb(153,153,153);
}
.links .visit{
    font-size:0.24rem;
    color:#fff;
}
.links .label,.links a{
    font-size:0.24rem;
    color: rgb(153,153,153);
}
.links a:last-of-type{
    margin-left:0.1rem;
}
/* 创建时间和生命周期 */
.postLife{
    margin:0.2rem 0 0 -0.06rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: rgb(153,153,153);
}
.postLife .life.iconfont{
    display: flex;
    align-items:center;
    font-size:0.28rem;
}
.postLife .life::before{
    content: "\e65a";
    display: block;
    font-size: 0.3rem;
    margin-right: 0.05rem;
}
.postLife .life .lifeItem{
    display: flex;
    align-items:center;
}
.postLife .life span{
    font-size:0.22rem;
    transform: scale(.8);
    transform-origin: left bottom;
}
/* tags */
.postTags{
    font-family: 'SFUIDisplay-Semibold';
    margin-top:0.2rem;
    color:rgb(153,153,153)
}
.postTags span{
    display: inline-block;
    font-size:0.24rem;
    margin-right:0.4rem;
}
/* desc */
.postText{
    position: relative;
    top:-0.1rem;
}
.postText .content{
    word-wrap:break-word;
    font-size:0.26rem;
    line-height: 0.36rem;
    margin-bottom:-0.1rem;
    margin-top: 0.14rem;
    color:#fff;
}
.postText .textTime{
    font-size:0.24rem;
    margin-right:0.15rem;
    color:rgb(153,153,153);
}

/* 分割 */
.postContainer::after{
    content: "";
    display: block;
    width: 100%;
    height: .2rem;
    background-color: rgba(255,255,255,0.04);
}
/* fixed */
.fixed{
  position: fixed;
  top: 0;
  margin: 0 auto;
  width: 100%;
  z-index: 999;
}
</style>
