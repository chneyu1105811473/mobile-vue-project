<template>
    <div class="postingPreview" :style="{'height':winHeight+'px'}">
      <nav-bar
      right-text="Next"
      :class="{'active':isActive}"
      @click-left="onLeftClick"
      @click-right="onRightClick"
      >
        <span slot="left" class="leftIcon">&times;</span>
      </nav-bar>
      <div class="previewContainer">
        <!-- app做的是摄像区域，h5端做成预览文件 -->
        <div class="previewImage" v-show="currentFile.url">
          <template v-if="currentFile.type===1">
            <video :src="currentFile.url" controls />
          </template>
          <template v-if="currentFile.type===0">
            <img v-lazy="currentFile.url" />
          </template>
        </div>
        <div class="tip" v-show="!currentFile.url">
          Choose files you want to publish,<br>then you can preview them here.
        </div>
        <!-- mention people -->
        <!-- <div class="mentionIcon" @click="mentionFriends" v-show="isActive"></div> -->
      </div>
        <!-- 拖拽实现 -->
      <div class="filesContainer">
        <draggable
        v-model="fileList"
        v-bind="dragOptions"
        @update="dragUpdate"
        @start="drag = true"
        @end="drag = false"
        >
          <transition-group
          type="transition"
          tag="div"
          :name="!drag ? 'flip-list' : null"
          class="filesGroup"
          >
            <div
            v-for="(item,index) in fileList"
            :key="index+1"
            :class="{'fileItem':true,'hasFile':index<files.length}"
            @click="removeOrPreviewFileFn(index)"
            >
              <template v-if="item.url">
                <template v-if="item.type">
                  <video :src="item.url" @loadeddata="loadeddataFn" :data-index="index"></video>
                </template>
                <template v-else>
                  <img :src="item.url">
                </template>
                <div class="deleteCover" v-show="deleteCover"></div>
              </template>
            </div>
          </transition-group>
        </draggable>
        <!-- 拖拽实现 -->
        <div class="deleteIcon" @click="deleteFilesFn">
          <img :src="currentFile.url?deleteIconSel:deleteIcon" alt="icon">
        </div>
      </div>
      <div class="fileUploadBtns">
        <!-- 设置duration -->
        <div :class="{'resetFileBtn':true,'active':isClip}" @click="editDuration=isClip?true:false">
          <span class="iconfont">&#xe611;</span>
        </div>
        <!-- 上传文件或拍照 -->
        <div class="uploadBtn">
          <div class="fileUpload">
            <input type="file" class="fileInput" accept="image/*,video/*" multiple @change="fileChange"/>
          </div>
        </div>
        <!-- 图片裁剪 -->
        <div :class="{'randomFileBtn':true,'active':isClip}" @click="editCurrentImage">
          <span class="iconfont">&#xe64f;</span>
        </div>
      </div>
      <!-- 选择duration -->
      <Popup v-model="editDuration">
        <duration-pop :duration="duration" @sendDuration="editCurrentDuration"/>
      </Popup>
    </div>
</template>

<script>
import deleteIconSel from '@/assets/img/icPublicDeleteSel@2x.png'
import deleteIcon from '@/assets/img/icPublicDeleteNor@2x.png'
import DurationPop from './components/DurationPop'
import draggable from 'vuedraggable'
import {NavBar, Toast, Popup, Dialog} from 'vant'
import { mapGetters } from 'vuex'

