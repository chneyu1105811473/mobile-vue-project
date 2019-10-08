<template>
  <div class="inputField">
      <p class="title" v-show="value">{{placeholder}}</p>
      <slot name="input">
        <input
        :type="currentType"
        :placeholder="placeholder"
        :value="value"
        class="input"
        @blur="onBlur"
        @input="onInput"
        >
      </slot>
      <slot name="icon">
        <div class="eyeIcon" v-show="value && isPassword" @click.stop="changeInputType">
          <img :src="currentType.includes('password')?eyeIconClose:eyeIconOpen" alt="eye">
        </div>
      </slot>
      <i class="clearBtn" v-show="value&&clear" @click="clearValue">&times;</i>
  </div>
</template>

<script>
import eyeIconOpen from '../assets/img/ic_password visible@2x.png'
import eyeIconClose from '../assets/img/ic_password invisible@2x.png'

export default {
  name: 'InputField',
  props: {
    placeholder: {
      default: 'Username',
      type: String
    },
    value: {
      default: '',
      type: String
    },
    type: {
      default: 'text',
      type: String
    },
    clear: {
      default: true,
      type: Boolean
    }
  },
  computed: {
    isPassword () {
      return !!(this.type.includes('password'))
    }
  },
  data () {
    return {
      currentType: '',
      eyeIconClose: eyeIconClose,
      eyeIconOpen: eyeIconOpen
    }
  },
  created () {
    this.currentType = this.type
  },
  methods: {
    changeInputType () {
      if (this.currentType.includes('password')) {
        this.currentType = 'text'
      } else {
        this.currentType = 'password'
      }
    },
    onBlur (e) {
      this.$emit('blur', e)
    },
    onInput (e) {
      if (e.target.composing) {
        return
      }
      this.$emit('input', e.target.value.replace(/\s*/g, ''))
    },
    clearValue () {
      this.$emit('input', '')
    }
  }
}
</script>

<style lang="stylus" scoped>
.inputField
  position relative
  height 1.15rem
  min-height 1.15rem
  margin 0 .54rem 0.3rem
  padding .2rem .4rem
  box-sizing border-box
  text-align left
  display flex
  align-items center
  flex-wrap wrap
  color rgb(153,153,153)
  background-color rgb(246,247,248)
  border-radius .08rem;
  overflow hidden

.title
  width 100%
  margin 0 0 .08rem
  font-size 0.26rem
  font-family 'Lato', sans-serif
  transition all 200ms

.input
  width 80%
  height .4rem
  font-size .3rem
  color rgb(134,138,139)
  font-family 'Lato', sans-serif
  background-color inherit

.input::placeholder
  color rgb(153,153,153)

.eyeIcon
  position: absolute
  right: 0.2rem
  top: 50%
  transform translateY(-50%)
  width: 0.6rem
  height: 0.36rem
  background-position: 0 0
  background-repeat: no-repeat
  background-size: contain

.clearBtn
  display flex
  width 0.28rem
  height 0.28rem
  line-height 0.28rem
  justify-content center
  border-radius 50%
  background-color #eee
  font-style normal
  font-size 0.26rem
  font-weight bold
  color #fff
</style>
