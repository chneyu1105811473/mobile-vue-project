<template>
  <div class="addPost">
      <!-- <div class="uploadFile" @click="goPostPage"/> -->
    <div class="uploadFile" @click="showDialogFn"/>
    <p class="level1">Post your first photo or video</p>
    <p class="level2">Share photos and videos</p>
    <p class="level3">
        When you share photos and videos,<br/>
        they’ll appear on your profile.
    </p>
  </div>
</template>

<script>
import dialog from '@/mixins/downloadAppMix'

export default {
  name: 'AddPost',
  mixins: [dialog],
  methods: {
    goPostPage () {
      this.$router.push({
        name: 'PostEdit'
      })
    },
    showDialogFn () {
      const options = {
        title: 'Publish a post',
        message: 'Download the app, \n then you can publish a post.',
        className: 'lessPadding'
      }
      this.showDialog(options)
    }
  }
}
</script>

<style scoped>
.addPost{
    width: 100%;
    height: 100%;
    overflow: hidden;
}
.uploadFile{
    position: relative;
    margin: 1rem auto 0.4rem;
    width: 1.3rem;
    height: 1.3rem;
    border-radius: 0.1rem;
    border:0.04rem solid rgb(66,93,144);
}
.uploadFile::before,.uploadFile::after{
    content: "";
    position: absolute;
    top:50%;
    left:50%;
    width: 0.6rem;
    height: 0.04rem;
    background-color: rgb(66,93,144);
}
.uploadFile::before{
    transform: translate(-50%,-50%);
}
.uploadFile::after{
    transform: translate(-50%,-50%) rotate(90deg);
}
.addPost{
    text-align: center;
}
.level1{
    font-size: 0.24rem;
    color: rgb(66,93,144);
    font-family: SFUIDisplay-Regular;
}
.level2{
    margin-top: 0.6rem;
    font-family: SFUIDisplay-Medium;
    font-size: 0.32rem;
    color: rgb(51,51,51);
}
.level3{
    font-family: SFUIDisplay-Regular;
    font-size: 0.24rem;
    line-height: 0.3rem;
    color: rgb(153,153,153);
}
</style>
