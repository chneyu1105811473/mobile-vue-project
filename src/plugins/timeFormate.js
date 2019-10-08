// timeFormate.js  wendy 20190104
// 输入time的是剩余生命周期或者时间差（单位毫秒）,createTime是创建时间（单位毫秒）
// 1 时 = 3600秒 1分 = 60秒
export function timeFormate (lifeTime, createTime) {
  let timeObj
  let min, sec, hour, day, year
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const len = new Date(createTime).getMonth()
  lifeTime /= 1000
  if (lifeTime <= 60) {
    timeObj = {'timeStamp': 'just now',
      'life': [{value: '<1', unit: 'MIN'}]
    }
  } else if (lifeTime > 60 && lifeTime <= 3600) {
    min = parseInt(lifeTime / 60)
    sec = parseInt(lifeTime % 60)
    timeObj = {'timeStamp': min + (min > 1 ? ' MINS ago' : ' MIN ago'),
      'life': [{value: min, unit: (min > 1 ? 'MINS' : 'MIN')}, {value: sec, unit: (sec > 1 ? 'SECS' : 'SEC')}]
    }
  } else if (lifeTime > 3600 && lifeTime <= 3600 * 24) {
    hour = parseInt(lifeTime / 3600)
    min = parseInt((lifeTime - hour * 3600) / 60)
    timeObj = {'timeStamp': hour + (hour > 1 ? ' HOURS ago' : 'HOUR ago'),
      'life': [{value: hour, unit: (hour > 1 ? 'HRS' : 'HOUR')}, {value: min, unit: (min > 1 ? 'MINS' : 'MIN')}]
    }
  } else if (lifeTime > 3600 * 24 && lifeTime < 3600 * 24 * 7) {
    day = parseInt(lifeTime / (24 * 3600))
    hour = parseInt((lifeTime - day * 24 * 3600) / 3600)
    timeObj = {'timeStamp': day + (day > 1 ? ' DAYS ago' : ' DAY ago'),
      'life': [{value: day, unit: (day > 1 ? 'DAYS' : 'DAY')}, {value: hour, unit: (hour > 1 ? 'HRS' : 'HOUR')}]
    }
  } else if (lifeTime >= 3600 * 24 * 7 && lifeTime < 3600 * 24 * 365) {
    day = parseInt(lifeTime / (24 * 3600))
    hour = parseInt((lifeTime - day * 24 * 3600) / 3600)
    timeObj = {'timeStamp': `${months[len]} ${new Date(createTime).getDate()}`,
      'life': [{value: day, unit: (day > 1 ? 'DAYS' : 'DAY')}, {value: hour, unit: (hour > 1 ? 'HRS' : 'HOUR')}]
    }
  } else if (lifeTime >= 3600 * 24 * 365) {
    year = parseInt(lifeTime / (24 * 3600 * 365))
    day = parseInt((lifeTime - year * 24 * 3600 * 365) / (24 * 3600))
    timeObj = {'timeStamp': `${months[len]} ${new Date(createTime).getDate()},${new Date(createTime).getYear()}`,
      'life': [{value: year, unit: (year > 1 ? 'YRS' : 'YEAR')}, {value: day, unit: (day > 1 ? 'DAYS' : 'DAY')}]
    }
  }
  return timeObj
}
