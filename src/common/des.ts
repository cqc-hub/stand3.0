import CryptoJS from 'crypto-js';

const defaultKey = 'qWeRt4u7';

// AES 加密
// export const encryptedAes = (val: string, key1 = defaultKey) => {
//   const key = CryptoJS.enc.Utf8.parse(key1)
//   let encryptedStr = CryptoJS.AES.encryp7t(val, key, {
//     mode: CryptoJS.mode.ECB,
//     padding: CryptoJS.pad.Pkcs7
//   }).toString()
//   return encryptedStr
// }

// // aes 解密
// export function decrypt(val: string, key = defaultKey) {
//   const key1 = CryptoJS.enc.Utf8.parse(key);
//   const decrypt = CryptoJS.AES.decrypt(val, key1, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
//   return CryptoJS.enc.Utf8.stringify(decrypt).toString();
// }

// export const useDecryByAes = function (val: string, key = defaultKey) {
//   const fValue = decrypt(val, key)
//   return JSON.parse(decodeURIComponent(fValue))
// }

// DES 加密
export const encryptDes = (message: string, key = defaultKey) => {
  const keyHex = CryptoJS.enc.Utf8.parse(key);
  const encrypted = CryptoJS.DES.encrypt(message, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
};

// DES解密
export const decryptDes = (ciphertext, key = defaultKey) => {
  const keyHex = CryptoJS.enc.Utf8.parse(key);
  const decrypted = CryptoJS.DES.decrypt(
    {
      ciphertext: CryptoJS.enc.Base64.parse(ciphertext),
    } as any,
    keyHex,
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }
  );
  return decrypted.toString(CryptoJS.enc.Utf8);
};

//公用的Des加密规则方法
export const encryptDesParam = function (query) {
  return encodeURIComponent(encryptDes(JSON.stringify(query)));
};

//公用的Des解密规则方法
export const decryptDesParam = function (query) {
  return JSON.parse(decryptDes(decodeURIComponent(query)));
};

// 页面扫码加解密
const DES_PAGE = 'phsDesKey';
export const encryptForPage = (query: BaseObject) => {
  return encodeURIComponent(encryptDes(JSON.stringify(query), DES_PAGE));
};

export const decryptForPage = (str: string) => {
  const jsonStr = decryptDes(decodeURIComponent(str), DES_PAGE);

  return JSON.parse(jsonStr);
};
