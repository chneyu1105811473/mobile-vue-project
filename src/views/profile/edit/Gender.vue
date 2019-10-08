<template>
    <div class="genderSetting">
        <nav-bar>
            <span slot="left" class="iconfont leftIcon" @click="onClickLeft">&#xe65b;</span>
            <span slot="title" class="title">Gender</span>
        </nav-bar>
        <cell-group :border="border" class="genderForm">
            <cell :border="border">
                <div class="gender">
                    <input type="radio" name="gender" v-model="gender" value="0" id="name0">
                    <i></i>
                    <label for="name0">Male</label>
                </div>
            </cell>
            <cell :border="border">
                <div class="gender">
                    <input type="radio" name="gender" v-model="gender" value="1" id="name1">
                    <i></i>
                    <label for="name1">Female</label>
                </div>
            </cell>
            <cell :border="border">
                <div class="gender">
                    <input type="radio" name="gender" v-model="gender" value="2" id="name2">
                    <i></i>
                    <label for="name2">Not specified</label>
                </div>
            </cell>
        </cell-group>
    </div>
</template>

<script>
import {Cell, CellGroup} from 'vant'
import NavBar from '@/components/NavBar'
export default {
  name: 'GenderSetting',
  components: {NavBar, Cell, CellGroup},
  data () {
    return {
      border: false
    }
  },
  computed: {
    gender: {
      get () {
        return this.$store.state.userInfo.gender
      },
      set (val) {
        this.$store.state.userInfo.gender = val
      }

    }
  },
  methods: {
    onClickLeft () {
      this.$router.go(-1)
    }
  }
}
</script>
<style scoped>
[type=radio]{
    padding-bottom: 0;
    opacity: 0;
}
.genderForm{
    margin-top: 0.5rem;
}
.gender{
    display: flex;
    justify-content: start;
    align-items: center;
    padding: 0.3rem;
    font-family: 'Lato', sans-serif;
    font-size: 0.36rem;
}
input + i{
    width:0.44rem;
    height: 0.44rem;
    margin-right: 0.4rem;
    background-image:url(../../../assets/img/icNorCircle@2x.png);
    background-repeat: no-repeat;
    background-position: 0 0;
    background-size: cover;
}
input:checked + i{
    background-image:url(../../../assets/img/icSelCircle@2x.png);
}
input:checked ~ label{
    color:rgb(66,93,144);
}
.leftIcon{
  font-size: 0.5rem;
}
.title{
  font-family: 'Lato', sans-serif;
}
</style>
