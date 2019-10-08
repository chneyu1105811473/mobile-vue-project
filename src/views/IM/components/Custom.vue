<template>
  <div class="custom">
    <div class="bear">
      <img :src="emoji" alt="emoji">
    </div>
  </div>
</template>

<script>
export default {
  name: 'Custom',
  props: {
    custom: {
      default: function () {
        return {}
      },
      type: Object
    }
  },
  data () {
    return {
      emoji: ''
    }
  },
  mounted () {
    if (this.custom.type === 2) {
      try {
        const emoji = require(`@/assets/imEmoji/${this.custom.data.catalogId}/${this.custom.data.cid}@2x.png`)
        this.emoji = emoji
      } catch (err) {
        console.log(err, 'emoji加载失败')
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.bear
    width 1.8rem
    height 1.8rem
    border-radius 0.1rem
    overflow hidden
</style>
