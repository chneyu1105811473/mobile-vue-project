<template>
    <div class="dialog">
        <div class="overlay"></div>
        <div class="container">
            <slot name="title">
                <div class="title">{{title}}</div>
            </slot>
            <slot name="content">
                <div class="content">{{content}}</div>
            </slot>
            <slot name="buttons">
                <div class="confirmBtn" @click="close">{{confirm}}</div>
            </slot>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Dialog',
  props: {
    title: {
      default: '',
      type: String
    },
    content: {
      default: '',
      type: String
    },
    confirm: {
      default: 'OK',
      type: String
    }
  },
  methods: {
    close () {
      this.$emit('close', true)
    }
  }
}
</script>

<style lang="stylus" scoped>
.container
    position fixed
    z-index 2019
    top 50%
    left 50%
    width 80%
    min-width 40%
    transform translate(-50%,-50%)
    background-color #ffffff
    border-radius 0.2rem
    overflow hidden
.title
    text-align center
    font-family 'Lato', sans-serif
    padding-top 0.5rem
    box-sizing border-box
    color rgb(66,93,144)
.content
    padding 0.4rem 0.6rem 0.5rem
    box-sizing border-box
    font-size 0.28rem
    line-height 0.3rem
    font-family 'Lato', sans-serif
    color rgb(66,93,144)
    border-bottom 0.04rem solid rgb(198,195,205)
.confirmBtn
    font-family 'Lato', sans-serif
    padding .4rem
    box-sizing border-box
    text-align center
    font-size 0.36rem
    color rgb(23,101,255)
.overlay
    position fixed
    z-index 2019
    top 0
    left 0
    bottom 0
    right 0
    background-color rgba(2,18,49,0.6)
</style>
