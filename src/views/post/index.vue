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
        'PostCropper',
        'PostDetail',
        'PostLocationSel',
        'PostTagSel',
        'LikeList'
      ]
    }
  }
}
</script>
