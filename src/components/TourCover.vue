<template>
    <div :class="{'userContent':true,'mediaQuery':mediaClass}">
        <p class="tourName">{{tourItem.tourDto.name}}</p>
        <div class="userInfo">
            <div class="userIcon">
                <img v-lazy="tourItem.memberDto.icon" alt="">
            </div>
            <div class="username">{{tourItem.memberDto.username}}</div>
        </div>
        <div class="postNum">
            {{tourItem.tourDto.postNum|formateNum}}
        </div>
    </div>
</template>

<script>
export default {
  name: 'TourCover',
  props: ['tourItem', 'mediaClass']
}
</script>

<style scoped>
img{
    object-fit: cover;
}
.userContent{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 0.16rem 0.1rem;
    box-sizing: border-box;
    font-family: SFUIDisplay-Medium;
    color:#fff;
    background: linear-gradient(to bottom,rgba(0,0,0,0),rgba(0,0,0,0.53));
}
.userContent .tourName{
    width: 80%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-size: 0.28rem;
}
.userInfo{
    display: flex;
    justify-content: start;
    align-items: center;
    font-size: 0.24rem;
}
.userInfo .userIcon{
    width: 0.4rem;
    height: 0.4rem;
    margin-right: 0.1rem;
    border-radius: 50%;
    border:0.02rem solid #fff;
    overflow: hidden;
}
.userIcon img{
    border-radius: 50%;
}
.username{
    width:50%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: clip;
}
.postNum{
    position: absolute;
    display: flex;
    align-items: center;
    right: 0.15rem;
    bottom:0.15rem;
    font-size: 0.24rem;
}
.postNum::before{
    content: "";
    margin-right: 0.05rem;
    width:0.24rem;
    height: 0.28rem;
    background-position:0 0;
    background-repeat:no-repeat;
    background-image: url(../assets/img/ic_post@2x.png);
    background-size: contain;
}
.mediaQuery  .tourName{
    font-size: 0.36rem;
}
.mediaQuery  .userIcon {
    transform: scale(1.5);
    margin: 0.2rem 0.1rem;
}
.mediaQuery  .username{
    margin-left: 0.2rem;
    font-size: 0.3rem;
}
.mediaQuery  .postNum{
    bottom: 0.25rem;
}
.mediaQuery .postNum::before{
    width:0.26rem;
    height: 0.32rem;
    margin-right: 0.1rem;
}
</style>
