import request from '@/utils/request'

export function getUsersList(data) {
    return request({
      url: '/web/user/list',
      method: 'post',
      data
    })
}

 