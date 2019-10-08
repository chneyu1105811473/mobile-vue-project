<template>
    <div class="tourContainer">
        <template v-for="(item,index) in fileList">
            <div
            class="fileItem"
            ref="fileItem"
            :key="index"
            @click="goTourDetail(item.tourDto.id)"
            v-lazy:background-image="item.tourDto.coverImage||$defaultCover"
            >
                <tour-cover :tourItem="item" class="tourCover" :mediaClass="!(index%5)"/>
            </div>
        </template>
    </div>
</template>

<script>
import tourCover from '@/components/TourCover'

export default {
  name: 'TrendingPopular',
  props: ['fileList'],
  components: {tourCover},
  data () {
    return {}
  },
  methods: {
    goTourDetail (id) {
      this.$router.push({
        name: 'TourDetail',
        params: {
          tourId: id
        }
      })
    }
  }
}
</script>

<style scoped>
.tourContainer{
    display: flex;
    flex-wrap: wrap;
    font-family: SFUIDisplay-Medium;
}
.tourContainer .fileItem{
    position: relative;
    margin:1%;
    width: 48%;
    height: 0;
    padding-bottom: 48%;
    border-radius: 0.12rem;
    background-size: cover;
    background-repeat: no-repeat;
    overflow: hidden;
}
.tourContainer .fileItem:nth-child(5n+1){
    width: 100%;
    padding-bottom: 48%;
}
.tourContainer .fileItem:nth-child(5n+2),.fileItem:nth-child(5n){
    padding-bottom: 70%;
}
.tourContainer .fileItem:nth-child(5n){
    margin-top:-21%;
}

</style>
