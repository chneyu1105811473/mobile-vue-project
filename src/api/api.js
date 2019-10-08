import request from './request.js'
import Qs from 'qs'

// 获取初始tag列表
export function getTagsList (query) {
  return request({
    url: '/userInfoFillUp/getTagsList',
    method: 'get',
    params: query

  })
}

// 获取xplo的post列表
export function getXploPost (query) {
  return request({
    url: '/xplo',
    method: 'get',
    params: query
  })
}

// 昵称是否被使用过
export function checkNick (query) {
  return request({
    url: '/userInfoFillUp/checkNameUnique',
    method: 'get',
    params: query
  })
}

// 获取推荐的follow people 列表
export function getPeopleList (data) {
  return request({
    url: '/userInfoFillUp/getFollowUserList',
    method: 'post',
    data
  })
}

// 首次注册更新用户信息
export function updateInfo (data) {
  return request({
    url: '/userInfoFillUp/updateInfo',
    method: 'post',
    params: data,
    paramsSerializer: function (params) {
      return Qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}

// 获取用户权限和状态信息
export function getUa (query) {
  return request({
    url: '/profileInfo/',
    method: 'get',
    params: query
  })
}

// 获取tag列表
export function getTagDetail (query) {
  return request({
    url: '/tagDetail/getTagDetail',
    method: 'get',
    params: query
  })
}

// profile:获取推荐的tags  /search/getRecommendTags
export function getRecommendTags (query) {
  return request({
    url: '/search/getRecommendTags',
    method: 'get',
    params: query
  })
}

// profile:获取following的tag列表
export function getFollowingTags (query) {
  return request({
    url: '/profileInfo/getFollowingTags',
    method: 'get',
    params: query
  })
}

// profile:关注，取消tag列表
export function changeTagFollowTypeFn (query) {
  return request({
    url: '/tagDetail/followTag',
    method: 'get',
    params: query
  })
}
// 关注某人
export function followPeople (query) {
  return request({
    url: '/profileInfo/followOne',
    methods: 'get',
    params: query
  })
}
// 取消关注
export function cancelFollowPeople (query) {
  return request({
    url: '/profileInfo/cancelFollow',
    methods: 'get',
    params: query
  })
}
// profile更新用户信息
export function updateProfile (data) {
  return request({
    url: '/profileInfo/updateInfo',
    method: 'post',
    params: data,
    paramsSerializer: function (params) {
      return Qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}

// 文件上传
export function uploadFiles (data, query) {
  return request({
    url: `/coreUploadFile?index=${query.index}&filetime=${query.filetime}`,
    method: 'post',
    data
  })
}

// trending post 按照热度进行排序
export function trendingPost (query) {
  return request({
    url: '/trending/post',
    method: 'get',
    params: query
  })
}
// trending post 按照时间进行排序
export function trendingLatest (query) {
  return request({
    url: '/trending/postsByTime',
    method: 'get',
    params: query
  })
}
// trending post 按照热度进行排序
export function trendingHottest (query) {
  return request({
    url: '/trending/postsByHottest',
    method: 'get',
    params: query
  })
}
// trending tour
export function trendingTour (query) {
  return request({
    url: '/trending/tour',
    method: 'get',
    params: query
  })
}
// tour历史记录
export function tourHistory (query) {
  return request({
    url: '/tour/viewTourHistory',
    method: 'get',
    params: query
  })
}
// 记录观看的tour
export function viewTour (query) {
  return request({
    url: '/tour/viewTour',
    method: 'get',
    params: query
  })
}

// 搜索tour
export function searchTour (query) {
  return request({
    url: '/search/getRecommendTours',
    method: 'get',
    params: query
  })
}

// 搜索pepole
export function searchPeople (query) {
  return request({
    url: '/search/getRecommentPeople',
    method: 'get',
    params: query
  })
}

// 搜索tag
export function searchTag (query) {
  return request({
    url: '/search/getRecommendTags',
    method: 'get',
    params: query
  })
}

// 搜索location
export function searchLocation (query) {
  return request({
    url: '/search/getMemberRecordLocation',
    method: 'get',
    params: query
  })
}

// post详情
export function postDetail (query) {
  return request({
    url: '/postDetail/getPostDetailByPostId',
    method: 'get',
    params: query
  })
}

// post nearby
export function postNearby (data) {
  return request({
    url: '/postDetail/nearBy/v1',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data
  })
}
// 帖子打卡
export function recordLocation (query) {
  return request({
    url: '/postDetail/recordLocation',
    method: 'get',
    params: query
  })
}
// 添加评论
export function addComment (data) {
  return request({
    url: '/comment/add',
    method: 'post',
    data
  })
}

// 评论列表
export function commentList (query) {
  return request({
    url: '/comment/list',
    method: 'get',
    params: query
  })
}

// 查询特殊评论
export function specificCommentList (query) {
  return request({
    url: '/comment/specificList',
    method: 'get',
    params: query
  })
}
// 查询子评论
export function childComment (data) {
  return request({
    url: '/comment/childComment',
    method: 'post',
    data
  })
}

// 举报帖子
export function reportPost (query) {
  return request({
    url: '/postDetail/reportPost',
    method: 'get',
    params: query
  })
}
// 举报用户
export function reportUser (query) {
  return request({
    url: '/profileInfo/report',
    method: 'get',
    params: query
  })
}
// 举报评论
export function reportComment (query) {
  return request({
    url: '/comment/report',
    method: 'get',
    params: query
  })
}
// 帖子点赞和踩
export function likeOrDislikePost (data) {
  return request({
    url: '/postDetail/likeOrDislikePost',
    method: 'post',
    data
  })
}
// 评论点赞
export function like (query) {
  return request({
    url: '/comment/like',
    method: 'get',
    params: query
  })
}

// 评论踩
export function dislike (query) {
  return request({
    url: '/comment/disLike',
    method: 'get',
    params: query
  })
}

// 删除评论
export function deleteComment (query) {
  return request({
    url: '/comment/delete',
    method: 'get',
    params: query
  })
}

// 获取所有的我关注的好友列表
export function getFollowingList (query) {
  return request({
    url: '/post/getAllFollowingMembers',
    method: 'get',
    params: query
  })
}
// 根据username搜索我关注的好友列表
export function searchFollowingList (query) {
  return request({
    url: '/post/getAllFollowingMembersByName',
    method: 'get',
    params: query
  })
}
// 获取互相关注的好友列表
export function getFriends (data) {
  return request({
    url: '/profileInfo/getFriends',
    method: 'post',
    params: data,
    paramsSerializer: function (params) {
      return Qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}

// 根据用户名获取用户信息
export function getUserInfoByName (query) {
  return request({
    url: '/comment/queryUser',
    method: 'get',
    params: query
  })
}

// 根据tagId获取推荐的tag列表
export function getTagDetailWithTrending (query) {
  return request({
    url: '/tagDetail/getTagDetailWithTrending',
    method: 'get',
    params: query
  })
}

// 获取tag nearby
export function tagNearBy (data) {
  return request({
    url: '/postDetail/nearBy',
    method: 'post',
    data
  })
}

// 获取tour列表
export function getMyTours (data) {
  return request({
    url: '/postDetail/getMyTours',
    method: 'post',
    params: data,
    paramsSerializer: function (params) {
      return Qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}

// 用户添加tour
export function addTour (data) {
  return request({
    url: '/postDetail/addTour',
    method: 'post',
    params: data,
    paramsSerializer: function (params) {
      return Qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}

// post 添加到tour
export function saveOrDeleteTour (data) {
  return request({
    url: '/tour/addOrDeletePostTour',
    method: 'post',
    data
  })
}

// 获取like或者dislike
export function getLikeOrDislikeMembers (query) {
  return request({
    url: '/postDetail/getMembers',
    method: 'get',
    params: query
  })
}

// 发布post
export function uploadPost (data) {
  return request({
    url: '/post/uploadPost',
    method: 'post',
    data
  })
}

// 获取用户常用的tag
export function getMemberOftenusePostTags (query) {
  return request({
    url: '/post/getMemberOftenusePostTags',
    method: 'get',
    params: query
  })
}

// 新建tag
export function addTag (query) {
  return request({
    url: '/post/addTag',
    method: 'get',
    params: query
  })
}
// 删除tag
export function deleteTag (query) {
  return request({
    url: '/post/deleteOftenuseTag',
    method: 'get',
    params: query
  })
}
// myfeed
export function myFeed (query) {
  return request({
    url: '/myFeed',
    method: 'get',
    params: query
  })
}

// tour详情
export function tourDetail (query) {
  return request({
    url: '/tour/tourDetail',
    method: 'get',
    params: query
  })
}

// tour详情 post列表
export function tourPost (query) {
  return request({
    url: '/tour/tourPosts',
    method: 'get',
    params: query
  })
}

// 收藏tour
export function saveTour (query) {
  return request({
    url: '/tour/saveTour',
    method: 'get',
    params: query
  })
}

// 删除tour
export function deleteTour (query) {
  return request({
    url: '/tour/deleteTour',
    method: 'get',
    params: query
  })
}
// 分享tour 到myFeed
export function shareTour (query) {
  return request({
    url: '/tour/tourShare',
    method: 'get',
    params: query
  })
}
// 改变tour顺序
export function changeOrder (data) {
  return request({
    url: '/tour/updateTourPostSequence',
    method: 'post',
    data
  })
}
// 获取用户信息
export function getUserInfo (query) {
  return request({
    url: '/profileInfo/',
    method: 'get',
    params: query
  })
}
// 查询用户所有的历史post信息
export function profileHistoryPost (query) {
  return request({
    url: 'profileInfo/historyPost',
    method: 'get',
    params: query
  })
}

// 查询用户根据地图显示的的post信息
export function profileMapPost (query) {
  return request({
    url: '/profileInfo/mapPost',
    method: 'get',
    params: query
  })
}

// profile hot
export function hotPost (query) {
  return request({
    url: '/profileInfo/hotPost',
    method: 'get',
    params: query
  })
}

// 删帖
export function deletePost (query) {
  return request({
    url: '/postDetail/deletePost',
    method: 'get',
    params: query
  })
}

// profile查询tour
export function profileTours (query) {
  return request({
    url: '/tour/profileTours',
    method: 'get',
    params: query
  })
}

// profile查询tour更多
export function profileMoreTours (query) {
  return request({
    url: '/tour/tourList',
    method: 'get',
    params: query
  })
}

// profile 粉丝列表
export function profileFollowers (query) {
  return request({
    url: '/profileInfo/getFollowers',
    method: 'get',
    params: query
  })
}

// profile 关注列表
export function profileFollowing (query) {
  return request({
    url: '/profileInfo/getFollowing',
    method: 'get',
    params: query
  })
}

// 查询profile 粉丝列表
export function searchProfileFollowers (query) {
  return request({
    url: '/profileInfo/searchFollowers',
    method: 'get',
    params: query
  })
}

// 查询profile 关注列表
export function searchProfileFollowing (query) {
  return request({
    url: '/profileInfo/searchFollowing',
    method: 'get',
    params: query
  })
}

// timeLines
export function profileTimelines (query) {
  return request({
    url: '/profileInfo/timeLines',
    method: 'get',
    params: query
  })
}
// block
export function profileBlock (query) {
  return request({
    url: '/profileInfo/block',
    method: 'get',
    params: query
  })
}
// 修改密码
export function changePassword (query) {
  return request({
    url: '/profileInfo/modifyPassword',
    method: 'get',
    params: query
  })
}
// 验证密码是否相同
export function validatePassword (query) {
  return request({
    url: '/profileInfo/validatePassword',
    method: 'get',
    params: query
  })
}
// edit tour
export function updateTour (query) {
  return request({
    url: '/tour/updateTour',
    method: 'get',
    params: query
  })
}

// feedback
export function feedback (data) {
  return request({
    url: '/profileInfo/feedback',
    method: 'post',
    data
  })
}

// send email
export function sendConfirmEmail () {
  return request({
    url: '/profileInfo/account/sendConfirmEmail',
    method: 'get'
  })
}

// 更改绑定
export function connect (query) {
  return request({
    url: '/profileInfo/account/connect',
    method: 'get',
    params: query
  })
}

// 消息
// 查询关注的人的消息
export function getFollowingMessage (query) {
  return request({
    url: '/msg/getFollowingMessage',
    method: 'get',
    params: query
  })
}
// 查询个人消息
export function getMessage (query) {
  return request({
    url: '/msg/getMessage',
    method: 'get',
    params: query
  })
}

// IM
// 查询推荐私聊列表
export function getPrivateChatRecommends (data) {
  return request({
    url: '/privateChat/getPrivateChatRecommends',
    method: 'post',
    params: data,
    paramsSerializer: function (params) {
      return Qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}

// 推荐用户
export function recommendUser (query) {
  return request({
    url: '/profileInfo/recommendUser',
    method: 'get',
    params: query
  })
}
// 推荐用户 带post
export function recommendUserWithPost (query) {
  return request({
    url: '/profileInfo/recommendUserWithPost',
    method: 'get',
    params: query
  })
}

// 聊天室 方形
export function getChatroomListWithCorner (data) {
  return request({
    url: '/chatroom/getChatroomListWithCorner',
    method: 'post',
    params: data,
    paramsSerializer: function (params) {
      return Qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}

// 聊天室 方形
export function getChatroomListWithRadius (data) {
  return request({
    url: '/chatroom/getChatroomListWithRadius',
    method: 'post',
    params: data,
    paramsSerializer: function (params) {
      return Qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}

// 获取系统推荐聊天室列表
export function getRecommendChatroomList (data) {
  return request({
    url: '/chatroom/getRecommendChatroomList',
    method: 'post',
    params: data,
    paramsSerializer: function (params) {
      return Qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}

// 获取推荐的tag
export function getRecommendTagsByCountrycode (data) {
  return request({
    url: '/tag/getRecommendTagsByCountryCode',
    method: 'post',
    params: data,
    paramsSerializer: function (params) {
      return Qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
