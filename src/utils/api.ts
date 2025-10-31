import axios from 'axios'

const ETHERSCAN_API_KEY = '7MY58AURKV136HZ5AM9WXC2QYA542ZTPGC'

export const etherscanApi = axios.create({
  baseURL: 'https://api.etherscan.io/v2/api',
  params: {
    apikey: ETHERSCAN_API_KEY,
  },
})

export const coingeckoApi = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
})