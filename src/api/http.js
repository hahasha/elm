import axios from 'axios'

const urlMap = {
  development: 'http://localhost:8080',
  production: '/'
}

const baseUrl = urlMap[process.env.NODE_ENV]
const ERR_OK = 0

/**
 * get方法，对应get请求
 */
// export function get (url, param) {
//   return new Promise((resolve, reject) => {
//     axios.get(baseUrl + url, { param })
//       .then(res => {
//         resolve(res.data)
//       })
//       .catch(err => {
//         reject(err)
//       })
//   })
// }
export function get (url) {
  return function (params = {}) {
    return axios.get(baseUrl + url, {
      params
    }).then((res) => {
      const { errno, data } = res.data
      if (errno === ERR_OK) {
        return data
      }
    }).catch((e) => {
    })
  }
}
