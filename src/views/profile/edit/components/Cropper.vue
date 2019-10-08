<template>
  <div class="cropper-profile-icon">
   <!-- 用一个块元素(容器)包装图像或画布元素 -->
    <div class="profile-cropper">
      <img id="image" :src="picture">
    </div>
  </div>
</template>

<script>
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.min.css'

export default {
  name: 'Cropper',
  props: ['picture'],
  data () {
    return {
      cropper: null,
      autoCrop: true
    }
  },
  mounted () {
    const self = this
    this.image = document.getElementById('image')
    this.image.addEventListener('load', () => {
      this.cropper = new Cropper(this.image, {
        aspectRatio: 1 / 1,
        viewMode: 1,
        dragMode: 'move',
        // preview: '.small',
        responsive: false,
        restore: false,
        modal: true, // 默认false
        guides: false, // 是否显示虚线,默认true
        background: false,
        autoCrop: true,
        center: false, // 是否显示中间的+ 默认true
        // autoCropArea: 1, // 默认图片的80%
        movable: true, // 图片是否可以移动。默认true
        // scalable: true,
        // zoomable: false,
        wheelZoomRatio: false,
        cropBoxMovable: false,
        cropBoxResizable: false,
        crop (event) {
          if (self.autoCrop) {
            self.setImgUrl()
            self.autoCrop = !self.autoCrop
          }
        },
        // ready (e) {
        //   console.log('ready')
        // },
        // cropstart (e) {
        //   console.log('cropstart')
        // },
        // cropmove (e) {
        //   console.log('cropmove')
        // },
        cropend (e) {
          // console.log('cropend')
          self.setImgUrl()
        }
      // zoom (e) {
      //   console.log('zoom')
      // }
      })
    })
  },
  destroyed () {
    this.url = ''
  },
  methods: {
    // 确定提交
    setImgUrl () {
      this.cropper.getCroppedCanvas().toBlob((blob) => {
        this.$emit('sendBlob', blob)
      })
      // const base64 = this.cropper.getCroppedCanvas().toDataURL('image/jpeg')
    }
  }

}
</script>

<style scoped>
img{
  object-fit: cover;
}
.cropper-profile-icon{
    width:100%;
    height: 100%;
    max-height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
