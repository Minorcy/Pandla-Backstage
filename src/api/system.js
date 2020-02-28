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
    url: `/web/admin/delete/${id}`,
    method: 'get',
    
  })
}


export function getRoleList() {
  return request({
    url: '/web/role/list',
    method: 'get'
  })
}

export function updateRole(data) {
  return request({
    url: '/web/role/update',
    method: 'post',
    data
  })
}

export function getRoleInfo(id) {
  return request({
    url: `/web/role/info/${id}`,
    method: 'get'
  })
}

export function deleteRole(id) {
  return request({
    url: `/web/role/delete/${id}`,
    method: 'get',
    
  })
}

export function addRole(data) {
  return request({
    url: '/web/role/add',
    method: 'post',
    data
  })
}



export function getPermissionList() {
  return request({
    url: '/web/permission/list',
    method: 'get'
  })
}

export function addPermission(data) {
  return request({
    url: '/web/permission/add',
    method: 'post',
    data
  })
}

export function updatePermission(data) {
  return request({
    url: '/web/permission/update',
    method: 'post',
    data
  })
}

export function deletePermission(id) {
  return request({
    url: `/web/permission/delete/${id}`,
    method: 'get'
  })
}


export function getDictList() {
  return request({
    url: '/web/dict/list',
    method: 'get'
  })
}

export function addDictn(data) {
  return request({
    url: '/web/dict/add',
    method: 'post',
    data
  })
}

export function updateDict(data) {
  return request({
    url: '/web/dict/update',
    method: 'post',
    data
  })
}

export function deleteDict(data) {
  return request({
    url: `/web/dict/delete`,
    method: 'post',
    data
  })
}