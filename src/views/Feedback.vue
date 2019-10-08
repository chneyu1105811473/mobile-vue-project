<template>
    <div class="feedback">
      <nav-bar>
          <span slot="left" class="iconfont leftIcon" @click="goBack">&#xe65b;</span>
          <span slot="title" class="title">Feedback</span>
      </nav-bar>
      <div class="imageContainer">
        <div v-for="(item,index) in list" class="fileItem" :key="index" >
          <div class="deleteCover" v-show="item.isRemove" @click="removeFile(index)" />
          <div class="image" @touchend="showOrHideRemove(index)">
            <img :src="item.src" :alt="'img'+index">
          </div>
        </div>
        <div class="addPhoto" v-show="list.length<6">
          <p class="capture">Add photo</p>
          <input type="file" class="fileUpload" @change="fileChange" accept="image/*" multiple>
        </div>
      </div>
      <div class="contentContainer">
        <textarea cols="30" rows="10" placeholder="Write something…" v-model="content"></textarea>
      </div>

      <settings-btn :options="btnOptions" class="btn" @click="feedbackFn" />
      <!-- Loading -->
      <loading v-show="isLoading"/>
    </div>
</template>

<script>
import {Toast} from 'vant'
import SettingsBtn from '@/components/SettingsBtn'
import NavBar from '@/components/NavBar'
import Loading from '@/components/Loading'
import {feedback, uploadFiles} from '@/api/api'

export default {
  name: 'FeedBack',
  components: {NavBar, SettingsBtn, Loading},
  data () {
    return {
      files: [],
      list: [], // 图片限制6张
      content: '',
      btnOptions: {
        name: 'Send',
        isActive: false
      },
      isLoading: false
    }
  },
  computed: {
    isActive () {
      return this.list.length || this.content
    }
  },
  watch: {
    isActive (val) {
      this.btnOptions.isActive = val
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    fileChange (e) {
      const files = e.target.files
      for (let i = 0; i < files.length; i++) {
        if (files[i].size / 1024 > 10000) {
          Toast({
            message: 'Your image/video is over 10M'
          })
          continue
        } else if (files.length >= 6) {
          Toast({
            message: 'You should not choose more than 6 files!'
          })
          break
        } else {
          this.files.push(files[i])
        }
      }
      this.convertFile()
    },
    convertFile () {
      this.list = this.files.map(item => {
        return {
          src: window.URL.createObjectURL(item),
          isRemove: false
        }
      })
    },
    showOrHideRemove (index) {
      this.list[index].isRemove = !this.list[index].isRemove
    },
    removeFile (index) {
      if (this.list[index].isRemove) {
        this.files.splice(index, 1)
        this.convertFile()
      }
    },
    feedbackFn () {
      this.isLoading = true
      const promiseArr = []
      this.files.forEach((item, index) => {
        const query = {
          index: index,
          filetime: 0
        }
        const formData = new FormData()
        formData.append('file', item)
        promiseArr.push(uploadFiles(formData, query))
      })
      Promise.all(promiseArr).then(res => {
        this.imageUrlList = res.map(item => {
          return item.data.result.imageurl
        })
        const data = {
          content: this.content,
          imageUrlList: this.imageUrlList
        }
        feedback(data).then(res => {
          if (res.data.code === '200') {
            this.files = []
            this.list = []
            this.content = ''
          }
          Toast({
            message: res.data.message
          })
          this.isLoading = false
        }).catch(() => {
          this.isLoading = false
        })
      })
    }
  }
}
</script>

<style scoped>

.feedback{
  max-height: 100%;
  color: rgb(153,153,153);
}
.imageContainer{
  display: flex;
  flex-wrap: wrap;
  margin-top: 0.2rem;
  margin-left: 0.1rem;
}
.fileItem{
    position: relative;
    margin-right: 1%;
    margin-bottom:1%;
    width:32%;
    height: 0;
    padding-bottom: 32%;
    border-radius: 0.1rem;
    overflow: hidden;
}
.addPhoto{
   position: relative;
    margin-right: 1%;
    margin-bottom:1%;
    width:32%;
    height: 0;
    text-align: center;
    padding-bottom: 32%;
    border-radius: 0.1rem;
    background-color:rgb(236,240,248);
}
.addPhoto::before,.addPhoto::after{
  content: "";
  position: absolute;
  top: .8rem;
  left: 50%;
  transform: translateX(-50%);
  width: 0.8rem;
  height: 0.08rem;
  background-color: rgb(153,153,153);
}
.addPhoto::after{
  transform:translateX(-50%) rotate(90deg);
}
.capture{
  position: absolute;
  width: 100%;
  bottom: .2rem;
  text-align: center;
}
.fileUpload{
  position: absolute;
  opacity: 0;
  top: 0;
  left: 0;
  width:100%;
  height:100%;
}
.btn{
  position: relative;
  bottom: 1rem;
}
.deleteCover{
    position: absolute;
    top: 0;
    right: 0;
    width: 0.44rem;
    height: 0.44rem;
    background-position:0 0;
    background-repeat:no-repeat;
    background-image: url(../assets/img/btnDelete@2x.png);
    background-size: cover;
}

.contentContainer{
  margin-top: 0.4rem;
  padding: 0 0.2rem;
}
.leftIcon{
  font-size: 0.5rem;
}
</style>
