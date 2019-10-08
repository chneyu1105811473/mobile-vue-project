<template>
  <ul class="atPeopleList">
    <template v-for="item in list">
      <li class="listItem" :key="item.userId" @click.stop="goProfilePage(item.userId)">
        <div class="userInfo" >
          <div class="userIcon">
            <img v-lazy="item.icon" :alt="item.userName">
          </div>
          <div class="username">{{item.userName}}</div>
        </div>
      </li>
    </template>
  </ul>
</template>

<script>
export default {
  name: 'AtPeopleList',
  props: {
    list: {
      default: function () {
        return []
      },
      type: Array
    }
  },
  methods: {
    goProfilePage (id) {
      const userId = id
      this.$router.push({
        name: 'ProfileDetail',
        params: {
          userId
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.atPeopleList
    margin 0.2rem;
    background-color #ffffff
    border-radius 0.2rem
    max-height 4rem
    overflow auto
.listItem
    padding 0.2rem 0.5rem
    box-sizing border-box
    border-bottom 0.02rem solid #f1f1f1
.listItem:last-child
    border none
.userInfo
    display flex
    align-items center
.userIcon
    width 0.6rem
    height 0.6rem
    border-radius 100%
    overflow hidden
    background-color #f1f1f1
    margin-right 0.2rem
.username
    font-family: 'SFUIDisplay-Medium';
    font-size: 0.28rem;
    color: rgb(51,51,51);
</style>
