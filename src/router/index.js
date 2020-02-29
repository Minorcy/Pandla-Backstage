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
    path: '/system',
    component: Layout,
    redirect: '/system/user',
    name: 'System',
    meta: {
      title: '系统功能',
      icon: 'example'
    },
    children: [{
        path: 'user',
        name: 'User',
        component: () => import('@/views/system/user'),
        meta: {
          title: '用户管理',
          icon: 'table'
        }
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/system/role'),
        meta: {
          title: '角色管理',
          icon: 'table'
        }
      },
      {
        path: 'authority',
        name: 'Authority',
        component: () => import('@/views/system/authority'),
        meta: {
          title: '权限管理',
          icon: 'table'
        }
      },
      {
        path: 'dictionary',
        name: 'Dictionary',
        component: () => import('@/views/system/dictionary'),
        meta: {
          title: '字典管理',
          icon: 'table'
        }
      },
      {
        path: 'token',
        name: 'Token',
        component: () => import('@/views/system/token'),
        meta: {
          title: 'token管理',
          icon: 'table'
        }
      },
      {
        path: 'transfer',
        name: 'Transfer',
        component: () => import('@/views/system/transfer'),
        meta: {
          title: '转账管理',
          icon: 'table'
        }
      }
    ]
  },

  {
    path: '/platform',
    component: Layout,
    redirect: '/platform/users',
    name: 'platform',
    meta: {
      title: '平台管理',
      icon: 'example'
    },
    children: [{
      path: 'users',
      name: 'Users',
      component: () => import('@/views/platform/users'),
      meta: {
        title: '用户列表',
        icon: 'form'
      }
    }, {
      path: 'log',
      name: 'Log',
      component: () => import('@/views/platform/log'),
      meta: {
        title: '日志列表',
        icon: 'form'
      }
    }, {
      path: 'pan',
      name: 'Pan',
      component: () => import('@/views/platform/pan'),
      meta: {
        title: '用户pan',
        icon: 'form'
      }
    }, {
      path: 'force',
      name: 'Force',
      component: () => import('@/views/platform/force'),
      meta: {
        title: '用户原力',
        icon: 'form'
      }
    }, {
      path: 'report',
      name: 'Report',
      component: () => import('@/views/platform/report'),
      meta: {
        title: '举报处理',
        icon: 'form'
      }
    }, {
      path: 'invited',
      name: 'Invited',
      component: () => import('@/views/platform/invited'),
      meta: {
        title: '邀请记录',
        icon: 'form'
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
      icon: 'nested'
    },
    children: [{
        path: 'announcement',
        component: () => import('@/views/internal/announcement'), // Parent router-view
        name: 'Announcement',
        meta: {
          title: '公告列表',
          icon: 'form'
        }
      },
      {
        path: 'pan-task',
        component: () => import('@/views/internal/pan-task'), // Parent router-view
        name: 'Pan Task',
        meta: {
          title: 'pan任务',
          icon: 'form'
        }
      },
      {
        path: 'force-task',
        component: () => import('@/views/internal/force-task'), // Parent router-view
        name: 'Force Task',
        meta: {
          title: '原力任务',
          icon: 'form'
        }
      },
      {
        path: 'planet-convention',
        component: () => import('@/views/internal/planet-convention'), // Parent router-view
        name: 'Planet Convention',
        meta: {
          title: '星球公约',
          icon: 'form'
        }
      },
      {
        path: 'welfare',
        component: () => import('@/views/internal/welfare'), // Parent router-view
        name: 'Welfare',
        meta: {
          title: '公益活动',
          icon: 'form'
        }
      },
      {
        path: 'official-push',
        component: () => import('@/views/internal/official-push'), // Parent router-view
        name: 'Official Push',
        meta: {
          title: '官方消息推送',
          icon: 'form'
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
      icon: 'nested'
    },
    children: [{
        path: 'publication',
        component: () => import('@/views/organization/publication'), // Parent router-view
        name: 'Publication',
        meta: {
          title: '公益组织',
          icon: 'form'
        }
      },
      {
        path: 'bar',
        component: () => import('@/views/organization/bar'), // Parent router-view
        name: 'Bar',
        meta: {
          title: '酒吧管理',
          icon: 'form'
        }
      },
      {
        path: 'ixx',
        component: () => import('@/views/organization/ixx'), // Parent router-view
        name: 'Ixx',
        meta: {
          title: 'ixx',
          icon: 'form'
        }
      },
      {
        path: 'fund-pool',
        component: () => import('@/views/organization/fund-pool'), // Parent router-view
        name: 'Fund Pool',
        meta: {
          title: '公益基金',
          icon: 'form'
        }
      },
    ]
  },
  {
    path: '/advertising',
    component: Layout,
    redirect: '/advertising/index',
    name: 'Advertising',
    meta: {
      title: '广告管理',
      icon: 'nested'
    },
    children: [{
      path: 'index',
      component: () => import('@/views/advertising/index'), // Parent router-view
      name: 'Index',
      meta: {
        title: '广告内容',
        icon: 'form'
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
