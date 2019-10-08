<template>
  <keep-alive>
    <router-view :exclude="excludeList"/>
  </keep-alive>
</template>

<script>
export default{
  data () {
    return {
      excludeList: [
        'IconCropper'
      ]
    }
  }
}
</script>
