<template>
  <div class="search">
    <input
    :type="type"
    :placeholder="placeholder"
    :value="value"
    :readonly="readonly"
    @input="onInput"
    @blur="onBlur"
    >
    <div class="clearBtn" @click.stop="clearFn"></div>
  </div>
</template>
<script>
export default {
  name: 'Search',
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
  .search{
    display: flex;
    align-items: center;
    width:100%;
    height:100%;
    padding: 0 0.2rem;
    box-sizing: border-box;
    border-radius: 0.36rem;
    border:0.01rem solid rgb(211,214,222);
    overflow: hidden;
  }
  .search input{
    display: flex;
    align-items: center;
    width:100%;
    height: 100%;
    background-color: transparent;
    padding: 0.2rem;
    box-sizing: border-box;
    color:rgb(102,102,102);
    font-size: 0.24rem;
  }
  .search input::placeholder{
    color:rgb(211,214,222);
  }
  .search::before{
    content: "";
    width:0.44rem;
    min-width: 0.44rem;
    height: 0.44rem;
    background: url(../assets/img/iconSearchGray@2x.png) 0 0 no-repeat;
    background-size: cover;
  }
  .clearBtn{
    margin-top: 0.04rem;
    width:0.44rem;
    min-width: 0.44rem;
    height: 0.44rem;
    background: url(../assets/img/icShutdownGray@2x.png) 0 0 no-repeat;
    background-size: cover;
  }

</style>
