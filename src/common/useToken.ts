import { SYS_CODE } from '@/config/global';
const TokenKey = 'mini_v3_token'
const SysKey = 'mini_v3_sysCode'
const HosIdKey = 'mini_v3_hosId'

export const setLocalStorage = (locals) => {
  if (Array.isArray(locals)) {
    locals.forEach((item) => {
      const key = Object.keys(item)[0]
      uni.setStorage({
        key,
        data: item[key]
      })
    })
  } else {
    Object.keys(locals).map((key) => {
      const value = locals[key]
      uni.setStorage({
        key,
        data: value
      })
    })
  }
}

//用store代替重复同步获取数据
export const getLocalStorage = (key: string) => {
  return uni.getStorageSync(key)
}

export function getToken() {
  return getLocalStorage(TokenKey)
}

export function getSysCode(): string {
  return SYS_CODE
}

export function setToken(token) {
  return setLocalStorage({ [TokenKey]: token })
}


export function removeLocation(key: string) {
  return uni.removeStorageSync(key)
}
