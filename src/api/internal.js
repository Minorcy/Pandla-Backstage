import request from '@/utils/request'


export function getBriefList() {
    return request({
      url: '/web/brief/list',
      method: 'get'
      
    })
}

export function addBrief(data) {
    return request({
      url: '/web/brief/add',
      method: 'post',
      data
    })
}

export function deleteBrief(id) {
    return request({
      url: `/web/brief/delete/${id}`,
      method: 'get',
    })
}

export function updateBrief(data) {
    return request({
      url: '/web/brief/update',
      method: 'post',
      data
    })
}


export function getTaskList() {
    return request({
      url: '/web/task/list',
      method: 'get'
      
    })
}

export function addTask(data) {
    return request({
      url: '/web/task/add',
      method: 'post',
      data
    })
}

export function deleteTask(id,status) {
    return request({
      url: `/web/task/delete/${id}?status=${status}`,
      method: 'post',
    })
}

export function updateTask(data) {
    return request({
      url: '/web/task/update',
      method: 'post',
      data
    })
}



export function getDonateList(data) {
    return request({
      url: '/web/pan/poll/getDonateList',
      method: 'post',
      data
    })
}


export function getPollActivity() {
    return request({
      url: '/web/pan/poll/getPollActivity',
      method: 'get'
    })
}

export function endActivity(id) {
  return request({
    url: `/web/pan/poll/endActivity/${id}`,
    method: 'get'
  })
}

export function updateActivity(data) {
  return request({
    url: '/web/pan/poll/updateActivity',
    method: 'post',
    data
  })
}


export function getInvImgList() {
  return request({
    url: '/web/inv/getInvImgList',
    method: 'get'
  })
}

export function addInvImg(url) {
  return request({
    url: `/web/inv/addInvImg?url=${url}`,
    method: 'post'
  })
}

export function deleteInvImg(id) {
  return request({
    url: `/web/inv/deleteInvImg/${id}`,
    method: 'get'
  })
}