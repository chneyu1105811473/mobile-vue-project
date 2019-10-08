<template>
  <div class="cropper" :style="{'height':winHeight+'px'}">
    <nav-bar>
      <span slot="left" class="iconfont leftIcon" @click="onClickLeft">&#xe65b;</span>
      <span slot="title" class="title">Edit</span>
      <span slot="right" class="rightIcon" @click="nextFn">Next</span>
    </nav-bar>
    <!-- </NavBar> -->
    <div class="cropperWrapper">
      <!-- 用一个块元素(容器)包装图像或画布元素 -->
      <div class="postCropper">
          <img id="image" :src="file.url">
      </div>
    </div>
    <div class="operationBtn">
      <div class="changeMode iconfont" @click.stop="changeMode">
        {{isFill?'&#xe63c;':'&#xe60a;'}}
      </div>
      <div class="changeAngel iconfont" @click.stop="changeAngel">&#xe61d;</div>
    </div>
    <!-- 滤镜 使用swiper-->
    <swiper :options="swiperOptions" class="filterMode">
      <swiper-slide v-for="(item,index) in filters" :key="index">
        <div class="filterIcon" @click="filter(index)">
            <img :src="item" alt="filterIcon">
         </div>
      </swiper-slide>
    </swiper>
    <div class="filterContainer">
      <img id="filterImage" :src="file.url">
      <canvas id="filterCanvas"></canvas>
      <canvas id="oldCanvas"></canvas>
    </div>
  </div>
</template>

<script>
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.min.css'
import filter0 from '@/assets/filters/0.png'
import filter1 from '@/assets/filters/1.png'
import filter2 from '@/assets/filters/2.png'
import filter3 from '@/assets/filters/3.png'
import filter4 from '@/assets/filters/4.png'
import filter5 from '@/assets/filters/5.png'
import filter6 from '@/assets/filters/6.png'
import filter7 from '@/assets/filters/7.png'
import filter8 from '@/assets/filters/8.png'
import filter9 from '@/assets/filters/9.png'
import filter10 from '@/assets/filters/10.png'
import NavBar from '@/components/NavBar'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { mapGetters } from 'vuex'

