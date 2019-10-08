<!--无网络连接-->
<template>
  <div>
    <div class="offline_box">
      <div class="nofind_box">
        <p class="nofind_title">Unable to connect to the network</p>
        <p class="nofind_text">
          You are currently not connected to the Internet. But
          some of the web pages using PWA, you can continue to access!
        </p>
        <div class="btn_s_box">
          <a class="small_btn" @click="goBackIndex">Back to xplo</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Offline',
  data () {
    return {}
  },
  methods: {
    goBackIndex () {
      this.$store.commit('UPDATE_OfflineShow', false)
    }
  }
}
</script>
<style lang="stylus" scoped>
  .offline_box{
    position: fixed;
    left: 0;
    right: 0;
    bottom:0;
    top:0;
  }
  .nofind_title{
    font-size: 0.32rem;
    color: #999;
    margin-top: 1.5rem;
    text-align:center;
  }
  .nofind_text{
    font-size: 0.28rem;
    color: #C4CDD7;
    margin-top: 0.2rem;
    padding: 0 0.5rem;
  }
  .btn_s_box{
    margin-top:1rem;
    text-align:center;
  }
  .btn_s_box .small_btn{
    background: rgb(26,140,253);
    box-shadow: 0 10px 15px #FFD9CF;
    border-radius: 0.5rem;
    font-size: 0.26rem;
    padding:0.15rem 0.3rem;
    color: #fff;
  }
</style>
