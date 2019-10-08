<template>
    <div class="emptyPage">
        <div class="noDataImg">
            <img
            :src="$imgNodata"
             alt="no data image"
            />
        </div>
        <p class="tips">
          <slot name="tip">This page seems to be empty.</slot>
        </p>
    </div>
</template>

<script>
export default {
  name: 'EmptyPage'
}
</script>

<style scoped>
.emptyPage{
    margin:0 auto;
    padding:1rem;
    box-sizing: border-box;
}
.noDataImg{
    width:3.6rem;
    margin:0 auto;
}
.tips{
    font-size: 0.24rem;
    color:rgb(153,153,153);
    text-align: center;
}
</style>
