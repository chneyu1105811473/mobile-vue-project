<template>
  <div class="profileDetail" :style="{'padding-top':tabOffset + 'px'}">
      <!-- 是否加载完成  加载完成前显示骨架屏，加载完成之后显示组件-->
      <div v-show="isLoaded">
        <!-- 固定到顶部 -->
        <div class="fixed" ref="fixedBox">
          <div class="header" ref="myHead">
            <div class="title">{{userInfo.username}}</div>
            <div class="headBtns">
              <template v-if="userInfo.isSelf">
                <div :class="{'iconfont':true,'IMBtn':true,'dot':unRead}" @click="goSessionListPage">
                  &#xe606;
                </div>
                <div class="iconfont tourBtn" @click="goTourListPage">&#xe661;</div>
              </template>
              <span class="iconfont rightText" @click="onClickRight">&#xe60f;</span>
            </div>
          </div>
          <div class="profileContainer" v-show="!isMapMax">
            <div class="userInfo">
              <div class="profilePhoto" @click="showPhoto">
                  <img v-lazy="userInfo.icon" alt="user icon">
              </div>
              <div class="editProfile">
                <div class="postInfo">
                  <div class="postsNum" @click="goTimelines">
                    <p class="num">
                      {{(userInfo.memberStatisticsDto && userInfo.memberStatisticsDto.posts)|formateNum}}
                    </p>
                    <span class="means">Posts</span>
                  </div>
                  <div class="followingNum" @click="goPeopleList('following')">
                    <p class="num">
                      {{(userInfo.memberStatisticsDto && userInfo.memberStatisticsDto.followings)|formateNum}}
                    </p>
                    <span class="means">Following </span>
                  </div>
                  <div class="followersNum" @click="goPeopleList('followers')">
                    <p class="num">
                      {{(userInfo.memberStatisticsDto && userInfo.memberStatisticsDto.followers)|formateNum}}
                    </p>
                    <span class="means">Followers</span>
                  </div>
                </div>
                <!-- unblock -->
                <template v-if="!userInfo.blockFlag">
                  <!-- isSelf -->
                  <div class="editBtn" v-if="userInfo.isSelf" @click="goEditProfile">
                    Edit Profile
                  </div>
                  <!-- others -->
                  <template v-else>
                    <div
                    :class="{'followBtn':true,'isFollowing':userInfo.isFollowing}"
                    @click="followPeopleFn(userInfo)"
                    >
                      {{userInfo.isFollowing?'Following':'Follow'}}
                    </div>
                    <div
                    class="messageBtn"
                    @click="goChat"
                    >Message</div>
                  </template>
                </template>
                <!-- block -->
                <template v-else>
                  <div
                  class="editBtn"
                  @click="blockOrUnblockSomeone"
                  >Unblock</div>
                </template>
              </div>
            </div>
            <div class="description" v-if="!userInfo.isxplo">
              <div class="nameAndCountry">
                <div class="username">{{userInfo.nickname}}</div>
                <div class="countryFlag" :class="countryFlag">
                  <!-- <img v-lazy="countryFlag"> -->
                </div>
              </div>
              <div class="des">{{userInfo.introduction}}</div>
            </div>
          </div>
          <!-- tab -->
          <div
          class="postType"
          ref="touchTarget"
          @touchstart="touchstartFn"
          @touchmove="touchmoveFn"
          @touchend="touchendFn">
            <div class="iconfont title" :class="{'active':active === 0}" @click="active = 0">
              &#xe65a;Gallary
            </div>
            <div v-if="!userInfo.isxplo" class="iconfont title" :class="{'active':active === 1}" @click="active = 1">
              &#xe65f;Footprints
            </div>
          </div>
        </div>
        <!-- 底部展示 -->
        <div class="profileBottom" v-if="userInfo.id">
          <!-- active === 0 -->
          <div class="tabContainer" v-show="active === 0">
            <ProfileHot v-if="!userInfo.blockFlag"/>
            <EmptyPage v-if="userInfo.blockFlag"/>
          </div>
          <!-- active === 1 -->
          <div class="tabContainer" :style="{'height':height+'px'}" v-if="active === 1 && !userInfo.isxplo">
            <footprint
            v-if="!userInfo.blockFlag && userInfo.memberStatisticsDto.posts"
            @maxMap="getMaxMap"
            :isMapMax="isMapMax"
            :footHeight="footerHeight"
            :visitedCountryList="visitedCountryList"
             />
            <add-post v-if="!userInfo.blockFlag && !userInfo.memberStatisticsDto.posts" />
            <empty-page v-if="userInfo.blockFlag"/>
          </div>
        </div>
      </div>
      <div v-show="!isLoaded">
        <!-- 骨架屏 -->
        <profile-skeleton></profile-skeleton>
      </div>
      <!-- 底部导航 -->
      <footer-tab :currentTab="currentTab" ref="myFoot"/>
      <!-- ReportPop -->
      <Popup v-model="isReport">
        <report-pop
        type="user"
        :reasons="reasons"
        :title="reportTitle"
        @close="isReport = false"/>
      </Popup>
      <!-- settingPop -->
      <div class="settingPop" v-show="setting" @click.prevent="setting = false">
        <setting-pop
        :settingList="userInfo.isSelf?isSelfSettings:notSelfSettings"
        :userInfo="userInfo"
        @handleReport="handleReportFn"
        />
      </div>
  </div>
