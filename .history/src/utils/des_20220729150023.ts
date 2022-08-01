import CryptoJS from "crypto-js";

const defaultKey = 'qWeRt4u7'

// AES 加密
export const encryptedAes = (val: string, key1 = defaultKey) => {
  const key = CryptoJS.enc.Utf8.parse(key1)
  let encryptedStr = CryptoJS.AES.encrypt(val, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  }).toString()
  return encryptedStr
}



// aes 解密
export function decrypt(val: string, key = defaultKey) {
  const key1 = CryptoJS.enc.Utf8.parse(key);
  const decrypt = CryptoJS.AES.decrypt(val, key1, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
  return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}

export const useDecryByAes = function (val: string, key = defaultKey) {
  const fValue = decrypt(val, key)
  return JSON.parse(decodeURIComponent(fValue))
}

// DES 加密
export const encryptDes = (message: string, key = defaultKey) => {
  const keyHex = CryptoJS.enc.Utf8.parse(key);
  const encrypted = CryptoJS.DES.encrypt(message, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
};