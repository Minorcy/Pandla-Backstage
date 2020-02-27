import request from '@/utils/request'

export function getUserList() {
  return request({
    url: '/web/admin/list',
    method: 'get',
  })
}

export function updateUser(params) {
  return request({
    url: '/web/admin/update',
    method: 'post',
    data: params,
  })
}

export function addUser(params) {
  return request({
    url: '/web/admin/add',
    method: 'post',
    data: params

  })
}

export function deleteUser(id) {
  return request({
    url: '/web/admin/delete',
    method: 'get',
    id
  })
}


export function getRoleList() {
  return request({
    url: '/web/role/list',
    method: 'get'
  })
}

export function getRoleInfo() {
  return request({
    url: '/web/role/list',
    method: 'get'

  })
}
