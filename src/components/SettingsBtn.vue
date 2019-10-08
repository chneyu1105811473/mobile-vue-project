<template>
  <div :class="{'continueBtn':true,'active':options.isActive}" @click="onClick">
    {{options.name}}
  </div>
</template>
<script>
export default {
  name: 'SettingsBtn',
  props: {
    options: {
      type: Object,
      default: function () {
        return {
          name: 'Continue',
          route: null,
          isActive: false
        }
      }
    }
  },
  methods: {
    onClick () {
      if (this.options.isActive) {
        this.options.route ? this.$router.push(this.options.route) : this.$emit('click', true)
      }
    }
  }
}
</script>
<style scoped>
.continueBtn{
  position: absolute;
  width:5.2rem;
  height:.88rem;
  left:50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  font-family: SFUIDisplay-Medium;
  font-size: 0.4rem;
  align-items: center;
  color:#fff;
  background-color:rgb(130,167,208);
  border-radius:0.5rem;
}
.continueBtn.active{
  background: linear-gradient(to right,rgb(52,147,212),rgb(57,100,167));
}
</style>
