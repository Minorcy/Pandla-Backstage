import {
  asyncRoutes,
  constantRoutes
} from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = {
      ...route
    }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes

    state.routes = constantRoutes.concat(routes)
    // console.log(state.routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
     
      if (roles.includes('admin')) {
        
        accessedRoutes = asyncRoutes || []
      } else {
        
        // accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
        accessedRoutes = []
       
      }

      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
  // generateRoutes({
  //   commit
  // }, data) {
  //   return new Promise(resolve => {
  //     const {
  //       roles
  //     } = data;
  //     const accessedRouters = asyncRouterMap.filter(v => {
  //       if (roles.indexOf('admin') >= 0) return true;
  //       if (hasPermission(roles, v)) {
  //         if (v.children && v.children.length > 0) {
  //           v.children = v.children.filter(child => {
  //             if (hasPermission(roles, child)) {
  //               return child
  //             }
  //             return false;
  //           });
  //           return v
  //         } else {
  //           return v
  //         }
  //       }
  //       return false;
  //     });
  //     commit('SET_ROUTERS', accessedRouters);
  //     resolve();
  //   })
  // }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
// import { asyncRouterMap, constantRouterMap } from '@/router';

// function hasPermission(roles, route) {
//   if (route.meta && route.meta.role) {
//     return roles.some(role => route.meta.role.indexOf(role) >= 0)
//   } else {
//     return true
//   }
// }

// const permission = {
//   state: {
//     routers: constantRouterMap,
//     addRouters: []
//   },
//   mutations: {
//     SET_ROUTERS: (state, routers) => {
//       state.addRouters = routers;
//       state.routers = constantRouterMap.concat(routers);
//     }
//   },
//   actions: {
//     GenerateRoutes({ commit }, data) {
//       return new Promise(resolve => {
//         const { roles } = data;
//         const accessedRouters = asyncRouterMap.filter(v => {
//           if (roles.indexOf('admin') >= 0) return true;
//           if (hasPermission(roles, v)) {
//             if (v.children && v.children.length > 0) {
//               v.children = v.children.filter(child => {
//                 if (hasPermission(roles, child)) {
//                   return child
//                 }
//                 return false;
//               });
//               return v
//             } else {
//               return v
//             }
//           }
//           return false;
//         });
//         commit('SET_ROUTERS', accessedRouters);
//         resolve();
//       })
//     }
//   }
// };

// export default permission;
