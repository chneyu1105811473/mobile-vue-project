// import axios from 'axios'
export default {
  data () {
    return {
      geo_options: {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 27000
      }
    }
  },
  created () {
    this.getUserLocation()
    this.getLocalStorage()
  },
  methods: {
    getUserLocation () {
      if (navigator.geolocation) {
        // this.watchId = navigator.geolocation.watchPosition(this.showPosition, this.showError, this.geo_options)
        navigator.geolocation.getCurrentPosition(this.showPosition, this.showError, this.geo_options)
      }
    },
    showError (error) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          console.log('定位失败,用户拒绝请求地理定位')
          break
        case error.POSITION_UNAVAILABLE:
          console.log('定位失败,位置信息是不可用')
          break
        case error.TIMEOUT:
          console.log('定位失败,请求获取用户位置超时')
          break
        case error.UNKNOWN_ERROR:
          console.log('定位失败,定位系统失效')
          break
      }
    },
    showPosition (position) {
      console.log(position.coords)
      this.lng = position.coords.longitude
      this.lat = position.coords.latitude
      localStorage.setItem('lng', position.coords.longitude)
      localStorage.setItem('lat', position.coords.latitude)
    },
    getLocalStorage () {
      if (localStorage.getItem('lng') || localStorage.getItem('lat')) {
        this.lng = localStorage.getItem('lng') * 1
        this.lat = localStorage.getItem('lat') * 1
      } else { // 这个是为了避免用户无法获取到当前位置而造成问题
        this.lng = 114
        this.lat = 22
      }
    }
  }
}
