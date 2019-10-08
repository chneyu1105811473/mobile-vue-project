<template>
    <div>
        <nav-bar>
          <span slot="left" @click="onClickLeft">Back</span>
          <span slot="right" :class="{'postBtn':true,'active':isActive}" @click="post">share</span>
        </nav-bar>

        <div class="postContainer">
          <div class="filesWrap">
            <swipe :loop="true">
              <swipe-item v-for='(item,index) in previewList' :key="index">
                <div class="fileItem">
                  <img v-if="item.type===0"  :src="item.url" alt="post" class="file">
                  <video v-if="item.type===1" :src="item.url" controls class="file" :poster="item.poster"></video>
                </div>
              </swipe-item>
            </swipe>
          </div>
          <!-- content -->
          <div class="postContent">
            <cell-group :border="false">
              <Field
                v-model="content"
                type="textarea"
                placeholder="Write a caption…"
                rows="3"
                autosize
                :border="false"
                class="contentInput"
              />
            </cell-group>
          </div>
          <div class="containerBox">
            <!-- location -->
            <div :class="{'postItem':true,'active':location}" @click="goLocationSel">
              <p class="location">{{location}}</p>
            </div>
            <!-- tags -->
            <div :class="{'postItem':true,'active':tagArr.length>0}" @click="goTagSel">
              <div class="tagContainer">
                <template v-for="(item,index) in tagArr">
                  <p class="tagItem" :key="index" v-show="index<4">#{{item}}</p>
                </template>
              </div>
            </div>
          </div>
        </div>
    </div>
</template>
<script>
import {Icon, CellGroup, Field, Toast, Swipe, SwipeItem} from 'vant'
import {uploadPost, uploadFiles} from '@/api/api'
import userLocation from '@/mixins/userLocationMix'
import toLogin from '@/mixins/toLoginMix'
import NavBar from '@/components/NavBar'
import axios from 'axios'
import {mapState} from 'vuex'

export default {
  name: 'Publish',
  components: {NavBar, Icon, CellGroup, Field, Swipe, SwipeItem},
  mixins: [userLocation, toLogin],
  data () {
    return {
      isActive: false,
      content: '',
      location: '',
      tagArr: [],
      baseUrl: process.env.BASE_API,
      postForm: [],
      isUpload: false
    }
  },
  computed: mapState({
    fileList: 'postUploadFiles',
    previewList: 'postPreviewFiles',
    accessToken: 'accessToken',
    mapBaseUrl: 'mapBaseUrl'
  }),
  watch: {
    '$route' () {
      this.location = this.$store.state.postData.location
      if (this.$store.state.postData.tagIds) {
        this.tagArr = this.$store.state.postData.tagIds.map((item, index) => {
          return item.name
        })
        this.tagIds = this.$store.state.postData.tagIds.map((item, index) => {
          return item.id
        })
      }
      if (this.location && this.tagArr.length > 0) {
        this.isActive = true
      } else {
        this.isActive = false
      }
    }
  },
  activated () {
    console.log(this.previewList, this.fileList)
    this.getLocation()
  },
  methods: {
    onClickLeft () {
      this.$router.replace({
        name: 'PostEdit'
      })
    },
    getLocation () {
      // 调用mapbox反编码接口
      if (typeof this.lng !== 'number' || typeof this.lat !== 'number') {
        Toast({
          type: 'fail',
          message: 'We can not get your location in the browser!'
        })
        return false
      }
      axios.get(`${this.mapBaseUrl}/${this.lng},${this.lat}.json?access_token=${this.accessToken}`)
        .then(res => {
          const features = res.data.features
          this.location = this.$store.state.postData.location || features[0].place_name.trim()
          this.$store.state.postData = {
            location: this.location,
            longitude: features[0].center[0],
            latitude: features[0].center[1],
            country: features[features.length - 1].place_name,
            isocountryCode: features[features.length - 1].properties.short_code,
            cityName: features[0].place_name.split(',')[1].replace(/shi/ig, '').trim(),
            region: '',
            state: '',
            street: ''
          }
        }).catch(err => {
          this.toLogin(err)
        })
    },
    post () {
      if (!this.isActive || this.isUpload) {
        return false
      }
      this.isUpload = true
      this.isActive = false
      // 1.文件上传
      const promiseArr = []
      const files = document.getElementsByClassName('file')
      this.fileList.forEach((item, index) => {
        const query = {
          index: index,
          filetime: item.type.includes('image') ? this.previewList[index].duration : files[index].duration
        }
        const mime = item.type.split('/')[1]
        const formData = new FormData()
        formData.append('file', item, 'post' + index + '.' + mime)
        if (item.type.indexOf('video') > -1) {
          let poster = files[index].getAttribute('poster')
          let videoPic = this.dataURLtoBlob(poster)
          formData.append('videoPic', videoPic, 'cover.jpg')
        }
        promiseArr.push(uploadFiles(formData, query))
      })
      // 文件上传获得 fileForm
      Promise.all(promiseArr).then(res => {
        this.postForm = res.map((item) => {
          return item.data.result
        })
        setTimeout(this.goUpload)
      })
    },
    goLocationSel () {
      if (typeof this.lng !== 'number' || typeof this.lat !== 'number') {
        Toast({
          type: 'fail',
          message: 'We can not get your location in the browser!'
        })
        return false
      }
      this.$router.push({
        name: 'PostLocation'
      })
    },
    goTagSel () {
      if (typeof this.lng !== 'number' || typeof this.lat !== 'number') {
        return false
      }
      this.$router.push({
        name: 'PostTag'
      })
    },
    goUpload () {
      const data = {
        'cityName': this.$store.state.postData.cityName,
        'content': this.content,
        'country': this.$store.state.postData.country,
        'isocountryCode': this.$store.state.postData.isocountryCode,
        'latitude': this.$store.state.postData.latitude,
        'location': this.$store.state.postData.location,
        'locationName': this.$store.state.postData.location,
        'longitude': this.$store.state.postData.longitude,
        'postFileForms': this.postForm,
        'readPermission': 1, // 1:公开 2:自己可见 3:好友可见 4:关注我的可见 5:指定可见
        'region': this.$store.state.postData.region,
        'sourceType': 0,
        'state': this.$store.state.postData.state,
        'street': this.$store.state.postData.street,
        'tagIds': this.tagIds,
        'type': 0// 0:用户 1:xplo 2:news
      }
      uploadPost(data).then(res => {
        this.isActive = true
        if (res.data.code === '200') {
          this.isUpload = false
          // 上传成功，删除store存储的数据
          this.$store.state.postCropperBlob = ''
          this.$router.push('/myFeed')
        } else {
          Toast({
            message: res.data.code + ': ' + res.data.message
          })
        }
      }).catch(err => {
        this.toLogin(err)
      })
    },
    dataURLtoBlob (base64) {
      let arr = base64.split(',')
      let mime = arr[0].match(/:(.*?);/)[1]
      let bstr = atob(arr[1]) // 解码（使用btoa是编码）
      let len = bstr.length
      let u8arr = new Uint8Array(len)
      while (len--) {
        u8arr[len] = bstr.charCodeAt(len)
      }
      return new Blob([u8arr], {
        type: mime
      })
    }
  }
}
</script>

