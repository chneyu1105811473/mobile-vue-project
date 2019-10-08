<template>
    <ul class="editPop">
        <li class="editItem" @click.stop="goAddPostPage">
            <span class="iconfont">&#xe612; Add post</span>
        </li>
        <li class="editItem" @click.stop="goEditPage">
            <span class="iconfont">&#xe609; Edit</span>
        </li>
        <li class="editItem" @click.stop="deleteTour">
            <span class="iconfont">&#xe632; Delete</span>
        </li>
    </ul>
</template>

<script>
import {Toast, Dialog} from 'vant'
import {deleteTour} from '@/api/api'

export default {
  name: 'EditTourPop',
  computed: {
    userId () {
      return localStorage.getItem('id')
    }
  },
  methods: {
    goAddPostPage () {
      this.$router.push({
        name: 'ChoosePosts',
        params: {
          tourId: this.$route.params.tourId,
          userId: this.userId
        }
      })
    },
    goEditPage () {
      this.$router.push({
        name: 'TourEdit',
        params: this.$route.params
      })
    },
    deleteTour () {
      this.$emit('close', true)
      Dialog.confirm({
        message: 'Are you sure to delete this album?',
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
        closeOnClickOverlay: true,
        className: 'morePadding'
      }).then(() => { // 确认
        const query = {
          tourId: this.$route.params.tourId
        }
        deleteTour(query).then(res => {
          if (res.data.code === '200') {
            Toast({
              message: 'Delete success!'
            })
            this.$router.push({
              name: 'TourList'
            })
          } else if (res.data.code === '628') {
            Toast({
              message: 'This tour can not be deleted !'
            })
          } else {
            Toast({
              message: res.data.message
            })
          }
        })
      }).catch(() => { // 取消
        console.log('取消')
      })
    }
  }
}
</script>

<style scoped>
.editPop{
    margin: 0 auto;
    padding: 0 .4rem;
    box-sizing:border-box;
    background-color: #fff;
    border-radius:.4rem .4rem 0 0;
}
.editItem{
    padding: .3rem 0;
    text-indent: .1rem;
    color: rgb(153,153,153);
    border-bottom: 0.02rem solid rgb(240,240,240);
}
.editItem:hover{
    color: rgb(66,93,144);
}
</style>
