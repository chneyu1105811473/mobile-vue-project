<template>
    <div class="report">
        <nav-bar>
          <span slot="title" class="title">Report</span>
          <span slot="right" class="rightIcon" @click="onClickRight">Done</span>
        </nav-bar>
        <div class="content">
            <h3 class="title">Thanks for letting us know.</h3>
            <p class="text">We have received your report, and we are dealing with it. Thank you for your feedback</p>
        </div>
    </div>
</template>

<script>
import NavBar from '@/components/NavBar'

export default {
  name: 'ReportSuccess',
  components: {NavBar},
  methods: {
    onClickRight () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.report .content{
    padding:0.2rem;
    box-sizing: border-box;
}
.report .title{
    margin:0.6rem 0;
    font-size: 0.4rem;
    color: rgb(51,51,51);
}
.report .text{
    font-size: 0.28rem;
    color:rgb(153,153,153);
    line-height: 0.4rem;
}
.title{
  font-family: SFUIDisplay-Medium;
}
.rightIcon{
  font-size: 0.3rem;
  color: rgb(66,93,144);
}
</style>
