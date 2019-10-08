<template>
    <div class="postTagSel">
      <div class="btnBack iconfont" @click="goBack">&#xe65b;</div>
      <div :class="{'submitBtn':true,'active':isActive}" @click="submit">submit</div>
        <div class="searchContainer">
          <div class="tagBox">
            <div class="addTagInput">
              <input type="text" v-model="tagName" placeholder="Add tag">
              <div class="addIcon" @click="addTagFn">
                <icon :name="tagName?addIconSel:addIcon" size="0.7rem"/>
              </div>
            </div>
          </div>
          <p class="text" v-show="selTagsList.length<1">
            Pick the tags that relate to your post
          </p>
        </div>
      <div class="selTagContainer">
        <div class="tagList">
          <template v-for="(item,index) in selTagsList">
            <div :key="index" class="tagItem bounceInDown" @click="removeTagFn(item)">
              <icon :name="deleteBtn" size="0.4rem" class="deleteIcon" @click.stop="deleteTagFn(item)" v-show="isDelete"/>
              <div class="tagName">
                <span class="capital">{{item.name.charAt(0).toUpperCase()}}</span>
                <span>{{item.name.slice(1)}}</span>
              </div>
              <div class="postAmount">{{item.tagStasticsDto.postAmount|formateNum}}</div>
            </div>
          </template>
        </div>
      </div>
      <div class="filterTags" @click="isDelete = !isDelete" ref="deleteIcon">
        <img :src="deleteIcon" alt="delete icon">
      </div>
      <div class="allTagContainer" :style="{'height':height+'px'}">
        <swipe @change="onchange" class="mySwiper">
          <ul class="pagination" slot="indicator">
            <template  v-for="(item,index) in totalPageNum">
            <li :class="{'pageItem':true,'active':index===swiperIndex}" :key="index"></li>
            </template>
          </ul>
          <swipe-item v-for="(item,swiperIndex) in totalPageNum" :key="swiperIndex">
            <div class="tagList">
              <template v-for="(item,index) in tagsList[swiperIndex]">
                <div
                :key="index"
                class="tagItem bounceInUp"
                @click="chooseTagFn(item)"
                >
                  <icon :name="deleteBtn" size="0.4rem" class="deleteIcon" @click.stop="deleteTagFn(item)" v-show="isDelete"/>
                  <div class="tagName">
                    <span class="capital">{{item.name.charAt(0).toUpperCase()}}</span>
                    <span>{{item.name.slice(1)}}</span>
                  </div>
                  <div class="postAmount">{{item.tagStasticsDto.postAmount|formateNum}}</div>
                </div>
              </template>
            </div>
          </swipe-item>
        </swipe>
      </div>
    </div>
</template>

<script>
import {Icon, Tag, Swipe, SwipeItem, Toast, Dialog} from 'vant'
import addIcon from '@/assets/img/icAddNor@2x.png'
import addIconSel from '@/assets/img/icAddSel@2x.png'
import deleteBtn from '@/assets/img/btnDelete@2x.png'
import deleteIcon from '@/assets/img/icPublicDeleteSel@2x.png'
import {getMemberOftenusePostTags, addTag, deleteTag} from '@/api/api'
import toLogin from '@/mixins/toLoginMix'
import { mapGetters } from 'vuex'

