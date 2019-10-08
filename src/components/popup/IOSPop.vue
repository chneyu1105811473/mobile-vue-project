<template>
  <div class="dialog">
    <div class="dialog-content">
      <div class="dialog-text">
        <slot name="title">
          {{title}}
        </slot>
      </div>
      <div class="dialog-appStore" v-cloak @click.stop="goAppStore">
        <slot name="message">
          {{message}}
        </slot>
      </div>
    </div>
    <div class="dialog-cancel" v-cloak @click.stop='closeDialog'>
      {{cancel}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppCheck',
  data () {
    return {
      title: 'Download the app, open your eyes \n and explore the world.',
      message: 'App store',
      cancel: 'Cancel'
    }
  },
  computed: {
    iosDownloadUrls () {
      return {
        iphoneDownUrl: 'https://itunes.apple.com/app/id1449233544?mt=8', // ios下载地址
        iphoneSchema: 'xplo://' // ios schema url:qsxplo
      }
    }
  },
  methods: {
    goAppStore () { // 进入appstore
      window.location.href = this.iosDownloadUrls.iphoneDownUrl
    },
    closeDialog () {
      this.$emit('popup', false)
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
    box-sizing: border-box;
    text-align: center;
}
.dialog-content .dialog-text{
    padding:0.54rem 0;
    box-sizing: border-box;
    font-size:0.32rem;
    line-height: 0.46rem;
    color:rgba(66,93,144,1);
}
.dialog-content .dialog-appStore{
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
</style>
