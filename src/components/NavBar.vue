<template>
    <div class="header" :class="{'fixed':fixed}" ref="header">
        <div class="leftNav">
            <slot name="left"/>
        </div>
        <div class="title">
            <slot name="title"/>
        </div>
        <div class="rightNav">
            <slot name="right"/>
        </div>
    </div>
</template>

<script>
export default {
  name: 'NavBar',
  props: {
    fixed: {
      default: true,
      type: Boolean
    }
  },
  mounted () {
    if (this.fixed) {
      this.$refs.header.parentNode.style.paddingTop = '1rem'
      this.$refs.header.parentNode.style.boxSizing = 'border-box'
    }
  }
}
</script>

<style scoped>
.header{
    height: 1rem;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: rgb(51,51,51);
    border-bottom: 0.01rem solid rgb(239,239,244);
}
.header.fixed{
    position: fixed;
    top: 0;
    width: 100%;
    margin: 0 auto;
    z-index: 999;
    background-color: #fff;
}
.leftNav,.rightNav{
    width: 1rem;
}
.leftNav{
    font-size: 0.28rem;
    margin-left: .2rem;
}
.rightNav{
    display: flex;
    justify-content: flex-end;
    margin-right: .25rem;
    font-size: 0.28rem;
    /* color: rgb(66,93,144) */
}
.title{
    font-family: SFUIDisplay-Medium;
    display: flex;
    justify-content: center;
    font-size: 0.36rem;
    width: 100%;
}
</style>
