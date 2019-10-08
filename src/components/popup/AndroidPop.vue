<template>
    <!-- android notice -->
    <div class="dialog">
        <div class="dialog-content">
            <div class="dialog-text android">
                <span>Only available on the IOS software,<br/>Android coming soon.</span>
            </div>
        </div>
        <div class="dialog-cancel" v-cloak @click.stop='closeDialog'>Cancel</div>
    </div>
</template>

<script>
export default {
  name: 'AndroidPop',
  methods: {
    closeDialog () {
      this.$emit('popup', false)
    }
  }
}
</script>

<style scoped>
    /* shadow & dialog */
.dialog{
    width:100%;
    padding:0.2rem;
    box-sizing: border-box;
    z-index: 10000;
}
.dialog-content{
    background-color: #fff;
    border-radius:0.16rem;
    padding:0 0.54rem;
    text-align: center;
    box-sizing: border-box;
}
.dialog-content .dialog-text{
    padding:0.54rem 0;
    box-sizing: border-box;
    font-size:0.32rem;
    line-height: 0.46rem;
    color:rgba(66,93,144,1);
}
.dialog-content .dialog-text.android{
    padding:1rem 0;
    box-sizing: border-box;
}
.dialog-cancel{
    background-color: #fff;
    border-radius:0.16rem;
    padding:0.3rem 0;
    box-sizing: border-box;
    margin-top:0.1rem;
    text-align: center;
    color:rgba(52,100,255,1);
}
</style>