export default {
  name: 'PostCropper',
  components: {NavBar, swiper, swiperSlide},
  data () {
    return {
      isFill: true,
      rotate: 90,
      croppable: false,
      filters: [filter0, filter1, filter2, filter3, filter4, filter5, filter6, filter7, filter8, filter9, filter10],
      swiperOptions: {
        // some swiper options/callbacks
        // 所有的参数同 swiper 官方 api 参数
        slidesPerView: 5.3,
        spaceBetween: 10,
        breakpoints: {
          1400: {
            slidesPerView: 8.4,
            spaceBetween: 30
          },
          1024: {
            slidesPerView: 7.4,
            spaceBetween: 30
          },
          768: {
            slidesPerView: 6.4,
            spaceBetween: 20
          },
          640: {
            slidesPerView: 5.3,
            spaceBetween: 10
          },
          320: {
            slidesPerView: 3.5,
            spaceBetween: 10
          }
        }
      }
    }
  },
  computed: {
    file: {
      get () {
        return JSON.parse(localStorage.getItem('clipPostImage'))
      },
      set () {}
    },
    ...mapGetters([
      'winHeight'
    ])
  },
  mounted () {
    this.setCanvas()
    this.image = document.getElementById('image')
    this.image.addEventListener('load', () => {
      this.cropper = new Cropper(this.image, {
        aspectRatio: 1 / 1,
        viewMode: 3,
        dragMode: 'move',
        background: false,
        checkCrossOrigin: false, // 检查当前图像是否为跨域图像
        autoCrop: true,
        center: false, // 是否显示中间的+ 默认true
        autoCropArea: 1, // 默认图片的80%
        zoomable: true, // 是否允许图片缩放
        wheelZoomRatio: false,
        cropBoxMovable: false,
        cropBoxResizable: false
      })
    })
  },
  destroyed () {
    delete this.file
    delete this.cropper
  },
  methods: {
    onClickLeft () {
      this.$store.state.postCropperBlob = ''
      this.$router.replace({
        name: 'PostEdit'
      })
    },
    changeMode () {
      if (!this.cropper.ready) {
        return false
      }
      this.isFill = !this.isFill
      // 改变viewMode的模式
      if (this.isFill) {
        this.cropper.zoom(-0.2)
      } else {
        this.cropper.zoom(0.2)
      }
    },
    changeAngel () {
      if (!this.cropper.ready) {
        return false
      }
      this.cropper.rotate(this.rotate)
    },
    // 确定提交
    nextFn () {
      this.cropper.getCroppedCanvas().toBlob((blob) => {
        this.$store.state.postCropperBlob = blob
        this.$router.replace({
          name: 'PostEdit'
        })
      })
    },
    setCanvas () {
      this.filterImage = document.getElementById('filterImage')
      this.filtercanvas = document.getElementById('filterCanvas')
      this.filtercontext = this.filtercanvas.getContext('2d')
      this.oldcanvas = document.getElementById('oldCanvas')
      this.oldcontext = this.oldcanvas.getContext('2d')
      this.filterImage.addEventListener('load', () => {
        this.filtercanvas.width = this.filterImage.offsetWidth
        this.filtercanvas.height = this.filterImage.offsetHeight
        this.oldcanvas.width = this.filterImage.offsetWidth
        this.oldcanvas.height = this.filterImage.offsetHeight
        this.oldcontext.drawImage(this.filterImage, 0, 0, this.oldcanvas.width, this.oldcanvas.height)
      })
    },
    filter (val) {
      this.filterIndex = val
      const imgdata = this.oldcontext.getImageData(0, 0, this.oldcanvas.width, this.oldcanvas.height)
      if (val === 0) {
        this.copy0(imgdata)
      } else if (val === 1) {
        this.copy1(imgdata)
      } else if (val === 2) {
        this.copy2(imgdata)
      } else if (val === 3) {
        this.copy3(imgdata)
      } else if (val === 4) {
        this.copy4(imgdata)
      } else if (val === 5) {
        this.copy5(imgdata)
      } else if (val === 6) {
        this.copy6(imgdata)
      } else if (val === 7) {
        this.copy7(imgdata)
      } else if (val === 8) {
        this.copy8(imgdata)
      } else if (val === 9) {
        this.copy9(imgdata)
      } else if (val === 10) {
        this.copy10(imgdata)
      }
      this.filtercontext.putImageData(imgdata, 0, 0)
      this.filtercanvas.toBlob((blob) => {
        const url = window.URL.createObjectURL(blob)
        this.image.src = url
        // 关键点：需要让图片在load一次，否则cropper的ready状态无法确定
        this.image.addEventListener('load', () => {
          this.cropper.replace(url)
        })
      })
    },
    // normal
    copy0 () {},
    // 灰度效果
    copy1 (imgdata) {
      for (var i = 0; i < imgdata.data.length; i += 4) {
        // 计算获取单位元素的RBG然后取平均值 然后复制给自身得到灰色的图像
        var avg = (imgdata.data[i] + imgdata.data[i + 1] + imgdata.data[i + 2]) / 3
        imgdata.data[i] = avg
        imgdata.data[i + 1] = avg
        imgdata.data[i + 2] = avg
      }
    },
    // 底片效果
    copy2 (imgdata) {
      for (var i = 0; i < imgdata.data.length; i += 4) {
        // 将所有的RGB值重新赋值（底片效果 = 255 - 当前的RGB值）
        imgdata.data[i] = 255 - imgdata.data[i]
        imgdata.data[i + 1] = 255 - imgdata.data[i + 1]
        imgdata.data[i + 2] = 255 - imgdata.data[i + 2]
      }
    },

    // 黑白效果
    copy3 (imgdata) {
      for (var i = 0; i < imgdata.data.length; i += 4) {
        // 计算获取单位元素的RBG然后取平均值
        var avg = (imgdata.data[i] + imgdata.data[i + 1] + imgdata.data[i + 2]) / 3
        imgdata.data[i] = avg > 128 ? 255 : 0
        imgdata.data[i + 1] = avg > 128 ? 255 : 0
        imgdata.data[i + 2] = avg > 128 ? 255 : 0
      }
    },
    // 浮雕效果
    copy4 (imgdata) {
      for (var i = 0; i < imgdata.data.length; i += 4) {
        // 浮雕效果的算法：当前RGB减去相邻的GRB得到的值再加上128
        imgdata.data[i] = imgdata.data[i] - imgdata.data[i + 4] + 128
        imgdata.data[i + 1] = imgdata.data[i + 1] - imgdata.data[i + 5] + 128
        imgdata.data[i + 2] = imgdata.data[i + 2] - imgdata.data[i + 6] + 128
        // 计算获取单位元素的RBG然后取平均值 再次灰度，优化浮雕的效果
        var avg = (imgdata.data[i] + imgdata.data[i + 1] + imgdata.data[i + 2]) / 3
        imgdata.data[i] = avg
        imgdata.data[i + 1] = avg
        imgdata.data[i + 2] = avg
      }
    },
    // 绿色滤镜
    copy5 (imgdata) {
      for (var i = 0; i < imgdata.data.length; i += 4) {
        // 绿色滤镜的算法：当前绿色通道值G*1.4得到绿色滤镜
        var g = imgdata.data[i + 1] * 1.4
        // 注：当前值大于255时将其赋值255
        imgdata.data[i + 1] = g > 255 ? 255 : g
      }
    },
    // 蓝色滤镜
    copy6 (imgdata) {
      for (var i = 0; i < imgdata.data.length; i += 4) {
        // 蓝色滤镜的算法：当前蓝色通道值变为原来的1.6得到蓝色滤镜
        var b = imgdata.data[i + 2] * 1.6
        // 注：当前值大于255时将其赋值255
        imgdata.data[i + 2] = b > 255 ? 255 : b
      }
    },
    // 红色滤镜
    copy7 (imgdata) {
      for (var i = 0; i < imgdata.data.length; i += 4) {
        // 红色滤镜的算法：当前红色通道值变为原来的2得到红色滤镜
        var r = imgdata.data[i] * 2
        // 注：当前值大于255时将其赋值255
        imgdata.data[i] = r > 255 ? 255 : r
      }
    },
    // 黄色滤镜
    copy8 (imgdata) {
      for (var i = 0; i < imgdata.data.length; i += 4) {
        // 黄色滤镜的算法：红色通道值和绿色通道值增加50（红色+绿色 = 黄色）
        var r = imgdata.data[i] + 50
        var g = imgdata.data[i + 1] + 50
        // 注：当前值大于255时将其赋值255
        imgdata.data[i] = r > 255 ? 255 : r
        imgdata.data[i + 1] = g > 255 ? 255 : g
      }
    },
    // 紫色滤镜
    copy9 (imgdata) {
      for (var i = 0; i < imgdata.data.length; i += 4) {
        // 紫色滤镜的算法：红色通道值和蓝色通道值增加50（红色+蓝色 = 紫色）
        var r = imgdata.data[i] + 50
        var b = imgdata.data[i + 2] + 50
        // 注：当前值大于255时将其赋值255
        imgdata.data[i] = r > 255 ? 255 : r
        imgdata.data[i + 2] = b > 255 ? 255 : b
      }
    },
    // 青色滤镜
    copy10 (imgdata) {
      for (var i = 0; i < imgdata.data.length; i += 4) {
        // 青色滤镜的算法：绿色通道值和蓝色通道值增加50（绿色+蓝色 = 青色）
        var g = imgdata.data[i + 1] + 50
        var b = imgdata.data[i + 2] + 50
        // 注：当前值大于255时将其赋值255
        imgdata.data[i + 1] = g > 255 ? 255 : g
        imgdata.data[i + 2] = b > 255 ? 255 : b
      }
    }
  }
}
</script>

