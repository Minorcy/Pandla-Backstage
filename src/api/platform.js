import request from '@/utils/request'

export function getUsersList(data) {
    return request({
      url: '/web/user/list',
      method: 'post',
      data
    })
}

export function updateUsers(uid,status) {
  return request({
    url: `/web/user/isDisable?uid=${uid}&status=${status}`,
    method: 'post'
  })
}

export function openNode(uid,status) {
  return request({
    url:`/web/user/openNode?uid=${uid}&status=${status}`,
    method: 'post'
  })
}

export function searchUsers(account) {
  return request({
    url: `/web/user/queryUser?account=${account}`,
    method: 'get',
    
  })
}



export function getDynList(data) {
  return request({
    url: '/web/dyn/list',
    method: 'post',
    data
  })
}

export function deleteDyn(did) {
  return request({
    url: `/web/dyn/delete/did=${did}`,
    method: 'get'
  })
}