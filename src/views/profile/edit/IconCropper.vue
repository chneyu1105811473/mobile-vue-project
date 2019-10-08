<template>
    <div class="iconCropper" :style="{'height':winHeight+'px'}">
        <div class="iconfont goBack" @click="onClickLeft">&#xe65b;</div>
        <div class="DoneBtn" @click="onClickRight">Done</div>
        <croppper
        @sendBlob="getBlob"
        :picture="$store.state.profileClipBase64Icon"
        />
        <!-- loading -->
        <loading v-show="isLoading"/>
    </div>
</template>

<script>
import Croppper from './components/Cropper'
import Loading from '@/components/Loading'
import {uploadFiles} from '@/api/api'
import toLogin from '@/mixins/toLoginMix'
import {mapGetters} from 'vuex'
import {Toast} from 'vant'

export default {
  name: 'IconCropper',
  mixins: [toLogin],
  components: {Croppper, Loading},
  data () {
    return {
      isLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'winHeight'
    ])
  },
  methods: {
    onClickLeft () {
      this.$store.state.profileClipBase64Icon = ''
      this.$router.replace({
        name: 'ProfileEdit',
        params: {
          userId: this.$route.params.userId
        }
      })
    },
    onClickRight () {
      this.isLoading = true
      const query = {
        index: 1,
        filetime: 0
      }
      uploadFiles(this.formData, query).then(res => {
        if (res.data.code === '200') {
          this.$store.state.userInfo.icon = res.data.result.imageThumbUrlMini
          this.onClickLeft()
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
    getBlob (val) {
      this.formData = new FormData()
      this.formData.append('file', val, 'icon.jpg')
    }
  }
}
</script>

<style scoped>
.iconCropper{
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,.8);
}
.goBack{
  position: absolute;
  top: .2rem;
  left: .3rem;
  font-size: .5rem;
  color: #fff;
  z-index:999;
}
.DoneBtn{
    padding: 0.2rem;
    position: absolute;
    right: 0.2rem;
    top:0.05rem;
    font-size: 0.32rem;
    color:#fff;
    z-index: 999;
}
</style>