export default {
  name: 'PostTagSel',
  components: {Icon, Tag, Swipe, SwipeItem, Dialog},
  mixins: [toLogin],
  data () {
    return {
      isActive: false,
      addIcon: addIcon,
      addIconSel: addIconSel,
      tagName: '',
      tagsList: [],
      selTagsList: [],
      swiperIndex: 0,
      totalPageNum: 0,
      page: 1,
      width: 375,
      deleteBtn: deleteBtn,
      deleteIcon: deleteIcon,
      isDelete: false,
      height: 300
    }
  },
  computed: {
    ...mapGetters([
      'winHeight'
    ])
  },
  created () {
    this.postTags()
    this.$nextTick(() => {
      this.height = this.winHeight - this.$refs.deleteIcon.getBoundingClientRect().bottom
    })
  },
  watch: {
    selTagsList (val) {
      if (val.length >= 1 && val.length <= 10) {
        this.isActive = true
      } else {
        this.isActive = false
      }
    }
  },
  methods: {
    postTags () { // 获取用户常用的tag
      const query = {
        page: this.page
      }
      getMemberOftenusePostTags(query).then(res => {
        if (res.data.code === '200') {
          this.totalPageNum = res.data.result.totalPageNum
          this.tagsList[this.page - 1] = res.data.result.resultData
          if (this.page < this.totalPageNum) {
            this.page++
            this.postTags()
          }
        } else {
          Toast({
            message: res.data.message
          })
        }
      }).catch(err => {
        this.toLogin(err)
      })
    },
    addTagFn () { // 新建tag
      const query = {
        tagName: this.tagName
      }
      if (this.tagName) {
        addTag(query).then(res => {
          if (res.data.code === '200') {
            const tagStasticsDto = {
              followAmount: 0,
              newsPostAmount: 0,
              playAmount: null,
              postAmount: 0,
              tagName: null,
              tid: null,
              userPostAmount: 0,
              xploPostAmount: 0
            }
            res.data.result.tagStasticsDto = res.data.result.tagStasticsDto || tagStasticsDto
            if (this.selTagsList.length >= 10) {
              Toast({'message': 'You should choose no more than 10 tags'})
              return
            }
            this.selTagsList.push(res.data.result)
            this.tagName = ''
          } else {
            Toast({
              message: res.data.message
            })
          }
        }).catch(err => {
          this.toLogin(err)
        })
      }
    },
    deleteTagFn (item) { // 删除tag
      // 弹出是否删除对话框
      if (!this.isDelete) {
        return false
      }
      Dialog.confirm({
        message: `Are you sure to delete tag: ${item.name}?`,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
        closeOnClickOverlay: true,
        className: 'morePadding'
      }).then(() => { // 确认
        const query = {
          tagId: item.id
        }
        deleteTag(query).then(res => {
        // 弹出确认删除对话框
          if (res.data.code === '200') {
            this.tagsList[this.swiperIndex] = this.tagsList[this.swiperIndex].filter(innerItem => {
              return innerItem.id !== item.id
            })
            this.selTagsList = this.selTagsList.filter(innerItem => {
              return innerItem.id !== item.id
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
    },
    chooseTagFn (item) {
      if (this.selTagsList.length >= 10) {
        Toast({'message': 'You should choose no more than 10 tags'})
        return
      }
      Toast({'message': item.name})
      this.selTagsList.push(item)
      this.tagsList[this.swiperIndex] = this.tagsList[this.swiperIndex].filter(innerItem => {
        return item !== innerItem
      })
    },
    removeTagFn (item) {
      Toast({'message': item.name})
      this.tagsList[this.swiperIndex].push(item)
      this.selTagsList = this.selTagsList.filter(innerItem => {
        return item !== innerItem
      })
    },
    submit () {
      this.$store.state.postData.tagIds = this.selTagsList
      this.$router.replace({
        name: 'Publish'
      })
    },
    goBack () {
      this.$router.replace({
        name: 'Publish'
      })
    },
    onchange (index) {
      this.swiperIndex = index
    }
  }
}
</script>
<style scoped>
.btnBack{
  position: absolute;
  top: .2rem;
  left: .2rem;
  font-size: .5rem;
  z-index: 999;
}
.postTagSel{
  position: relative;
  height: 100%;
  max-height: 100%;
  overflow: hidden;
}
.submitBtn{
  position: absolute;
  top: 0.2rem;
  right: 0.2rem;
  padding: .12rem .3rem;
  border-radius: 0.3rem;
  font-family: SFUIDisplay-Medium;
  background-color: rgb(202,215,236);
  color: #fff;
  font-size: 0.32rem;
  z-index: 2;
}
.submitBtn.active{
  background: linear-gradient(to right,rgb(52,147,212),rgb(54,100,167));
}
.searchContainer{
  position: relative;
  width: 100%;
  background-color: rgb(236,240,248);
  padding-top:1.2rem;
  box-sizing: border-box;
  z-index: 1;
}
.tagBox{
  padding:0 0.3rem;
}
.addTagInput{
  display: flex;
  justify-content:space-between;
  align-items: center;
  height: 1rem;
  border-radius: 0.5rem;
  background-color: #fff;
  overflow: hidden;
}
.addIcon{
  margin-right: 0.2rem;
  max-width: 0.7rem;
}
.addTagInput input{
  width: 100%;
  height: 100%;
  font-size: 0.28rem;
  text-indent: 0.4rem;
}
.text{
  position: absolute;
  width: 100%;
  margin-top: .5rem;
  color: rgb(130,167,208);
  font-family: SFUIDisplay-Regular;
  font-size: 0.28rem;
  text-align: center;
  z-index: 1;
}
.selTagContainer{
  position: relative;
  width: 100%;
  height: 4.5rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items:flex-end;
  background-color: rgb(236,240,248);
  border-radius: 0 0 50% 50%;
  overflow: hidden;
}
.pageItem{
  min-width: 0.16rem;
  min-height: 0.16rem;
  width:0.16rem;
  height: 0.16rem;
  background-color:rgb(202,215,236);
  border-radius: 50%;
}
.active.pageItem{
  min-width: 0.24rem;
  min-height: 0.24rem;
  width:0.24rem;
  height: 0.24rem;
  background-color:rgb(66,93,144);
}
.pagination{
  position: absolute;
  top: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.pagination .pageItem{
  margin: 0 0.1rem;
}
.allTagContainer{
  position: absolute;
  width: 100%;
  height: 4rem;
  bottom: 0;
}
.mySwiper{
  height: 100%;
  width: 100vw;
}
.tagList{
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.tagItem{
  position: relative;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  min-width: 1.4rem;
  width: 1.4rem;
  height: 1.4rem;
  border-radius: 50%;
  font-family:Helvetica;
  font-size: 0.24rem;
  color: #fff;
  background-color:rgb(79,108,249) ;
  background-image:radial-gradient(at 5px 5px,rgba(255,255,255,.9),rgb(128,145,255),rgb(79,108,249));
}
.tagItem .capital{
  font-family: DINAlternate-Bold;
  font-size: 0.48rem;
}
.tagName{
  display: flex;
  align-items: flex-end;
  margin-bottom: 0.1rem;
  width: 0.8rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.postAmount{
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
}
.deleteIcon{
  position: absolute;
  right: 0;
  top: 0;
}
.filterTags{
  margin-left: 90%;
  width: 0.5rem;
  height: 0.38rem;
}
</style>
