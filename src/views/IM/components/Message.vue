<template>
  <pull-refresh
  v-model="isLoading"
  :disabled="finished"
  @refresh="onRefresh"
  class="message"
  >
    <template slot="pulling">
      <lottie :key="1" :height="50"  :width="100" :options="defaultOptions1"/>
    </template>
    <template slot="loosing">
      <lottie :key="2" :height="50"  :width="100" :options="defaultOptions1" v-on:animCreated="handleAnimation"/>
    </template>
    <template slot="loading">
      <lottie :key="3" :height="50"  :width="100" :options="defaultOptions2"/>
    </template>
      <p class="tip" v-show="!isLoading && list.length">
        —— {{finished?'Already show all messages':'You can pull down to get more messages'}} ——
      </p>
      <template v-for="(item,index) in list" >
        <div class="messageItem" :key="index">
           <div :class="{'info':true,'isSelf':item.from === accid}">
             <div class="icon">
               <img v-lazy="item.from === accid?myInfo.icon:userInfo.icon" alt="icon">
             </div>
             <div class="content">
               <div class="timeline">{{item.time/1000|timeAndDate}}</div>
               <div class="text" v-if="item.text">{{item.text}}</div>
               <div class="files" v-if="item.file">
                 <template v-if="item.type.includes('image')">
                   <img v-lazy="item.file.url" :alt="item.file.name" width="200"/>
                 </template>
                 <template v-if="item.type.includes('video')">
                   <video :src="item.file.url" :alt="item.file.name" width="200" controls/>
                 </template>
                 <template v-if="item.type.includes('audio')">
                   <audio :src="item.file.url" :alt="item.file.name" controls/>
                 </template>
                 <template v-if="item.type.includes('file')">
                   <a :href="item.file.url" target="_blank" class="fileLink">
                     <div class="iconfont">&#xe620;</div>
                     <div class="filename">{{item.file.name|nameFormate}}</div>
                   </a>
                 </template>
               </div>
               <div class="customMsg" v-if="item.type.includes('custom')">
                  <Custom :custom="JSON.parse(item.content)"/>
               </div>
             </div>
           </div>
        </div>
      </template>
  </pull-refresh>
</template>

<script>
import {PullRefresh} from 'vant'
import Lottie from 'vue-lottie'
import animationData2 from '@/assets/data/refresh02.json'
import animationData1 from '@/assets/data/refresh01.json'
import Custom from './Custom'

export default {
  name: 'IMMessage',
  components: {PullRefresh, Lottie, Custom},
  props: {
    finished: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      isLoading: false,
      defaultOptions2: {
        animationData: animationData2
      },
      defaultOptions1: {
        animationData: animationData1
      }
    }
  },
  filters: {
    nameFormate (val) {
      const index = val.lastIndexOf('.')
      let name = val.slice(0, index)
      let type = val.slice(index)
      return name.length > 15 ? name.slice(0, 15) + '.../' + type : val
    }
  },
  computed: {
    list () {
      return this.$store.state.totalMsgs
    },
    length () {
      return this.$store.state.totalMsgs.length
    },
    accid () {
      return localStorage.getItem('im_accid')
    },
    myInfo () {
      return this.$store.state.myInfo
    },
    userInfo () {
      return this.$store.state.userInfo
    }
  },
  watch: {
    length () {
      this.isLoading = false
    },
    finished (val) {
      if (val) {
        this.isLoading = false
      }
    }
  },
  methods: {
    onRefresh () {
      this.$emit('load', true)
    },
    handleAnimation (anim) {
      this.anim = anim
      this.anim.pause()
    }
  }
}
</script>

<style scoped>
.message{
  min-height:100%;
  font-family: 'SFUIDisplay-Regular';
  color: rgb(51,51,51);
}
.tip{
  margin: 0;
  text-align: center;
  font-size: 0.24rem;
  color: rgb(176,177,185);
}
.messageItem{
  padding:0.2rem .1rem;
}
.timeline{
  margin-bottom: 0.1rem;
  font-size: 0.22rem;
  transform: scale(.9);
  transform-origin: left bottom;
  color: rgb(176,177,185);
}
.info{
  display: flex;
  align-items: flex-start;
}
.content{
  max-width: 60%;
}
.content .text{
  max-width: 6rem;
  font-size: 0.24rem;
  word-break: break-all;
}
.content .files{
  font-size: 0.24rem;
}
.info.isSelf{
  flex-direction: row-reverse;
}
.info.isSelf .timeline{
  display: flex;
  justify-content: flex-end;
  transform-origin: right bottom;
}
.info.isSelf .text{
  text-align: right;
}
.icon{
  margin:0 .1rem;
  width: .8rem;
  height: .8rem;
  border-radius: 50%;
  overflow: hidden;
  background-color: #eee;
}
.fileLink{
  color: rgb(51,51,51);
}
.fileLink .iconfont{
  color: rgb(51,51,51);
  font-size: 0.5rem;
  text-align: center;
}
.fileLink .filename{
  columns: rgb(176,177,185);
}
</style>
