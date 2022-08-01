import SYS_CODE from '@/config/global'
const TokenKey = 'mini_v3_token';
// const SysKey = 'mini_v3_sysCode';
const HosIdKey = 'mini_v3_hosId';

export const setLocalStorage = (locals) => {
  if (Array.isArray(locals)) {
    locals.forEach(item => {
      const key = Object.keys(item)[0];
      uni.setStorage({
        key,
        data: item[key]
      });
    });
  } else {
    Object.keys(locals).map(key => {
      const value = locals[key];
      uni.setStorage({
        key,
        data: value
      });
    });
  }
};

export const getLocalStorage = (key: string) => {
  return uni.getStorageSync(key);
};

export function getToken(): string {
  return getLocalStorage(TokenKey);
}

export function getSysCode(): string {
  return SYS_CODE;
}

export function getHosId() {
  return getLocalStorage(HosIdKey);
}

export function setToken(token) {
  return setLocalStorage({ [TokenKey]: token });
}

// export function setSysCode(sysCode: string) {
//   return setLocalStorage({ [SysKey]: sysCode });
// }

export function setHosId(hosId: string) {
  return setLocalStorage({ [HosIdKey]: hosId });
}


export function removeLocation(key: string) {
  return uni.removeStorageSync(key);
}



