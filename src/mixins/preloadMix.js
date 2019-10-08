export default{
  data () {
    return {
      images: [
        this.$bear,
        this.$logo,
        this.$imgNodata,
        this.$launchCover
      ]
    }
  },
  created () {
    this.preload()
  },
  methods: {
    preload () {
      for (let i in this.images) {
        const image = new Image()
        image.src = this.images[i]
      }
    }
  }
}
