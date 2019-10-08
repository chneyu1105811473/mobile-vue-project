<template>
    <div class="tourEdit">
        <nav-bar>
          <span slot="left" @click="onCancel">Cancel</span>
          <span slot="title">Edit album</span>
          <span slot="right" @click="onRightClick">Done</span>
        </nav-bar>
        <!-- edit list -->
        <ul class="editList">
            <li class="tourItem">
                <label for="cover">Cover</label>
                <div class="imageContain">
                    <div class="coverImage" v-lazy:background-image="tourInfo.tourDto.coverImage||$defaultCover" />
                    <input type="file" accept="image/jpeg,image/png" @change="fileChange">
                    <icon name="arrow" color="rgb(153,153,153)"/>
                </div>
            </li>
            <!-- <li class="tourItem">
                <p class="title">Privacy setting</p>
                <div class="radioBox">
                    <div class="tourType">
                        <input type="radio" value="1" name="tourType" v-model="tourType" id="Private" :disabled="isDefault">
                        <i></i>
                        <label for="Private">Private</label>
                    </div>
                    <div class="tourType">
                        <input type="radio" value="0" name="tourType" v-model="tourType" id="Public" :disabled="isDefault">
                        <i></i>
                        <label for="Public">Public</label>
                    </div>
                </div>
            </li> -->
            <li class="tourItem">
                <p class="title">Name</p>
                <div class="tourName">
                    <input type="text" v-model="tourInfo.tourDto.name" :disabled="isDefault"/>
                </div>
            </li>
            <li class="tourItem">
                <p class="title">Caption</p>
                <div class="caption">
                    <textarea name="caption" v-model="tourInfo.tourDto.description"></textarea>
                </div>
            </li>
        </ul>
        <!-- loading -->
        <loading v-show="isLoading"/>
    </div>
</template>

<script>
import {Toast, Icon} from 'vant'
import {tourDetail, updateTour, uploadFiles} from '@/api/api'
import toLogin from '@/mixins/toLoginMix'
import NavBar from '@/components/NavBar'
import Loading from '@/components/Loading'

export default {
  name: 'TourEdit',
  components: {NavBar, Icon, Loading},
  mixins: [toLogin],
  data () {
    return {
      tourInfo: {
        tourDto: {},
        memberDto: {}
      },
      isLoading: false
    }
  },
  computed: {
    tourType: {
      get () {
        return this.tourInfo.tourDto.permission
      },
      set (val) {
        this.tourInfo.tourDto.permission = val
      }
    },
    isDefault () {
      return this.$route.query.defaultFlag
    }
  },
  created () {
    const query = {
      tourId: this.$route.params.tourId
    }
    tourDetail(query).then(res => {
      if (res.data.code === '200') {
        this.tourInfo = res.data.result
      } else {
        Toast({
          message: res.data.message
        })
      }
    }).catch((err) => {
      this.toLogin(err)
    })
  },
  methods: {
    onCancel () {
      this.$router.go(-1)
    },
    onRightClick () {
      this.isLoading = true
      if (this.files) { // 如果改变cover,需要调上传文件接口
        this.changedCover()
      } else { // 若不改变cover,不用调上传文件接口
        this.coverImage = this.tourInfo.tourDto.coverImage
        this.uploadTour()
      }
    },
    uploadTour () {
      const tourQuery = {
        tourId: this.$route.params.tourId,
        tourName: this.tourInfo.tourDto.name,
        coverImage: this.coverImage,
        description: this.tourInfo.tourDto.description,
        permission: this.tourType
      }
      updateTour(tourQuery).then(res => {
        if (res.data.code === '200') {
          this.isActive = true
          this.$router.push({
            name: 'TourDetail',
            params: this.$route.params
          })
        } else {
          Toast({
            message: res.data.message
          })
        }
        this.isLoading = false
      }).catch(err => {
        this.isLoading = false
        this.toLogin(err)
      })
    },
    changedCover () {
      const formData = new FormData()
      formData.append('file', this.files)
      const fileQuery = {
        index: 1,
        filetime: 0
      }
      uploadFiles(formData, fileQuery).then(res => {
        if (res.data.code === '200') {
          this.coverImage = res.data.result.imageThumbUrlMini
          // 调更新tour接口
          this.uploadTour()
        } else {
          Toast({
            message: res.data.message
          })
        }
      }).catch(err => {
        this.toLogin(err)
      })
    },
    fileChange (e) {
      this.files = e.target.files[0]
      if ((this.files.size) / 1024 > 10000) {
        Toast({
          message: 'Your image is over 10M'
        })
        return false
      } else {
        // 进行文件上传
        this.tourInfo.tourDto.coverImage = window.URL.createObjectURL(this.files)
      }
    }
  }
}
</script>

<style scoped>
.editList{
    padding: 0 0.4rem;
}
.tourItem{
    font-size: 0.28rem;
    padding: 0.2rem 0;
    border-bottom: 0.02rem solid rgb(239,239,244);
    margin-top: 1rem;
    overflow: hidden;
}
.tourItem .title{
    color: rgb(153,153,153);
    font-size: 0.24rem;
    margin-bottom: 0.4rem;
}
.tourItem:nth-child(1){
    margin-top: 0;
    padding:0.5rem 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.tourItem:last-child{
  padding-bottom:0;
}
.imageContain{
    position: relative;
    display: flex;
    align-items: center;
}
.coverImage{
    margin-right: 0.1rem;
    width: 1.2rem;
    height: 1.2rem;
    border-radius: 0.1rem;
    background-size: cover;
    background-repeat: no-repeat;
}
.imageContain input{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
}
.tourName input{
   width: 100%;
}
.radioBox{
    display: flex;
}
.tourType{
    display: flex;
    width: 50%;
    justify-content: start;
    align-items: center;
    font-family: SFUIDisplay-Regular;
}
[type=radio]{
    position: absolute;
    padding-bottom: 0;
    opacity: 0;
}
[type=radio] + i{
    width:0.44rem;
    height: 0.44rem;
    margin-right: 0.2rem;
    background-image:url(../../assets/img/icNorCircle@2x.png);
    background-repeat: no-repeat;
    background-position: 0 0;
    background-size: cover;
}
[type=radio]:checked + i{
  background-image:url(../../assets/img/icSelCircle@2x.png);
}
[type=radio]:checked ~ label{
    color:rgb(66,93,144);
}
input:disabled{
  color: #ccc;
  background-color: transparent!important;
}
input:disabled ~ i,input:disabled ~ label{
  opacity: .4;
}
</style>
