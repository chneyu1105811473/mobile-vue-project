<template>
  <!-- 消息 -->
  <div class="messageContainer">
    <div class="header">Notifications</div>
    <!-- 展示消息详情 -->
    <sticky>
      <div class="tabs">
        <div class="title" :class="{'active':active === 0}" @click="active = 0">
          Following
        </div>
        <div class="title" :class="{'active':active === 1}" @click="active = 1">
          You
        </div>
      </div>
    </sticky>
    <!-- Following -->
    <message-list :type="2" key="1" v-if="active === 0"/>
    <!-- You -->
    <message-list :type="1" key="2" v-else/>
    <footer-tab :currentTab="currentTab"/>
  </div>
</template>

<script>
import {Sticky} from 'vant'
import FooterTab from '@/components/FooterTab'
import MessageList from './components/MessageList'

export default {
  name: 'Message',
  components: {FooterTab, MessageList, Sticky},
  data () {
    return {
      currentTab: 3,
      active: 1
    }
  }
}
</script>

<style scoped>
.header{
  padding-top: 0.2rem;
  text-align: center;
  font-size: 0.36rem;
  color: rgb(51,51,51);
  font-family: SFUIDisplay-Medium;
}
.tabs{
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  padding-top: 0.1rem;
}
.tabs .title{
  position:relative;
  font-family: SFUIDisplay-Medium;
  text-align: center;
  width: 100%;
  padding: .2rem 0;
  font-size: 0.28rem;
  color: rgb(153,153,153);
}
.title::after{
  content:"";
  position:absolute;
  height:0.02rem;
  left:50%;
  right:50%;
  bottom:0;
  background-color:rgb(51,51,51);
}
.title.active{
  color: rgb(51,51,51);
}
.title.active::after{
  right:0;
  left:0;
  transition-duration:0.3s;
  transition-timing-function:ease-in-out;
}
</style>
