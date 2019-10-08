<template>
  <div class="empty">
    <div class="welcome">
      <div class="imageCover">
        <div class="icon">
          <img :src="icon" alt="icon">
        </div>
      </div>
      <p class="title text">Welcome to XPLO</p>
      <p class="des text">When you follow people,you'll see the
        <br/> photos and videos they post here.
      </p>
      <div class="findPeopleBtn" @click="goFollowPeoplePage">
        Find people to follow
      </div>
    </div>
  </div>
</template>

<script>
import imgDefaulthead from '@/assets/img/imgDefaulthead@2x.png'

export default {
  name: 'NoDataPage',
  data () {
    return {
      icon: imgDefaulthead
    }
  },
  methods: {
    goFollowPeoplePage () {
      this.$router.push({
        name: 'TrendingSearch',
        query: {
          active: 0
        }
      })
    }
  }
}
</script>

<style scoped>
.welcome{
  padding: 1rem .5rem;
}
.imageCover{
  display: flex;
  justify-content: center;
}
.icon{
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  overflow: hidden;
}
.text{
  text-align: center;
}
.title{
  font-family: SFUIDisplay-Medium;
  font-weight: bold;
  font-size: 0.36rem;
}
.des{
  font-family: SFUIDisplay-Regular;
  font-size: 0.28rem;
  line-height: 0.4rem;
  color: rgb(102,102,102);
}
.findPeopleBtn{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: .5rem;
  width: 100%;
  height: .8rem;
  color: #fff;
  border-radius: .4rem;
  font-size: 0.28rem;
  background: linear-gradient(to right,rgb(54,100,167),rgb(52,147,212));
}
.empty::after{
  content: "";
  display: block;
  height: .2rem;
  background-color: rgb(236,240,248);
}
</style>
