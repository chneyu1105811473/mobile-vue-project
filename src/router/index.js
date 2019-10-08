import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  // base: '/web/',
  routes: [
    {
      path: '/',
      redirect: '/xplo' // 默认定向到xplo
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/login/SignIn'),
      meta: {
        title: 'Sign in'
      }
    },
    {
      path: '/regionCode',
      name: 'RegionCode',
      component: () => import('@/views/login/RegionCode'),
      meta: {
        title: 'Region code'
      }
    },
    {
      path: '/forgetPassword/type/:type',
      name: 'ForgetPassword',
      component: () => import('@/views/login/ForgetPassword'),
      meta: {
        title: 'Forget password'
      }
    },
    {
      path: '/resetPassword',
      name: 'ResetPassword',
      component: () => import('@/views/login/ResetPassword'),
      meta: {
        title: 'Reset password'
      }
    },
    // sign up
    {
      path: '/signup',
      component: () => import('@/views/signup/index'),
      children: [
        {
          path: 'form',
          name: 'SignUp',
          component: () => import('@/views/signup/SignUp'),
          meta: {
            title: 'Sign up'
          }
        },
        {
          path: 'username',
          name: 'Username',
          component: () => import('@/views/signup/Username'),
          meta: {
            title: 'Sign up'
          }
        }, {
          path: 'birthday',
          name: 'Birthday',
          component: () => import('@/views/signup/Birthday'),
          meta: {
            title: 'Sign up'
          }
        }
      ]
    },
    // profile
    {
      path: '/profile',
      component: () => import('@/views/profile/index'),
      children: [
        {
          path: 'detail/:userId',
          name: 'ProfileDetail',
          component: () => import('@/views/profile/ProfileDetail'),
          meta: {
            title: 'Profile'
          }
        },
        {
          path: 'follow/:userId',
          name: 'PeopleList',
          component: () => import('@/views/profile/PeopleList'),
          meta: {
            title: 'Profile'
          }
        },
        {
          path: 'timelines/:userId',
          name: 'Timelines',
          component: () => import('@/views/profile/TimeLines'),
          meta: {
            title: 'Profile'
          }
        }, {
          path: 'edit',
          component: () => import('@/views/profile/edit/index'),
          children: [
            {
              path: 'info/:userId',
              name: 'ProfileEdit',
              component: () => import('@/views/profile/edit/Edit'),
              meta: {
                title: 'Edit Profile'
              }
            },
            {
              path: 'cropper',
              name: 'IconCropper',
              component: () => import('@/views/profile/edit/IconCropper'),
              meta: {
                title: 'Edit Profile'
              }
            },
            {
              path: 'gender',
              name: 'Gender',
              component: () => import('@/views/profile/edit/Gender'),
              meta: {
                title: 'Edit Profile'
              }
            },
            {
              path: 'region',
              name: 'Region',
              component: () => import('@/views/profile/edit/Region'),
              meta: {
                title: 'Edit Profile'
              }
            }, {
              path: 'tags',
              name: 'Tags',
              component: () => import('@/views/profile/edit/Tag'),
              meta: {
                title: 'Edit Profile'
              }
            }
          ]
        }
      ]
    },
    // setting
    {
      path: '/setting',
      component: () => import('@/views/settings/index'),
      children: [
        {
          path: 'info/:userId',
          name: 'Settings',
          component: () => import('@/views/settings/Settings'),
          meta: {
            title: 'Settings'
          }
        },
        {
          path: 'changePassword_step1',
          name: 'ChangePassword1',
          component: () => import('@/views/settings/ChangePassword_step1'),
          meta: {
            title: 'Settings'
          }
        }, {
          path: 'changePassword_step2',
          name: 'ChangePassword2',
          component: () => import('@/views/settings/ChangePassword_step2'),
          meta: {
            title: 'Settings'
          }
        },
        {
          path: 'connect_step1',
          name: 'Connect1',
          component: () => import('@/views/settings/Connect_step1'),
          meta: {
            title: 'Settings'
          }
        }, {
          path: 'connect_step2',
          name: 'Connect2',
          component: () => import('@/views/settings/Connect_step2'),
          meta: {
            title: 'Settings'
          }
        }
      ]
    },
    // post
    {
      path: '/post',
      component: () => import('@/views/post/index'),
      children: [
        {
          path: 'detail/:postId',
          name: 'PostDetail',
          component: () => import('@/views/post/Detail'),
          meta: {
            title: 'Post'
          }
        },
        {
          path: 'likes/:postId',
          name: 'LikeList',
          component: () => import('@/views/post/LikeList'),
          meta: {
            title: 'Post'
          }
        }
        // {
        //   path: 'publish',
        //   name: 'Publish',
        //   component: () => import('@/views/post/publish'),
        //   meta: {
        //     title: 'Post'
        //   }
        // }, {
        //   path: 'cropper',
        //   name: 'PostCropper',
        //   component: () => import('@/views/post/PostCropper'),
        //   meta: {
        //     title: 'Post'
        //   }
        // }, {
        //   path: 'location',
        //   name: 'PostLocation',
        //   component: () => import('@/views/post/PostLocation'),
        //   meta: {
        //     title: 'Post'
        //   }
        // }, {
        //   path: 'Tag',
        //   name: 'PostTag',
        //   component: () => import('@/views/post/PostTag'),
        //   meta: {
        //     title: 'Post'
        //   }
        // }, {
        //   path: 'edit',
        //   name: 'PostEdit',
        //   component: () => import('@/views/post/PostEdit'),
        //   meta: {
        //     title: 'Post'
        //   }
        // }
      ]
    },
    // tour
    {
      path: '/tours',
      component: () => import('@/views/tour/index'),
      children: [
        {
          path: 'album',
          name: 'Tour',
          component: () => import('@/views/tour/Tours'),
          meta: {
            title: 'Album'
          }
        },
        {
          path: 'detail/:tourId',
          name: 'TourDetail',
          component: () => import('@/views/tour/TourDetail'),
          meta: {
            title: 'Album'
          }
        },
        {
          path: 'edit/:tourId',
          name: 'TourEdit',
          component: () => import('@/views/tour/TourEdit'),
          meta: {
            title: 'Album'
          }
        }
      ]
    },
    // trending
    {
      path: '/trending',
      component: () => import('@/views/trending/index'),
      children: [
        {
          path: 'posts',
          name: 'Trending',
          component: () => import('@/views/trending/Trending'),
          meta: {
            title: 'Trending'
          }
        },
        {
          path: 'search',
          name: 'TrendingSearch',
          component: () => import('@/views/trending/TrendingSearch'),
          meta: {
            title: 'Trending'
          }
        }
      ]
    },
    // im
    {
      path: '/im',
      component: () => import('@/views/IM/index'),
      children: [
        {
          path: 'friends',
          name: 'IMFriends',
          component: () => import('@/views/IM/Friends'),
          meta: {
            title: 'IM'
          }
        },
        {
          path: 'sessions',
          name: 'SessionList',
          component: () => import('@/views/IM/Session'),
          meta: {
            title: 'IM'
          }
        },
        {
          path: 'chat',
          name: 'PrivateChat',
          component: () => import('@/views/IM/Chat'),
          meta: {
            title: 'IM'
          }
        }
      ]
    },
    // comment
    {
      path: '/comment',
      component: () => import('@/views/comment/index'),
      children: [
        {
          path: 'friends',
          name: 'Friends',
          component: () => import('@/views/comment/Friends'),
          meta: {
            title: 'Comment'
          }
        }, {// routId post或者tour的id；commentType post为0，tour为1
          path: ':rootId/type/:commentType',
          name: 'Comment',
          component: () => import('@/views/comment/Comment'),
          meta: {
            title: 'Comment'
          }
        }
      ]
    },
    // report
    {
      path: '/report',
      component: () => import('@/views/report/index'),
      children: [
        {
          path: 'success',
          name: 'ReportSuccess',
          component: () => import('@/views/report/ReportSuccess'),
          meta: {
            title: 'Report'
          }
        },
        {
          path: 'appeal/:userId',
          name: 'Appeal',
          component: () => import('@/views/report/Appeal'),
          meta: {
            title: 'Report'
          }
        },
        {
          path: 'appeal/received/:userId',
          name: 'AppealReceived',
          component: () => import('@/views/report/AppealReceived'),
          meta: {
            title: 'Report'
          }
        }
      ]
    },
    {
      path: '/recommend',
      name: 'Recommend',
      component: () => import('@/views/PeopleRecommend'),
      meta: {
        title: 'Recommed'
      }
    },
    {
      path: '/xplo',
      name: 'Xplo',
      component: () => import('@/views/xplo/Xplo'),
      meta: {
        title: 'Home'
      }
    },
    {
      path: '/myFeed',
      name: 'MyFeed',
      component: () => import('@/views/myFeed/MyFeed'),
      meta: {
        title: 'My feed'
      }
    },
    {
      path: '/choosePosts/user/:userId/tour/:tourId',
      name: 'ChoosePosts',
      component: () => import('@/views/profile/ChoosePosts'),
      meta: {
        title: 'Choose posts'
      }
    },
    {
      path: '/tag/:tagId',
      name: 'TagDetail',
      component: () => import('@/views/tag/TagDetail'),
      meta: {
        title: 'Tag detail'
      }
    },
    {
      path: '/message',
      name: 'Message',
      component: () => import('@/views/message/Message'),
      meta: {
        title: 'Message'
      }
    },
    {
      path: '/feedback',
      name: 'Feedback',
      component: () => import('@/views/Feedback'),
      meta: {
        title: 'Feedback'
      }
    },
    {
      path: '/privacy',
      name: 'XploPrivacy',
      component: () => import('@/views/Privacy'),
      meta: {
        title: 'Privacy'
      }
    },
    {
      path: '/offline',
      name: 'Offline',
      component: () => import('@/views/Offline'),
      meta: {
        title: 'Offline'
      }
    }, {
      path: '*',
      name: '404Page',
      component: () => import('@/views/404'),
      meta: {
        title: '404'
      }
    }
  ]
})