<style scoped>
.cropper{
  height:100%;
  overflow-y: hidden;
}
.cropperWrapper{
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  overflow: hidden;
}
.postCropper{
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}
.operationBtn .iconfont{
  display: flex;
  justify-content: center;
  align-items: center;
  width:.6rem;
  height:.6rem;
  font-size: 0.4rem;
  color: #ddd;
  font-weight: bold;
  background: rgba(0,0,0,.6);
  border-radius: 50%;
}
.changeMode{
  position: absolute;
  bottom: 3rem;
  left: .2rem;
}
.changeAngel{
  position: absolute;
  bottom: 3rem;
  right: .2rem;
}
.filterMode{
  position: absolute;
  width: 100%;
  bottom: 0rem;
  overflow-y: hidden;
  overflow-x: auto;
}
.filterIcon{
  display: inline-block;
  width: 1.5rem;
  height: 1.5rem;
  padding: 0.1rem;
  box-sizing: border-box;
}
.filterContainer{
  position: absolute;
  top: 0;
  visibility: hidden;
  opacity: 0;
}
.leftIcon{
  font-size: 0.5rem;
}
.title{
  font-family: SFUIDisplay-Medium;
}
.rightIcon{
  font-size: 0.28rem;
  color:rgb(66,93,144)
}
#filterCanvas,#oldCanvas{
  position: absolute;
  top: 0;
}
</style>