</template>

<script>
import {Dialog, Popup, Toast, ImagePreview} from 'vant'
import Footprint from './components/Footprint'
import ProfileHot from './components/ProfileHot'
import AddPost from './components/AddPost'
import FooterTab from '@/components/FooterTab'
import EmptyPage from '@/components/EmptyPage'
import SettingPop from '@/components/popup/SettingPop'
import ReportPop from '@/components/popup/ReportPop'
import ProfileSkeleton from './components/ProfileSkeleton'
import getUserInfoFn from '@/mixins/userInfoMix'
import toLoginMix from '@/mixins/toLoginMix'
import changePeopleFollowType from '@/mixins/changePeopleFollowTypeMix'
import {profileBlock} from '@/api/api'
import { mapGetters } from 'vuex'

export default {
  name: 'ProfileDetail',
  inject: ['reload'],
  components: {
    Popup,
    Footprint,
    ProfileHot,
    FooterTab,
    EmptyPage,
    AddPost,
    SettingPop,
    ReportPop,
    ProfileSkeleton
  },
  mixins: [
    getUserInfoFn,
    changePeopleFollowType,
    toLoginMix
  ],
  data () {
    return {
      isMapMax: false,
      active: 0,
      tabOffset: 0,
      height: 0,
      setting: false,
      isSelfSettings: ['Settings', 'Terms and policies', 'Feedback', 'Log out', 'Download'],
      notSelfSettingsBlock: ['Report', 'Block'],
      notSelfSettingsUnblock: ['Report', 'Unblock'],
      isReport: false,
      footerHeight: 0,
      currentTab: 4,
      reasons: [{
        id: 1,
        reason: 'It’s spam'
      }, {
        id: 2,
        reason: 'It’s inappropriate'
      }],
      reportTitle: 'Report this profile',
      isLoaded: false
    }
  },
  watch: {
    '$route' (to) {
      if (to.name === 'ProfileDetail') {
        this.reload()
      }
    }
  },
  created () {
    this.$nextTick(() => {
      this.getUserInfoFn()
      this.footerHeight = this.$refs.myFoot.$el.offsetHeight
      this.tabOffset = this.$refs.fixedBox.offsetHeight
      this.height = window.innerHeight - this.$refs.fixedBox.offsetHeight
    })
  },
  updated () {
    this.$nextTick(() => {
      this.tabOffset = this.$refs.fixedBox.offsetHeight
      this.height = window.innerHeight - this.$refs.fixedBox.offsetHeight
    })
  },
  computed: {
    userInfo () {
      return this.$store.state.userInfo
    },
    marginTop () {
      return this.isMapMax ? '0.9rem' : '0'
    },
    notSelfSettings () {
      return this.userInfo.blockFlag ? this.notSelfSettingsUnblock : this.notSelfSettingsBlock
    },
    headerHeight () {
      return this.$refs.myHead.offsetHeight
    },
    unRead () {
      return this.$store.state.sessionsList.some(item => item.unread)
    },
    ...mapGetters([
      'countryFlag',
      'visitedCountryList'
    ])
  },
  methods: {
    onClickRight () { // settings
      this.setting = !this.setting
    },
    blockOrUnblockSomeone () {
      Dialog.confirm({
        title: `${!this.userInfo.blockFlag ? 'Block' : 'Unblock'} ${this.userInfo.username} ?`,
        message: `They ${this.userInfo.blockFlag ? 'will now' : "won't"} be able to find your profile, post or tour on XPLO. XPLO won't let them know you blocked them.`,
        confirmButtonText: `${!this.userInfo.blockFlag ? 'Block' : 'Unblock'}`,
        cancelButtonText: `Cancel`,
        closeOnClickOverlay: true,
        className: 'lessPadding',
        messageAlign: 'left'
      }).then(() => { // 确认
        const query = {
          userId: this.$route.params.userId,
          blockFlag: !this.userInfo.blockFlag// true=屏蔽该用户，false=取消屏蔽该用户
        }
        profileBlock(query).then(res => {
          if (res.data.code === '200') {
            this.userInfo.blockFlag = !this.userInfo.blockFlag
          } else {
            Toast({
              message: res.data.message
            })
          }
        }).catch(err => {
          this.toLogin(err)
        })
      }).catch(() => { // 取消
        console.log('取消')
      })
    },
    goEditProfile () {
      this.$router.push({
        name: 'ProfileEdit',
        params: {userId: this.userInfo.id},
        query: this.$route.query
      })
    },
    goChat () {
      // 去私聊页面
      this.$router.push({
        name: 'PrivateChat'
      })
    },
    getMaxMap (val) {
      this.isMapMax = val
      this.tabOffset = this.$refs.fixedBox.offsetHeight
      this.height = window.innerHeight - this.tabOffset
    },
    goTimelines () {
      this.$router.push({
        name: 'Timelines',
        params: {
          userId: this.userInfo.id
        },
        query: this.$route.query
      })
    },
    goPeopleList (val) {
      this.$route.query.type = val
      this.$router.push({
        name: 'PeopleList',
        params: {
          userId: this.userInfo.id
        },
        query: this.$route.query
      })
    },
    goTourListPage () {
      this.$router.push({
        name: 'Tour'
      })
    },
    goSessionListPage () {
      this.$router.push({
        name: 'SessionList'
      })
    },
    handleReportFn () {
      this.isReport = true
    },
    showPhoto () {
      ImagePreview({
        images: [this.userInfo.icon],
        showIndex: false
      })
    },
    touchstartFn (e) {
      this.y = e.changedTouches[0].pageY
    },
    touchmoveFn (e) {
      this.slideY = this.y - e.changedTouches[0].pageY
    },
    touchendFn (e) {
      this.isMapMax = this.slideY > 10
    }
  }
}
</script>

