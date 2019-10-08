<template>
  <div class="emoji">
    <div class="emojiContent">
      <!-- 这是当前emoji图标 -->
      <template v-for="(item,index) in currentEmojiData">
        <div class="emojiItem" :key="item.id" @click="selCurrentEmoji(item,index)">
          <template v-if="item.unicode">
            {{item.unicode}}
          </template>
          <template v-else>
            <img :src="getIcon(item.file)" :alt="item.tag">
          </template>
         </div>
      </template>
    </div>
    <div class="emojiChannel">
      <!-- 这里展示图标库的缩略图 -->
      <template v-for="(item,index) in channels">
        <div  :class="{'channelItem':true,'active':item.isCurrent}" :key="index" @click="getCurrentEmoji(item,index)">
          <img :src="getChanelIcon(item.data.info)">
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import emojiObj from '@/assets/imEmoji/emoji'
export default{
  name: 'Emoji',
  data () {
    return {
      emojiObj: emojiObj,
      channels: [],
      currentEmojiData: []
    }
  },
  created () {
    for (let index in this.emojiObj) {
      const item = {
        isCurrent: false,
        name: index,
        data: this.emojiObj[index]
      }
      this.channels.push(item)
      this.channels[0].isCurrent = true
      this.currentEmojiData = this.channels[0].data.data
      this.title = this.channels[0].name
    }
  },
  methods: {
    getCurrentEmoji (obj, i) {
      this.channels.map((item, index) => {
        item.isCurrent = index === i
      })
      this.title = this.channels[i].name
      this.currentEmojiData = obj.data.data
    },
    selCurrentEmoji (item) {
      this.$emit('emoji', item)
    },
    getChanelIcon (info) {
      return require('../../../assets/imEmoji/' + info.title + '/' + info.pressed)
    },
    getIcon (url) {
      return require('../../../assets/imEmoji/' + this.title + '/' + url)
    }
  }
}
</script>

<style lang="stylus" scoped>
img
  object-fit cover

.emoji
  width 100%
  height 4rem

  .emojiContent
    display flex
    flex-wrap wrap
    padding 0.2rem
    box-sizing border-box
    width 100%
    height 3.2rem
    background-color #f0f0f0
    overflow-y auto

    .emojiItem
      max-width 1.3rem;
      max-height 1.3rem;
      font-size 0.5rem
      margin 0.06rem
      border-radius 0.1rem
      overflow hidden

  .emojiChannel
    display flex
    align-items center
    width 100%
    height 0.8rem
    background-color #fff
    border-top 0.02rem solid #eee
    border-bottom 0.02rem solid #eee

  .channelItem
    padding 0.1rem
    box-sizing border-box
    font-size 0.5rem
    width 0.8rem
    height 0.8rem
    display flex
    justify-content center
    align-items center

  .channelItem.active{
    background-color #eee
  }
</style>
