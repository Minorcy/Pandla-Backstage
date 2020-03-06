import request from '@/utils/request'


export function getAdvertList(data) {
  return request({
    url: '/web/advert/list',
    method: 'post',
    data
  })
}


export function addAdvert(data) {
  return request({
    url: '/web/advert/add',
    method: 'post',
    data
  })
}


export function deleteAdvert(id) {
  return request({
    url: `/web/advert/delete/${id}`,
    method: 'get'
  })
}

export function updateAdvert(data) {
  return request({
    url: `/web/advert/update`,
    method: 'post',
    data
  })
}

export function endAdvert(id) {
  return request({
    url: `/web/advert/end/${id}`,
    method: 'get'
  })
}


export function getAdvertTypeList() {
  return request({
    url: '/web/advert/locationList',
    method: 'get'
  })
}

export function addAdvertType(name) {
  return request({
    url: `/web/advert/addLocation?name=${name}`,
    method: 'post'
  })
}

export function updateAdvertType(id, name) {
  return request({
    url: `/web/advert/updateLocation?id=${id}&name=${name}`,
    method: 'post'
  })
}
