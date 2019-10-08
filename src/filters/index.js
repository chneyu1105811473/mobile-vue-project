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

/**
 * 统一数字
 */
const formateNum = (num) => {
  num = num || 0
  if (num >= 1000000000000) {
    return Math.round(num / 1000000000000) + 't'
  } else if (num >= 1000000000) {
    return Math.round(num / 1000000000) + 'b'
  } else if (num >= 1000000) {
    return Math.round(num / 1000000) + 'm'
  } else if (num >= 1000) {
    return Math.round(num / 1000) + 'k'
  } else {
    return num
  }
}

/**
 * Message IM 统一时间
 * yyyy/MM/DD hh:mm ,/MM/DD hh:mm,hh:mm
 */
const timeAndDate = (val) => {
  const time = val * 1000
  const diffTime = new Date().getTime() - time
  const year = new Date(time).getFullYear()
  let month = new Date(time).getMonth() + 1
  let day = new Date(time).getDate()
  let hours = new Date(time).getHours()
  let minutes = new Date(time).getMinutes()
  month = month < 10 ? '0' + month : month
  day = day < 10 ? '0' + day : day
  hours = hours < 10 ? '0' + hours : hours
  minutes = minutes < 10 ? '0' + minutes : minutes
  const unit = hours > 12 ? 'pm' : 'am'
  if (diffTime <= 24 * 3600 * 1000) {
    return `${hours % 12}:${minutes}${unit}`
  } else if (diffTime <= 24 * 3600 * 1000 * 365) {
    return `${month}/${day}, ${hours % 12}:${minutes}${unit}`
  } else {
    return `${year}/${month}/${day}, ${hours % 12}:${minutes}${unit}`
  }
}

/**
 * 时间 本地时间
 * eg:"下午1:53:55"
 */
// const timeFormate = (val) => {
//   const time = new Date().getTime() - val
//   if (time > 24 * 3600 * 1000) {
//     return new Date(val).toLocaleString()
//   } else {
//     return new Date(val).toLocaleTimeString()
//   }
// }

/* 打卡地址 */
const locationFormate = (val) => {
  return val.length > 50 ? val.slice(0, 50) + '...' : val
}

export default{
  formateNum,
  timeAndDate,
  // timeFormate,
  locationFormate,
  createTime
}
