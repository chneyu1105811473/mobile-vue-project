<template>
    <div class="fileContainer">
      <template v-if="fileList.length">
        <post-list
        :fileList="fileList"
        :finished="finished"
        :disabled="true"
        @refresh="onRefresh"
        @onLoading="getMoreFilesFn">
          <div slot="choosePost" class="checkBoxContainer" slot-scope="result" v-if="isShow">
              <label :class="{'checkBox':true,'checked':result.props.isSelectedTour}" @click="changePostIndex(result.props)">
                <span class="labelValue">
                  {{checkedList|findIndex(result.props.id) || ''}}
                </span>
                <input type="checkbox" :value="result.props.id" v-model="checkedList"/>
              </label>
          </div>
        </post-list>
      </template>

      <add-post v-if="isEmpty"/>
    </div>
</template>

<script>
import {hotPost} from '@/api/api'
import PostList from '@/components/PostList'
import toLogin from '@/mixins/toLoginMix'
import AddPost from './AddPost'
import {Toast} from 'vant'

export default {
  name: 'ProfileHot',
  mixins: [toLogin],
  props: ['choosePost'],
  components: {PostList, AddPost},
  data () {
    return {
      page: 1,
      pageSize: 12,
      finished: false,
      fileList: [],
      checkedList: [],
      isRefresh: false,
      isEmpty: false
    }
  },
  filters: {
    findIndex (value, arg) {
      if (value.length) {
        let index = value.findIndex(item => item === arg)
        return ++index
      } else {
        return ''
      }
    }
  },
  computed: {
    isShow () {
      return this.choosePost || false
    }
  },
  mounted () {
    this.getHotPost()
  },
  watch: {
    checkedList (val) {
      this.$emit('sendCheckList', this.checkedList)
    }
  },
  methods: {
    getHotPost () {
      const userId = this.$route.params.userId
      if (!userId) { return false }
      const query = {
        userId: userId,
        page: this.page,
        pageSize: this.pageSize
      }
      hotPost(query).then(res => {
        if (res.data.code === '200') {
          if (res.data.result.resultData.length) {
            if (!this.isRefresh) {
              this.fileList.splice(this.fileList.length, 0, ...res.data.result.resultData)
            } else {
              this.fileList.splice(0, this.fileList.length, ...res.data.result.resultData)
            }
            this.isRefresh = false
          }
          this.page++
          if (this.page > res.data.result.totalPageNum) {
            this.finished = true
          } else {
            this.finished = false
          }
        } else {
          Toast({
            message: res.data.message
          })
        }
        this.isEmpty = !(this.fileList.length)
      }).catch(err => {
        this.toLogin(err)
      })
    },
    getMoreFilesFn () {
      this.getHotPost()
    },
    changePostIndex (val) {
      if (!val.isSelectedTour) {
        val.isSelectedTour = true
      } else {
        val.isSelectedTour = false
      }
    },
    onRefresh () {
      this.isRefresh = true
      this.getHotPost()
    }
  }
}
</script>

<style scoped>
/* checkbox */
.checkBoxContainer{
  position: absolute;
  top: 0;
  left:0;
  right:0;
  bottom:0;
}
.checkBox{
  position: relative;
  float: right;
  margin-top: 0.1rem;
  margin-right: 0.1rem;
  width:0.44rem;
  height: 0.44rem;
  background-color: rgba(0,0,0,.2);
  border:0.02rem solid #fff;
  border-radius: 50%;
}
.checkBox.checked{
  background-color:rgb(0,68,197);
}
.checkBox input{
  position: absolute;
  top: 0;
  left:0;
  width: 100%;
  height: 100%;
  opacity: 0;
}
.labelValue{
  position: absolute;
  top: 0;
  left:0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
}
</style>
