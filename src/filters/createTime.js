import {timeFormate} from '@/plugins/timeFormate'
/**
 * 帖子和评论时间 */
const createTime = (val) => {
  let time
  if (val * 1) {
    time = val < 1000000000000 ? val * 1000 : val
  } else {
    let timezone = new Date().getTimezoneOffset() // 获得时区差，单位为分钟，需要转换成毫秒
    time = new Date(val.replace(/-/g, '/')).getTime() - timezone * 60 * 1000
  }
  let currentTime = new Date().getTime() - time
  return timeFormate(currentTime, time).timeStamp
}

const lifeTime = (val) => {
  let time
  if (val * 1) {
    time = val < 1000000000000 ? val * 1000 : val
  } else {
    let timezone = new Date().getTimezoneOffset() // 获得时区差，单位为分钟，需要转换成毫秒
    time = new Date(val.replace(/-/g, '/')).getTime() - timezone * 60 * 1000
  }
  let currentTime = new Date().getTime() - time
  return timeFormate(currentTime, time).life
}
export default {createTime, lifeTime}
