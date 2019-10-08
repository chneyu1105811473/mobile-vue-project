<template>
  <div class="settings">
    <ul>
      <li
      v-for="(setting,index) in settingList"
      :key="index"
      class="settingItem"
      @click="handleSetting(setting)">
        {{setting}}
      </li>
    </ul>
  </div>
</template>

<script>
import {Dialog, Toast} from 'vant'
import {profileBlock} from '@/api/api'

export default {
  name: 'SettingPop',
  props: ['settingList', 'userInfo', 'defaultFlag'],
  computed: {
    iosUrl () {
      return this.$store.state.iosDownloadUrl.url
    }
  },
  methods: {
    logOutDialog () {
      Dialog.confirm({
        message: 'Are you sure to log out?',
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
        closeOnClickOverlay: true,
        className: 'morePadding'
      }).then(() => { // 确认
        localStorage.removeItem('Authorization')
        this.$router.push('/login')
      }).catch(() => { // 取消
        console.log('取消')
      })
    },
    blockOrUnblockSomeone () {
      Dialog.confirm({
        title: `${!this.userInfo.blockFlag ? 'Block' : 'Unblock'} ${this.userInfo.username} ?`,
        message: `They ${this.userInfo.blockFlag ? 'will now' : "won't"} be able to find your profile, post or tour on XPLO. XPLO won't let them know you blocked them.`,
        confirmButtonText: `${!this.userInfo.blockFlag ? 'Block' : 'Unblock'}`,
        cancelButtonText: `Cancel`,
        closeOnClickOverlay: true,
        messageAlign: 'left',
        className: 'lessPadding'
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
        })
      }).catch(() => { // 取消
        console.log('取消')
      })
    },
    handleSetting (item) {
      if (item.includes('Settings')) {
        // 进入setting page
        this.$router.push({
          name: 'Settings',
          params: {
            userId: this.userInfo.id
          }
        })
      } else if (item.includes('Term')) {
        // 进入协议页面
        this.$router.push({
          path: '/privacy'
        })
      } else if (item.includes('Feedback')) {
        // 反馈页面
        this.$router.push({
          path: '/feedback'
        })
      } else if (item.includes('Log')) {
        // 退出账号
        this.logOutDialog()
      } else if (item.includes('Download')) {
        // 下载app
        window.location.href = this.iosUrl
      } else if (item.includes('Report')) {
        // 举报用户
        this.$emit('handleReport', true)
      } else if (item.includes('Block') || item.includes('Unblock')) {
        // 拉黑用户
        this.blockOrUnblockSomeone()
      } else if (item.includes('Add post')) {
        // add post 进入choosePost页面
        this.$router.push({
          name: 'ChoosePosts',
          params: {
            userId: this.userInfo.id,
            tourId: this.$route.params.tourId
          }
        })
      } else if (item.includes('Edit')) {
        // edit tour
        this.$router.push({
          name: 'TourEdit',
          params: {
            tourId: this.$route.params.tourId
          },
          query: {
            defaultFlag: this.defaultFlag
          }
        })
      } else if (item.includes('Change order')) {
        // change order
        this.$router.push({
          name: 'TourOrder',
          params: {
            tourId: this.$route.params.tourId
          }
        })
      } else if (item.includes('Delete')) {
        // delete post
        this.$emit('handleDelete', true)
      } else if (item.includes('Share')) {
        // share Tour 调手机自带的share
        this.$emit('handleShare', true)
      }
    }
  }
}
</script>

<style scoped>
/* settings */
.settings{
  position: absolute;
  top:.9rem;
  right: 0.1rem;
  min-width: 2.6rem;
  background-color: #fff;
  padding: 0 0.2rem;
  border-radius:0.2rem;
  box-shadow: 0.02rem 0.02rem 0.2rem 0 #ccc;
}
.settings::before{
  content: "";
  top: 0;
  width: 0;
  height: 0;
  position: absolute;
  right: .15rem;
  top:-.35rem;
  border-bottom: 0.2rem solid #fff;
  border-top: 0.2rem solid transparent;
  border-left: 0.12rem solid transparent;
  border-right: 0.12rem solid transparent;
}
.settingItem{
  color: rgb(102,102,102);
  font-size:0.28rem;
  padding: 0.3rem 0;
  text-align: center;
  border-bottom: 0.02rem solid rgb(239,239,244);
}
</style>
