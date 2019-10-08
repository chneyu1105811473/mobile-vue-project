<template>
  <div class="create-dialog">
    <ul class="dialog-content">
      <li class="dialog-title">Album name</li>
      <li class="create-item">
        <div class="tour-input">
            <input type="text" placeholder="Enter album name" autofocus v-model.trim="tourName"/>
        </div>
      </li>
      <li class="create-item">
        <div @click="closeDialog">Cancel</div>
        <slot name="submit" :albumName="tourName">
          <div @click="submit">Submit</div>
        </slot>
      </li>
    </ul>
  </div>
</template>

<script>
import {Toast} from 'vant'
import {addTour} from '@/api/api'
import toLogin from '@/mixins/toLoginMix'

export default {
  name: 'NewTourPop',
  mixins: [toLogin],
  data () {
    return {
      typeIndex: 0, // 默认私有
      tourName: ''
    }
  },
  computed: {
    userId () {
      return localStorage.getItem('id')
    }
  },
  watch: {
    tourName (val) {
      if (val.length > 20) {
        this.tourName = val.slice(0, 20)
        Toast({
          message: 'The length of Tour can not exceed 20'
        })
      }
    }
  },
  methods: {
    closeDialog () {
      this.tourName = ''
      this.$emit('close', true)
    },
    submit () {
      if (!this.tourName) { return false }
      const data = {
        tourName: this.tourName,
        permission: this.typeIndex
      }
      addTour(data).then(res => {
        if (res.data.code === '200') {
          this.$emit('close', true)
          this.$router.push({
            name: 'ChoosePosts',
            params: {
              userId: this.userId,
              tourId: res.data.result.id
            },
            query: this.$route.query
          })
        } else {
          Toast({
            message: res.data.message
          })
        }
      }).catch(err => {
        this.toLogin(err)
      })
    }
  }
}
</script>

<style scoped>
.create-dialog{
    width:100%;
    padding:0.2rem;
    box-sizing: border-box;
    color: rgb(51,51,51);
    font-size: 0.32rem;
}
.dialog-title{
  padding-top: 0.2rem;
}
.dialog-content{
    background-color: #fff;
    border-radius:0.16rem;
    box-sizing: border-box;
    text-align: center;
}
.create-item:last-child{
    padding:0;
    display: flex;
    justify-content: space-around;
    border-bottom:none;
    color: rgb(52,100,255);
}
.create-item:last-child div{
    padding: 0.4rem 0;
    width: 100%;
}
.create-item:last-child div:nth-child(1){
    border-right: 0.02rem solid rgb(236,240,248);
}
.create-item{
    position: relative;
    padding: 0.4rem;
    display: flex;
    justify-content: start;
    align-items: center;
    box-sizing: border-box;
    border-bottom:0.02rem solid rgb(236,240,248);
}
.create-item:first-child{
    padding:0.4rem 0.4rem 0;
}
.create-item:first-child,.create-item:last-child{
    border-bottom: none;
}
.tour-input{
    width: 100%;
    border-radius: 0.2rem;
    overflow: hidden;
}
.tour-input input{
    width: 100%;
    height: 100%;
    padding: 0.2rem 0;
    text-indent: 0.3rem;
    color: rgb(66,93,144);
    background-color: rgb(236,240,248);
}
</style>
