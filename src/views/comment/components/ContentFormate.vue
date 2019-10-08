<template>
  <div class="content">
    <template v-for="(item,index) in atSomeone">
      <template v-if="item.hasAt">
        <span :key="index" class="atSomeOne" @click="handleUsername(item.text)">
          {{item.text}}
        </span>
      </template>
        <template v-else>
          {{item.text}}
        </template>
    </template>
  </div>
</template>

<script>
import {getUserInfoByName} from '@/api/api'
import toLogin from '@/mixins/toLoginMix'
import { Toast } from 'vant'

export default {
  name: 'ContentFormate',
  props: ['content'],
  mixins: [toLogin],
  data () {
    return {
      shortHand: '',
      atSomeone: []
    }
  },
  created () {
    const reg = /@\w+/
    const tempArr = this.content.split(' ')
    tempArr.forEach(item => {
      this.atSomeone.push({
        text: item,
        hasAt: reg.test(item)
      })
    })
  },
  methods: {
    handleUsername (val) {
      const username = val.replace(/@+/, '')
      const query = {
        userName: username
      }
      getUserInfoByName(query).then(res => {
        if (res.data.code === '200') {
          this.$router.push({
            name: 'ProfileDetail',
            params: {
              userId: res.data.result.id
            }
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
.content{
  max-width: 6rem;
  word-break: break-all;
}
.atSomeOne{
  color:rgb(66,93,144);
}
</style>
