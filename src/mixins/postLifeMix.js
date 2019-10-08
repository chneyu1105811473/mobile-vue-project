import {timeFormate} from '@/plugins/timeFormate'

/**
 * 后台返回的时间：
 * 生命周期是毫秒（时间差）
 * 创建时间是0时区是时间，展示时需要加上当地时区
 * **/
export default{
  methods: {
    getPostLife (countDown) { // countDown是毫秒
      return timeFormate(countDown).life
    }
  }
}
