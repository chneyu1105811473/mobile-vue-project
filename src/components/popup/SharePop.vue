<template>
    <div>
        <!-- share -->
        <div class="shadow">
            <div class="dialog">
                <div class="dialog-content">
                    <ul class="dialog-share">
                       <li class="shareIcon" @click.self="shareToFacebook"></li>
                       <li class="shareIcon" @click.self="shareToTwitter"></li>
                       <li class="shareIcon" @click.self="shareToSina"></li>
                    </ul>
                    <div class="dialog-appStore" v-cloak @click.stop="closeDialog">Cancel</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'sharePop',
  props: ['shareOptions'],
  methods: {
    closeDialog () {
      this.$emit('popup', false)
    },
    shareToSina () {
      const shareUrl = 'http://service.weibo.com/share/share.php?url=' + encodeURIComponent(this.shareOptions.url + '&platform=' + 'sina') +
                                '&title=' + encodeURIComponent(this.shareOptions.title) + '&pic=' + encodeURIComponent(this.shareOptions.pic)
      window.location.href = shareUrl
    },
    shareToTwitter () {
      const shareUrl = 'https://twitter.com/share?u=' + encodeURIComponent(this.shareOptions.url + '&platform=' + 'twitter') +
                                '&t=' + encodeURIComponent(this.shareOptions.title)
      window.location.href = shareUrl
    },
    shareToFacebook () {
      const shareUrl = 'http://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(this.shareOptions.url + '&platform=' + 'facebook') +
                                '&t=' + encodeURIComponent(this.shareOptions.title)
      console.log('分享到dacebook,若是IP地址，会报错的，请使用正式http请求地址，如www.baidu.com')
      window.location.href = shareUrl
    }
  }
}
</script>
<style scoped>
    /* shadow & dialog */
.dialog{
    width:100%;
    padding:0.2rem;
    box-sizing: border-box;
}
.dialog-content{
    background-color: #fff;
    border-radius:0.16rem;
    padding:0 0.54rem;
    text-align: center;
    box-sizing: border-box;
}
.dialog-content .dialog-appStore,.dialog-content .dialog-share{
    padding:0.34rem 0;
    box-sizing: border-box;
    color:rgba(52,100,255,1);
    border-top:rgba(236,240,248,1) solid 0.02rem;
}
.dialog-cancel{
    background-color: #fff;
    border-radius:0.16rem;
    padding:0.3rem 0;
    box-sizing: border-box;
    margin-top:0.1rem;
    text-align: center;
    color:rgba(52,100,255,1);
}
.dialog-share{
    display: flex;
    justify-content:center;
}
.dialog-share .shareIcon{
    width:1rem;
    height:1rem;
    margin:0 0.5rem;
}
.dialog-share .shareIcon:nth-child(1){
    background: url(../../assets/img/facebook@2x.png) 0 0 no-repeat;
    background-size: cover;
}
.dialog-share .shareIcon:nth-child(2){
    background: url(../../assets/img/twitter.png) 0 0 no-repeat;
    background-size: cover;
}
.dialog-share .shareIcon:nth-child(3){
    background: url(../../assets/img/weibo.png) 0 0 no-repeat;
    background-size: cover;
}
</style>
