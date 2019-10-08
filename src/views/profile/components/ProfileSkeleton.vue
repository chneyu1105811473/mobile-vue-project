<template>
    <div class="skeleton">
        <!-- header -->
        <div class="header">
            <div class="title"></div>
        </div>
        <!-- userinfo -->
        <div class="profileContainer">
            <div class="userInfo">
                <div class="icon"></div>
                <div class="postContainer"></div>
            </div>
        </div>
        <div class="nickname"></div>
        <div class="introduction"></div>
        <div class="tabs">
            <div class="tab">
                <div class="title"></div>
            </div>
            <div class="tab">
                <div class="title"></div>
            </div>
        </div>
        <div class="files">
            <div v-for="i in 20" :key="i" class="item"></div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'ProfileSkeleton'
}
</script>

<style lang="stylus" scoped>
.skeleton
    height 100%
    overflow hidden
.header
    height  1rem
    border-bottom 0.02rem solid #eeeeee
    display flex
    justify-content center
    align-items center
.title
    width 1.5rem
    height 0.5rem
    background-color #f1f1f1
.profileContainer
    padding 0.3rem 0.15rem 0.1rem
.userInfo
    display flex
    justify-content space-between
.icon
    min-width: 1.7rem;
    width: 1.7rem;
    height: 1.7rem;
    border-radius: 50%;
    overflow: hidden;
    background-color #f1f1f1
.postContainer
    width 100%
    background-color #f1f1f1
    border-radius: 0.1rem;
    margin 0 0.1rem
.nickname
    margin 0.1rem 0.2rem
    width 2rem
    height 0.2rem
    background-color #f1f1f1
.introduction
    margin 0 0.2rem
    height 0.2rem
    background-color #f1f1f1
.tabs
    display flex
    justify-content space-between
    align-items center
.tab
    height 0.8rem
    width: 100%
    display flex
    justify-content center
    align-items center

.tab .title
    width 1.5rem
    height 0.3rem
    background-color #f1f1f1
.tab:nth-child(1)
    border-bottom 0.02rem solid #ccc
.files
    display: flex;
    flex-wrap: wrap;
    max-height: 100%;
    box-sizing: border-box;

.item
    position: relative;
    margin-right: 0.5%;
    margin-bottom:0.5%;
    width:33%;
    height: 0;
    padding-bottom: 33%;
    overflow: hidden;
    background-color #f1f1f1

.item:nth-child(3n){
  margin-right: 0;
}
</style>
