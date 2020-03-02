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



export function getDynList(data){ 
  return request({
    url: '/web/dyn/list',
    method: 'post',
    data
  })
}

export function deleteDyn(did) {
  return request({
    url: `/web/dyn/delete/${did}`,
    method: 'get'
  })
}


export function getPanList(data){ 
  return request({
    url: '/web/pan/list',
    method: 'post',
    data
  })
}

export function getUserPan(account){ 
  return request({
    url: `/web/pan/getUserPan?account=${account}`,
    method: 'get'
  })
}

export function transfer(data) {
  return request({
    url: `/web/pan/transfer`,
    method: 'post',
    data
  })
}

export function freezeUserPan(uid,number){ 
  return request({
    url: `/web/pan/freezeUserPan?uid=${uid}&number=${number}`,
    method: 'post'
  })
}

export function unfreezeUserPan(uid,number){ 
  return request({
    url: `/web/pan/unfreezeUserPan?uid=${uid}&number=${number}`,
    method: 'post'
  })
}


export function getForceList(data){ 
  return request({
    url: '/web/force/list',
    method: 'post',
    data
  })
}

export function getUserForce(account){ 
  return request({
    url: `/web/force/getUserForce?account=${account}`,
    method: 'get'
  })
}


export function getReportList(data){ 
  return request({
    url: '/web/report/list',
    method: 'post',
    data
  })
}

export function reviewReport(id,status){ 
  return request({
    url: `/web/pan/unfreezeUserPan?id=${id}&status=${status}`,
    method: 'post'
  })
}

export function confirmDelete(did){ 
  return request({
    url: `/web/pan/deleteDyn/${did}`,
    method: 'post'
  })
}

export function deleteReport(did){ 
  return request({
    url: `/web/pan/deleteDyn?did=${did}`,
    method: 'post'
  })
}


export function getInviteList(data){ 
  return request({
    url: '/web/inv/list',
    method: 'post',
    data
  })
}

export function queryInvite(data,account){ 
  return request({
    url: `/web/inv/list?account=${account}`,
    method: 'post',
    data
  })
}
