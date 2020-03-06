import request from '@/utils/request'


export function getBenefitList(data) {
  return request({
    url: '/web/benefit/list',
    method: 'post',
    data
  })
}

export function reviewBenefit(id, status) {
  return request({
    url: `/web/benefit/pass?id=${id}&status=${status}`,
    method: 'get'
  })
}


export function getBaritList(data) {
  return request({
    url: '/web/bar/list',
    method: 'post',
    data
  })
}

export function reviewBar(id, status) {
  return request({
    url: `/web/bar/pass?id=${id}&status=${status}`,
    method: 'get'
  })
}


export function getIxxList(data) {
    return request({
      url: '/web/ixx/list',
      method: 'post',
      data
    })
  }