import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'Home',
      component: () => import('@/views/dashboard/index'),
      meta: {
        title: '首页',
        icon: 'dashboard',
        breadcrumb: false
      }
    }]
  },


  {
    path: '/platform',
    component: Layout,
    redirect: '/platform/users',
    name: 'platform',
    meta: {
      title: '平台管理',
      icon: 'platform'
    },
    children: [{
      path: 'users',
      name: 'Users',
      component: () => import('@/views/platform/users'),
      meta: {
        title: '用户列表',
        icon: 'user'
      }
    }, {
      path: 'log',
      name: 'Log',
      component: () => import('@/views/platform/log'),
      meta: {
        title: '日志列表',
        icon: 'clipboard'
      }
    }, {
      path: 'pan',
      name: 'Pan',
      component: () => import('@/views/platform/pan'),
      meta: {
        title: '用户Pan',
        icon: 'money'
      }
    }, {
      path: 'force',
      name: 'Force',
      component: () => import('@/views/platform/force'),
      meta: {
        title: '用户原力',
        icon: 'example'
      }
    }, {
      path: 'report',
      name: 'Report',
      component: () => import('@/views/platform/report'),
      meta: {
        title: '举报处理',
        icon: 'report'
      }
    }, {
      path: 'invited',
      name: 'Invited',
      component: () => import('@/views/platform/invited'),
      meta: {
        title: '邀请记录',
        icon: 'invited'
      }
    }]
  },

  {
    path: '/internal',
    component: Layout,
    redirect: '/internal/announcement',
    name: 'announcement',
    meta: {
      title: '内容管理',
      icon: 'internal'
    },
    children: [{
        path: 'announcement',
        component: () => import('@/views/internal/announcement'), // Parent router-view
        name: 'Announcement',
        meta: {
          title: '公告列表',
          icon: 'announcement'
        }
      },
      {
        path: 'pan-task',
        component: () => import('@/views/internal/pan-task'), // Parent router-view
        name: 'Pan Task',
        meta: {
          title: 'Pan任务',
          icon: 'pan-task'
        }
      },
      {
        path: 'force-task',
        component: () => import('@/views/internal/force-task'), // Parent router-view
        name: 'Force Task',
        meta: {
          title: '原力任务',
          icon: 'force-task'
        }
      },
      {
        path: 'invitation-poster',
        component: () => import('@/views/internal/invitation-poster'), // Parent router-view
        name: 'Invitation Poster',
        meta: {
          title: '邀请海报',
          icon: 'poster'
        }
      },
      {
        path: 'planet-convention',
        component: () => import('@/views/internal/planet-convention'), // Parent router-view
        name: 'Planet Convention',
        meta: {
          title: '星球公约',
          icon: 'planet'
        }
      },
      {
        path: 'welfare',
        component: () => import('@/views/internal/welfare'), // Parent router-view
        name: 'Welfare',
        meta: {
          title: '公益活动',
          icon: 'welfare'
        }
      },
      {
        path: 'official-push',
        component: () => import('@/views/internal/official-push'), // Parent router-view
        name: 'Official Push',
        meta: {
          title: '官方消息推送',
          icon: 'push'
        }
      },
    ]
  },
  {
    path: '/organization',
    component: Layout,
    redirect: '/organization/publication',
    name: 'organization',
    meta: {
      title: '组织管理',
      icon: 'tree'
    },
    children: [{
        path: 'publication',
        component: () => import('@/views/organization/publication'), // Parent router-view
        name: 'Publication',
        meta: {
          title: '公益组织',
          icon: 'publication'
        }
      },
      {
        path: 'bar',
        component: () => import('@/views/organization/bar'), // Parent router-view
        name: 'Bar',
        meta: {
          title: '酒吧管理',
          icon: 'bar'
        }
      },
      {
        path: 'ixx',
        component: () => import('@/views/organization/ixx'), // Parent router-view
        name: 'Ixx',
        meta: {
          title: 'ixx',
          icon: 'ixx'
        }
      },
      {
        path: 'fund-pool',
        component: () => import('@/views/organization/fund-pool'), // Parent router-view
        name: 'Fund Pool',
        meta: {
          title: '公益基金',
          icon: 'fund-pool'
        }
      },
    ]
  },
  {
    path: '/advertising',
    component: Layout,
    redirect: '/advertising/advertising-list',
    name: 'Advertising',
    meta: {
      title: '广告管理',
      icon: 'advertising'
    },
    children: [{
      path: 'advertising-list',
      component: () => import('@/views/advertising/advertising-list'), // Parent router-view
      name: 'Advertising List',
      meta: {
        title: '广告列表',
        icon: 'advertising-list'
      }
    },{
      path: 'advertising-type',
      component: () => import('@/views/advertising/advertising-type'), // Parent router-view
      name: 'Advertising Type',
      meta: {
        title: '广告类型',
        icon: 'advertising-type'
      }
    }]
  },
  {
    path: 'external-link',
    component: Layout,
    children: [{
      path: 'http://pandla.io/',
      meta: {
        title: "官网链接",
        icon: 'link'
      }
    }]
  },

  // 404 page must be placed at the end !!!
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

export const asyncRoutes=[
  {
    path: '/system',
    component: Layout,
    redirect: '/system/user',
    name: 'System',
    
    meta: {
      title: '系统功能',
      icon: 'component',
      role: ['admin'] 
    },
    children: [{
        path: 'user',
        name: 'User',
        component: () => import('@/views/system/user'),
        meta: {
          title: '用户管理',
          icon: 'peoples',
          roles: ['admin']
        }
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/system/role'),
        meta: {
          title: '角色管理',
          icon: 'role',
          roles: ['admin']
        }
      },
      {
        path: 'authority',
        name: 'Authority',
        component: () => import('@/views/system/authority'),
        meta: {
          title: '权限管理',
          icon: 'authority',
          roles: ['admin']
        }
      },
      {
        path: 'dictionary',
        name: 'Dictionary',
        component: () => import('@/views/system/dictionary'),
        meta: {
          title: '字典管理',
          icon: 'dictionary',
          roles: ['admin']
        }
      },
      {
        path: 'token',
        name: 'Token',
        component: () => import('@/views/system/token'),
        meta: {
          title: 'token管理',
          icon: 'token',
          roles: ['admin']
        }
      },
      {
        path: 'transfer',
        name: 'Transfer',
        component: () => import('@/views/system/transfer'),
        meta: {
          title: '转账管理',
          icon: 'transfer',
          roles: ['admin']
        }
      }
    ]
  },
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
