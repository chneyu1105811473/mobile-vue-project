<template>
    <div class="bigButton">
      <slot name="name">{{name}}</slot>
    </div>
</template>

<script>
export default {
  name: 'BigButton',
  props: {
    name: {
      default: 'Sign in',
      type: String
    }
  }
}
</script>

<style lang="stylus" scoped>
.bigButton
    display flex
    justify-content center
    align-items center
    position absolute
    bottom 0
    width 100%
    height 1rem
    color #fff
    font-size 0.38rem
    font-family 'Lato'
    background-color rgb(26,140,253)
    padding-bottom: constant(safe-area-inset-bottom)
    padding-bottom: env(safe-area-inset-bottom)
</style>
