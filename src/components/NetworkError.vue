<template>
    <div class="networkError">
        <div class="wrongImg">
            <img
            :src="$errorCover"
            alt="some thing went wrong">
        </div>
        <p class="tips">
            Ooops,something went wrong..
        </p>
    </div>
</template>

<script>

export default {
  name: 'NetworkError'
}
</script>

<style scoped>
.tips{
    font-family: 'SFUIDisplay-Regular';
    color: rgb(153,153,153);
    font-size: 0.28rem;
}
</style>
