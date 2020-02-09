import axios from 'axios'

const ERR_OK = 0  //语义化

export function get(url) {
    return function (params) {
        return axios.get(url, {
            params
        }).then((res) => {
            const { errno, data } = res.data  //解构赋值
            if (errno === ERR_OK) {
                return data
            }
        }).catch((err) => {
            console.log(err)
        })
    }
}