<style scoped>
.profileDetail{
  font-family: 'SFUIDisplay-Regular';
  box-sizing: border-box;
}
.header{
  font-family: 'SFUIDisplay-Medium';
  position: relative;
  height: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 0.01rem solid rgb(239,239,244);
}
.header .title{
  width: 100%;
  display: flex;
  justify-content: center;
  font-size: 0.4rem;
}
.header .headBtns{
  position: absolute;
  right: 0;
  display: flex;
  align-items: center;
}
.headBtns .iconfont{
  font-size: 0.5rem;
}
.headBtns .iconfont.rightText{
    font-size:0.6rem;
}
.fixed{
  position: fixed;
  width:100%;
  margin:0 auto;
  top: 0;
  z-index: 1;
  background-color: #fff;
}
.profileContainer{
    width: 100%;
    padding: 0.3rem 0.15rem 0.1rem;
    box-sizing: border-box;
    font-family: 'SFUIDisplay-Regular';
}
.userInfo{
    display: flex;
    justify-content: space-between;
}
.profilePhoto{
    min-width: 1.7rem;
    width: 1.7rem;
    height: 1.7rem;
    border-radius: 50%;
    border:0.02rem solid #ccc;
    overflow: hidden;
}
.editProfile{
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
}
.postInfo{
    width: 100%;
    display: flex;
    justify-content: space-around;
    text-align: center;
}
.postInfo .num{
    margin: 0;
    font-size: 0.36rem;
    font-family: 'SFUIDisplay-Medium';
    color:rgb(51,51,51);
}
.postInfo .means{
    font-size: 0.24rem;
    color:rgb(153,153,153);
}
.editBtn{

    margin-top: 0.2rem;
    width: 83%;
    height: 0.56rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.28rem;
    border-radius: 0.1rem;
    border:0.02rem solid rgb(51,51,51);
}
.followBtn,.messageBtn{
  margin:0 0.05rem;
  width:40%;
  height:0.56rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.28rem;
  border-radius: 0.1rem;
  border:0.02rem solid rgb(51,51,51);
}
.followBtn{
  color:#fff;
  border-color:rgb(26,140,253);
  background:rgb(26,140,253);
}
.followBtn.isFollowing{
    color: rgb(51,51,51);
    border:0.02rem solid rgb(51,51,51);
    background: #fff;
}
.username{
  font-family:'SFUIDisplay-Medium';
}
.description{
    margin-top: 0.1rem;
}
.description .nameAndCountry{
    display:flex;
    justify-content:flex-start;
    font-size: 0.32rem;
    color: rgb(51,51,51);
}
.description .nameAndCountry .countryFlag{
    margin-left:0.1rem;
    width:0.34rem;
    height:0.34rem;
    background-size: contain;
    background-repeat: no-repeat;
}
.description .des{
    font-size: 0.28rem;
    color: rgb(153,153,153);
}
/* tab title */
.postType{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.postType .title{
  position:relative;
  font-family: SFUIDisplay-Regular;
  text-align: center;
  font-weight: bold;
  width: 100%;
  padding: .2rem 0;
  font-size: 0.28rem;
  color: rgb(153,153,153);
}
.postType .title.active{
  color: rgb(51,51,51);
}
.postType .title::after{
  content:"";
  position:absolute;
  height:0.02rem;
  left:50%;
  right:50%;
  bottom:0;
  background-color:rgb(51,51,51);
}
.postType .title.active::after{
  right:0;
  left:0;
  transition-duration:0.3s;
  transition-timing-function:ease-in-out;
}
/* tabs */
.profileBottom{
  width: 100%;
}
.tabContainer{
  position:relative;
}
.tabTitle{
  display: flex;
  align-items: center;
  justify-content: center;
}
.tabTitle img{
    width: 0.22rem;
    height: 0.26rem;
    margin-right: 0.1rem;
    object-fit: contain;
}
/* 消息提示 */
.dot{
    position: relative;
}
.dot::after{
    position: absolute;
    top: 0;
    right: 0;
    width: .16rem;
    height: .16rem;
    background-color: #f44;
    border-radius: 100%;
    content: "";
}
/* settingpop */
.settingPop{
    position: absolute;
    top:0;
    left:0;
    right:0;
    bottom:0;
    z-index: 233;
}
</style>
