<template>
    <div>
        <nav-bar>
          <span slot="left" class="iconfont leftIcon" @click="goBack">&#xe65b;</span>
          <span slot="title" class="title">Mobile</span>
        </nav-bar>
        <div class="iconContainer">
          <div class="icon">
            <img v-lazy="type?IconEmail:IconMobile" alt="icon">
          </div>
        </div>
        <input-field placeholder="Verification code" v-model="code"/>

        <big-button name="Done" @click.native="btnClickedFn"/>
        <!-- loading -->
        <loading v-show="isLoading"/>
    </div>
</template>

<script>
import {Toast} from 'vant'
import NavBar from '@/components/NavBar'
import InputField from '@/components/InputField'
import BigButton from '@/components/BigButton'
import Loading from '@/components/Loading'
import IconMobile from '@/assets/img/ic_setting_phone@2x.png'
import IconEmail from '@/assets/img/ic_setting_mail@2x.png'
import {connect} from '@/api/api'

export default {
  name: 'Connect2',
  components: {NavBar, InputField, BigButton, Loading},
  data () {
    return {
      IconMobile: IconMobile,
      IconEmail: IconEmail,
      code: '',
      isLoading: false
    }
  },
  computed: {
    type () {
      return this.$route.query.type * 1
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    btnClickedFn () {
      if (!this.code) {
        Toast('Please enter your verification code.')
        return false
      }
      this.isLoading = true
      // 调用绑定接口
      const query = {
        linkType: 'PHONE',
        linkAccount: this.$route.query.phone,
        code: this.code
      }
      connect(query).then(res => {
        this.isLoading = false
        Toast({
          message: res.data.message
        })
        if (res.data.code === '200') {
          this.$router.go(-2)
        }
      })
    }
  }
}
</script>

<style scoped>
.iconContainer{
  display: flex;
  justify-content: center;
  margin:0.5rem 0 0.4rem;
}
.icon{
  width: 1.3rem;
  height: 1.8rem;
}
.icon img{
  object-fit: contain;
}
.vericode{
  margin: 0 .6rem;
  font-size: 0.32rem;
}
.tip{
  margin: 1rem 0;
  font-family: SFUIDisplay-Medium;
  text-align: center;
  color: rgb(66,93,144);
  font-size: 0.32rem;
}
.settingBtn{
  position: relative;
  margin-top: 1.8rem;
}
.leftIcon{
  font-size: 0.5rem;
}
</style>