<style scoped>
img,video{
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.van-nav-bar__text{
  color:rgb(102,102,102);
}
.postContainer{
  padding: 0.2rem 0.5rem;
}
.filesWrap{
  position: relative;
  width: 5.8rem;
  height: 5.8rem;
  margin: 0 auto;
  border-radius:0.1rem;
  overflow: hidden;
}
.fileItem{
  width: 100%;
  height: 100%;
}
.containerBox{
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
}
.postItem{
  min-width: 3rem;
  width: 40%;
  height: 0;
  padding:0 0.3rem 45%;
  box-sizing: border-box;
  box-sizing: border-box;
  border-radius: 0.2rem;
  border: 0.02rem dashed rgb(66,93,144);
}
.postItem::before{
  content: "";
  display: block;
  width: 0.8rem;
  height: 0.8rem;
  background-position:0 0;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  margin: 0.3rem auto;
}
.postItem:nth-child(1):before{
  background-image: url(../../assets/img/publicLightIconLocationNor@2x.png);
}
.active.postItem:nth-child(1):before{
  background-image: url(../../assets/img/publicLightIconLocationSel@2x.png);
}
.postItem:nth-child(2):before{
  background-image: url(../../assets/img/publicLightIconTagsNor@2x.png);
}
.active.postItem:nth-child(2):before{
  background-image: url(../../assets/img/publicLightIconTagsSel@2x.png);
}
.tagContainer{
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
.tagItem{
  width: 100%;
  margin: 0.05rem 0;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-family: SFUIDisplay-Medium;
  font-size: 0.24rem;
  text-align: center;
  color: rgb(66,93,144);
}
.contentInput{
  color: rgb(66,93,144);
}
.location{
  max-height: 1.2rem;
  font-family: SFUIDisplay-Medium;
  color: rgb(66,93,144);
  font-size: 0.24rem;
  line-height: 0.3rem;
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}
.postBtn{
  padding: 0.08rem .24rem;
  border-radius: 0.3rem;
  font-family: SFUIDisplay-Medium;
  background-color: rgb(202,215,236);
  color: #fff;
  font-size: 0.3rem;
  z-index: 2;
}
.postBtn.active{
  background: linear-gradient(to right,rgb(52,147,212),rgb(54,100,167));
}

</style>
