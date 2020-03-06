import request from '@/utils/request'

export function getHomeData() {
  return request({
    url: '/web/homePage/one',
    method: 'get',
  })
}

export function getlineChartData() {
    return request({
      url: '/web/homePage/two',
      method: 'get',
    })
}

export function getRewardData() {
    return request({
      url: '/web/homePage/three',
      method: 'get',
    })
}

export function getNodeData() {
    return request({
      url: '/web/homePage/four',
      method: 'get',
    })
}


export function getPopupData() {
  return request({
    url: '/web/homePage/popup',
    method: 'get',
  })
}