export default {
  name: 'PostingPreview',
  components: {NavBar, draggable, Popup, DurationPop},
  data () {
    return {
      reader: null,
      files: [], // 图片二进制流信息，用于上传
      fileList: [], // 用于页面preview的图片对象
      emptyFile: {// 初始化preview的空图片对象
        type: 0,
        url: ''
      },
      currentFile: {// 当前图片对象
        type: 0,
        url: ''
      },
      deleteIconSel: deleteIconSel,
      deleteIcon: deleteIcon,
      deleteCover: false,
      isDragged: false,
      drag: false,
      editDuration: false,
      imgarr: []
    }
  },
  created () {
    this.initFiles()
  },
  mounted () {
    this.reader = new FileReader()
  },
  computed: {
    isActive () {
      return this.files.length
    },
    isClip () {
      // 如果没有任何文件，或者当前文件是视频，阻止裁剪动作！！
      return this.files.length && !this.currentFile.type
    },
    dragOptions () {
      return {
        draggable: '.hasFile',
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      }
    },
    duration () {
      return this.currentFile.duration || 5
    },
    postCropperBlob () {
      return this.$store.state.postCropperBlob
    },
    ...mapGetters([
      'winHeight'
    ])
  },
  watch: {
    '$route' (newRoute, oldRoute) { // 初始化
      const routeArr = [newRoute.name, oldRoute.name]
      if (!(routeArr.includes('Publish') || routeArr.includes('PostCropper'))) {
        this.files = []
        this.fileList = []
        this.initFiles()
        this.currentFile = {
          type: 0,
          url: ''
        }
        this.$store.state.postCropperBlob = ''
      }
    }
  },
  activated () {
    if (this.postCropperBlob) {
      const index = this.currentFile.index
      const file = []
      file.push(this.postCropperBlob)
      this.files.splice(index, 1, this.postCropperBlob)
      // 转换成图片显示
      this.convertFiles(file, index)
    }
  },
  methods: {
    onLeftClick () {
      if (this.files.length) {
        Dialog.confirm({
          message: `Are you sure to cancel this post`,
          confirmButtonText: 'Yes',
          cancelButtonText: 'Cancel',
          closeOnClickOverlay: true,
          className: 'morePadding'
        }).then(() => { // 确认
          this.$router.replace('/myFeed')
        }).catch(() => { // 取消
          console.log('取消')
        })
      } else {
        this.$router.replace('/myFeed')
      }
    },
    onRightClick () {
      if (!this.files.length) { return false }
      this.$store.state.postUploadFiles = this.files
      this.$store.state.postPreviewFiles = this.fileList.filter((item) => {
        return item.url
      })
      this.$router.push({
        name: 'Publish'
      })
    },
    initFiles () {
      for (let i = 0; i < 6; i++) {
        this.fileList.push({
          type: 0,
          url: '',
          index: i,
          duration: 5
        })
      }
    },
    fileChange (e) { // 获得blob数组
      let files = e.target.files
      let len = files.length + this.files.length
      if (len > 6) {
        Toast({
          message: 'You should choose no more than 6 files!'
        })
        return false
      }
      for (let i = 0; i < files.length; i++) {
        if (files[i].size / 1024 > 10000) {
          Toast({
            message: 'Your image/video is over 10M'
          })
          files = []
          break
        }
      }
      this.convertFiles([...files], this.files.length)
      this.files.splice(this.files.length, 0, ...files)
    },
    convertFiles (uploadFiles, i) {
      const objectURL = uploadFiles.map((item, index) => { // 生成url为blob的文件
        return {
          type: item.type.includes('image') ? 0 : 1, // 0表示图片，1表示视频
          url: window.URL.createObjectURL(item),
          index: index + i,
          duration: 5
        }
      })
      this.currentFile = objectURL[0]
      this.fileList.splice(i, uploadFiles.length, ...objectURL)
    },
    deleteFilesFn () {
      if (this.isActive) {
        this.deleteCover = !this.deleteCover
      } else {
        this.deleteCover = false
      }
    },
    removeOrPreviewFileFn (index) {
      if (this.deleteCover) {
        this.files.splice(index, 1)
        this.fileList.splice(index, 1)
        this.fileList.push(this.emptyFile)
        this.currentFile = this.fileList[0]
      } else {
        this.currentFile = this.fileList[index].url ? this.fileList[index] : this.currentFile
      }
    },
    dragUpdate (e) { // 排序发生变化时触发
      this.isDragged = true
      const oldFile = this.files.slice(e.oldIndex)
      this.files.splice(e.oldIndex, 1)
      this.files.splice(e.newIndex, 0, oldFile[0])
      this.currentFile = this.fileList[e.newIndex]
    },
    loadeddataFn (e) { // 截取视频第一帧
      let canvas = document.createElement('canvas')
      let cxt = canvas.getContext('2d')
      canvas.width = e.target.videoWidth
      canvas.height = e.target.videoHeight
      cxt.drawImage(e.target, 0, 0, canvas.width, canvas.height)
      const poster = canvas.toDataURL('image/jpg')
      const index = JSON.parse(e.target.getAttribute('data-index'))
      this.fileList[index].poster = poster
    },
    // 设置播放时间
    editCurrentDuration (val) {
      this.currentFile.duration = val
    },
    // 裁剪图片
    editCurrentImage () {
      if (!this.isClip) { return false }
      localStorage.setItem('clipPostImage', JSON.stringify(this.currentFile))
      this.$router.push({
        name: 'PostCropper'
      })
    },
    // 文件上传压缩 使用canvas
    render (src, picname) {
      const MAX_HEIGHT = window.innerHeight
      // 创建一个 Image 对象
      var image = new Image()
      image.src = src
      // 绑定 load 事件处理器，加载完成后执行
      image.onload = function () {
        // 获取 canvas DOM 对象
        var canvas = document.createElement('canvas')
        // 如果高度超标
        if (image.height > MAX_HEIGHT && image.height >= image.width) {
          // 宽度等比例缩放 *=
          image.width *= MAX_HEIGHT / image.height
          image.height = MAX_HEIGHT
        }
        // 考录到用户上传的有可能是横屏图片同样过滤下宽度的图片。
        if (image.width > MAX_HEIGHT && image.width > image.height) {
          // 宽度等比例缩放 *=
          image.height *= MAX_HEIGHT / image.width
          image.width = MAX_HEIGHT
        }

        // 获取 canvas的 2d 画布对象,
        var ctx = canvas.getContext('2d')
        // canvas清屏，并设置为上面宽高
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        // 重置canvas宽高
        canvas.width = image.width
        canvas.height = image.height
        // 将图像绘制到canvas上
        ctx.drawImage(image, 0, 0, image.width, image.height)
        // !!! 注意，image 没有加入到 dom之中
        let blob
        const mime = src.slice(-3).toLowerCase()
        if (mime.includes('png')) {
          blob = canvas.toDataURL('image/png')
        } else {
          blob = canvas.toDataURL('image/jpeg')
        }
        // 将转换结果放在要上传的图片数组里
        this.imgarr.push({'pic': blob, 'pic_name': picname})
        console.log(this.imgarr)
      }
    }
    // mentionFriends () {
    //   // 此处需要显示好友列表？好友列表是互相关注的还是我关注的？
    //   if (this.files.length) {
    //     console.log(111)
    //   }
    // }
  }
}
</script>

