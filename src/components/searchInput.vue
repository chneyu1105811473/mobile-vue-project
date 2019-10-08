<template>
  <div class="searchInput">
      <input
      :type="type"
      :placeholder="placeholder"
      :value="value"
      :readonly="readonly"
      @input="onInput"
      @blur="onBlur"
      >
      <div class="clearBtn" v-show="clear&&value" @click.stop="clearFn"></div>
  </div>
</template>
<script>
export default {
  name: 'SearchInput',
  props: {
    placeholder: {
      default: '',
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
    readonly: {
      default: false,
      type: Boolean
    },
    clear: {
      default: false,
      type: Boolean
    }
  },
  methods: {
    onInput (e) {
      this.$emit('input', e.target.value.replace(/^\s*|\s*$/, ''))
    },
    onBlur (e) {
      this.$emit('blur', e)
    },
    clearFn () {
      this.$emit('input', '')
    }
  }
}
</script>
<style scoped>
  .searchInput{
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    background-color: #f1f1f1;
    border-radius: 0.36rem;
    overflow: hidden;
  }
  .searchInput input{
    padding-left: 0.1rem;
    width:100%;
    height: 100%;
    font-size: 0.24rem;
    line-height: 0.6rem;
    text-indent: 0.05rem;
    color:rgb(51,51,51);
    background-color: transparent;
  }
  .searchInput input::placeholder{
    color:rgb(153,153,153);
  }
  .searchInput::before{
    content: "";
    margin-left:0.24rem;
    margin-top: 0.02rem;
    width:0.3rem;
    min-width: 0.3rem;
    height: 0.32rem;
    background: url(../assets/img/trendingSearch@2x.png) 0 0 no-repeat;
    background-size: contain;
  }
  .searchInput input:focus{
    color:rgb(51,51,51);
  }
  .clearBtn{
    margin-right:0.2rem;
    width:0.3rem;
    min-width: 0.3rem;
    height: 0.3rem;
    background: url(../assets/img/locationListIconDelete@2x.png) 0 0 no-repeat;
    background-size: cover;
  }

</style>
