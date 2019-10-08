<template>
    <keep-alive :exclude="excludeList">
        <router-view/>
    </keep-alive>
</template>

<script>
export default{
  data () {
    return {
      excludeList: [
        'Appeal'
      ]
    }
  }
}
</script>