<style scoped>
/* navbar */
.active .van-nav-bar__right .van-nav-bar__text{
    color: rgb(54,101,167);
}
.van-nav-bar__right .van-nav-bar__text{
    color: rgba(130,167,208,.6);
}
.van-nav-bar__text:active{
    background-color: transparent;
}
/* post container */
.postingPreview img,.postingPreview video{
    width: 100%;
    height: 100%;
    object-fit: contain;
    vertical-align: baseline;
}
.postingPreview .leftIcon{
    color: rgb(54,101,167);
    font-size: 0.5rem;
}
.postingPreview .previewContainer{
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 100%;
}
.postingPreview .previewImage{
    display: flex;
    align-items: center;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
}
.postingPreview .filesContainer{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.2rem;
    background-color: rgb(2,18,49);
}
.postingPreview .filesGroup{
  display: flex;
}
.postingPreview .fileItem{
    position: relative;
    margin-right: 0.22rem;
    max-width: 0.84rem;
    width: 0.84rem;
    height: 0.84rem;
    border-radius: 0.1rem;
    overflow: hidden;
    background-color: rgba(130,167,208,.4);
}
.postingPreview .deleteIcon{
    width: 0.5rem;
    height: 0.38rem;
}
.postingPreview .deleteCover{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 0.44rem;
    height: 0.44rem;
    background-position:0 0;
    background-repeat:no-repeat;
    background-image: url(../../assets/img/btnDelete@2x.png);
    background-size: cover;
}
.postingPreview .fileUploadBtns{
    padding: 0.7rem 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
}
.postingPreview .uploadBtn{
    position: relative;
    width:1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    border: 0.1rem solid #fff;
    background:linear-gradient(to right,rgb(52,147,212),rgb(54,100,167));
    box-shadow: 0 0 0 0.08rem rgb(202,215,236);
}
.postingPreview .fileUpload,.fileInput{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}
.postingPreview .resetFileBtn .iconfont,.randomFileBtn .iconfont{
    color: rgba(66,93,144,0.6);
    font-size: 0.7rem;
}
.postingPreview .resetFileBtn.active .iconfont,.randomFileBtn.active .iconfont{
    color: rgb(66,93,144);
    font-size: 0.7rem;
}
/* .mentionIcon{
    position:absolute;
    bottom:.1rem;
    width:0.6rem;
    height:0.6rem;
    border-radius: 50%;
    background-position:0 0;
    background-repeat:no-repeat;
    background-image: url(../../assets/img/ic_at@2x.png);
    background-size: cover;
    margin-left: 0.2rem;
} */
.tip{
  position:absolute;
  top:0;
  left:0;
  right:0;
  bottom:0;
  display:flex;
  justify-content:center;
  align-items:center;
  font-size:0.28rem;
  font-family:'SFUIDisplay-Medium';
  color:rgb(66,93,144);
}
</style>
