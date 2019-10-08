<template>
    <div class="profileEdit">
        <nav-bar :border="false">
            <span slot="left" class="leftIcon" @click="onClickLeft">Cancel</span>
            <span slot="title" class="title">Edit Profile</span>
            <span slot="right" class="rightIcon" @click="onClickRight">Done</span>
        </nav-bar>
        <div class="profileContainer">
            <div class="profilePhoto">
              <div class="profileIcon">
                <img :src="icon" alt="icon">
                <input type="file" @change="onRead" class="profileUpload">
              </div>
            </div>
            <p class="uploadTip">Change profile photo</p>
            <ul class="profileForm">
                <li>
                    <div class="profileName">
                    <field v-model="nickname" placeholder="Name" @blur="checkNick"/>
                    </div>
                </li>
                <li>
                    <div class="profileIntroduction">
                        <field v-model="introduction" placeholder="About me" @blur="checkIntro"/>
                    </div>
                </li>
                <li>
                    <div class="profileCountry" @click="goEditCountry">
                        <span>{{country}}</span>
                    </div>
                </li>
                <li @click="goEditTags">
                    <div class="profileTags">
                        <span>My Tags</span>
                    </div>
                </li>
                <li @click="goEditGender">
                    <div class="profileGender">
                        <span>{{gender|formateGender}}</span>
                    </div>
                </li>
            </ul>
        </div>
        <!-- Loading -->
        <loading v-show="isLoading"/>
    </div>
</template>

<script>
import {Cell, Field, Uploader, Toast} from 'vant'
import toLogin from '@/mixins/toLoginMix'
import NavBar from '@/components/NavBar'
import Loading from '@/components/Loading'
import {updateProfile} from '@/api/api'

export default {
  name: 'ProfileEdit',
  components: {NavBar, Cell, Field, Uploader, Loading},
  mixins: [toLogin],
  data () {
    return {
      isLoading: false
    }
  },
  created () {
    this.id = localStorage.getItem('id')
  },
  filters: {
    formateGender (val) {
      const genders = ['Male', 'Female', 'Not specified']
      return genders[val]
    }
  },
  computed: {
    nickname: {
      get () {
        return this.$store.state.userInfo.nickname
      },
      set (val) {
        this.$store.state.userInfo.nickname = val
      }
    },
    icon () {
      console.log(this.$store.state.userInfo.icon)
      return this.$store.state.userInfo.icon
    },
    country: {
      get () {
        return this.$store.state.userInfo.country
      },
      set (val) {
        this.$store.state.userInfo.country = val
      }
    },
    introduction: {
      get () {
        return this.$store.state.userInfo.introduction
      },
      set (val) {
        this.$store.state.userInfo.introduction = val
      }
    },
    gender: {
      get () {
        return this.$store.state.userInfo.gender
      },
      set (val) {
        this.$store.state.userInfo.gender = val
      }
    }
  },
  methods: {
    onClickLeft () {
      // 取消后跳转到需要的页面
      this.$router.replace({
        name: 'ProfileDetail',
        params: {
          userId: this.id
        },
        query: this.$route.query
      })
    },
    onClickRight () {
      this.isLoading = true
      // 更新用户信息接口
      const data = {
        nickname: this.nickname,
        icon: this.icon,
        country: this.country,
        introduction: this.introduction,
        gender: this.gender
      }
      updateProfile(data).then(res => {
        if (res.data.code === '200') { // 操作成功跳转到前一个路由
          this.$router.replace({name: 'ProfileDetail',
            params: {
              userId: this.id
            },
            query: this.$route.query
          })
        } else {
          Toast({
            message: res.data.message
          })
        }
        this.isLoading = false
      }).catch(err => {
        this.toLogin(err)
      })
    },
    goEditCountry () {
      this.$router.push({
        name: 'Region'
      })
    },
    goEditTags () {
      this.$router.push({
        name: 'Tags'
      })
    },
    goEditGender () {
      this.$router.push({
        name: 'Gender'
      })
    },
    onRead (e) {
      const file = e.target.files[0]
      const url = window.URL.createObjectURL(file)
      this.$store.state.profileClipBase64Icon = url
      this.$router.push({
        name: 'IconCropper',
        params: {
          userId: this.$route.params.userId
        }
      })
    },
    checkNick () {
      this.nickname = this.nickname.replace(/^\s*|\s*$/g, '')
      if (!this.nickname) {
        return false
      }
      // check nickname
      if (this.nickname.length > 0 && this.nickname.length < 3) {
        this.nickname += '...'
        Toast({
          message: `Nickname length can't be less than 3`
        })
      } else if (this.nickname.length > 20) {
        this.nickname = this.nickname.slice(0, 20)
        Toast({
          message: `Nickname length can't be more than 20`
        })
      }
    },
    checkIntro () {
      this.introduction = this.introduction.replace(/^\s*|\s*$/g, '')
      if (!this.introduction) {
        return false
      }
      // check introduction
      if (this.introduction.length > 150) {
        this.introduction = this.introduction.slice(0, 150)
        Toast({
          message: `Introduction length can't be more than 150`
        })
      }
    }
  }
}
</script>

<style scoped>
.profileEdit{
  background-color:#f7f7f7;
}
.profileContainer{
    margin-top:0.2rem;
    padding: 0 0.4rem;
    background-color: #fff;
}
.profilePhoto{
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    padding-top: 0.4rem;
}
.profileIcon{
    position:relative;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    overflow: hidden;
    border:0.02rem solid rgb(204,204,204);
}
.profileUpload{
    position:absolute;
    top:0;
    left:0;
    width: 100%;
    height: 100%;
    opacity:0;
}
.uploadTip{
  color: rgb(153,153,153);
  text-align:center;
  font-size:0.28rem
}
.profileName,.profileIntroduction,.profileCountry,.profileTags,.profileGender{
    display: flex;
    justify-content: start;
    align-items: center;
}
.profileName::before,.profileIntroduction::before,
.profileCountry::before,.profileTags::before,.profileGender::before{
    content: "";
    width: 0.4rem;
    height: 0.4rem;
    margin-right: 0.2rem;
    background-position:0 0;
    background-repeat:no-repeat;
    background-size: cover;
}
.profileName::before{
    background-image: url(../../../assets/img/icName@2x.png);
}
.profileIntroduction::before{
    background-image: url(../../../assets/img/icAbout@2x.png);
}
.profileCountry::before{
    background-image: url(../../../assets/img/icLocation@2x.png);
}
.profileTags::before{
    background-image: url(../../../assets/img/icTags@2x.png);
}
.profileGender::before{
    background-image: url(../../../assets/img/icGender@2x.png);
}
.profileForm{
    font-size:0.34rem;
}
.profileForm li{
    position: relative;
    padding:0.4rem 0;
    border-bottom: 0.02rem solid rgb(239,239,244);
}
.profileForm li:last-of-type{
    border-bottom:none;
}
.profileForm li span{
    padding:0.1rem 0.3rem;
    color: rgb(51,51,51);
}
.profileForm li:nth-child(2)~::after{
    content: "";
    position: absolute;
    top:50%;
    transform: translateY(-50%);
    right: 1rem;
    width: 0.2rem;
    height: 0.3rem;
    background-position:0 0;
    background-repeat:no-repeat;
    background-image: url(../../../assets/img/icRightSel@2x.png);
    background-size: cover;
}
.leftIcon{
  color: rgb(102,102,102);
}
.rightIcon{
  color: rgb(66,93,144);
}
</style>
