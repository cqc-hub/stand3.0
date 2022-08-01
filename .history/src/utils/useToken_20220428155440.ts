const TokenKey = 'v3_token';
const SysKey = 'v3_sysCode';
const HosIdKey = 'v3_hosId';

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
    return getLocalStorage(SysKey);
}

export function getHosId() {
  return getLocalStorage(HosIdKey);
}

export function setToken(token) {
    return setLocalStorage({ [TokenKey]: token });
}

export function setSysCode(sysCode: string) {
    return setLocalStorage({ [SysKey]: sysCode });
}

export function setHosId(hosId: string) {
  return setLocalStorage({ [HosIdKey]: hosId });
}
 

export function removeLocation(key: string) {
    return uni.removeStorageSync(key);
}



