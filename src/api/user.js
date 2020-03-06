import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/web/admin/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/web/admin/info',
    method: 'get',
    data: token
  })
}

export function logout(token) {
  return request({
    url: '/web/admin/logout',
    method: 'get',
    data: token
  })
}
