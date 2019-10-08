<template>
    <div class="forgetPassword">
        <p class="title">
          Please choose how you <br/> want to reset your password
        </p>
        <router-link :to="{'name':'ForgetPassword','params':{type:0}}" tag="p" class="btn">Via Phone</router-link>
        <router-link :to="{'name':'ForgetPassword','params':{type:1}}" tag="p" class="btn">Via Email</router-link>
        <p class="cancel" @click="hidePopup">CANCEL</p>
    </div>
</template>

<script>
export default {
  name: 'ForgetPasswordPop',
  methods: {
    hidePopup () {
      this.$emit('hidePopup', true)
    }
  }
}
</script>

<style scoped>
/* 修改密码、重置密码 */
.forgetPassword{
    margin:0 1rem;
    padding: 0.4rem 0 0.1rem;
    background-color: #fff;
    border-radius: .2rem;
    font-family: 'Lato', sans-serif
}
.forgetPassword .title{
    text-align: center;
    margin-top:0;
    font-size:0.32rem;
    color:rgb(102,102,102);
}
.forgetPassword .btn{
    font-family: 'Lato', sans-serif;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    margin: 0.3rem auto;
    width:3.2rem;
    height: 0.8rem;
    border:0.02rem solid rgb(134,138,139);
    border-radius: 0.4rem;
    color:rgb(153,153,153);
    font-size: 0.32rem;
}
.forgetPassword .cancel{
    text-align: center;
    color:rgb(26,140,253);
    font-size:0.32rem;
}
</style>
