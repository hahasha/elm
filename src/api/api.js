import { get } from '@/api/http.js'

// 获取商家信息
export const getSeller = get('/api/seller')

// 获取商品信息
export const getGoods = get('/api/goods')

// 获取评价信息
export const getRatings = get('/api/ratings')
