"use strict";
const AR_SHADOW_CRC32 = {};
AR_SHADOW_CRC32.version = "1.2.3";
AR_SHADOW_CRC32.str = crc32_str;
function signed_crc_table() {
  let c = 0, table = new Array(256);
  for (let n = 0; n < 256; ++n) {
    c = n;
    for (let k = 0; k < 8; ++k) {
      c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
    }
    table[n] = c;
  }
  return typeof Int32Array !== "undefined" ? new Int32Array(table) : table;
}
const T0 = signed_crc_table();
function slice_by_16_tables(T) {
  let v = 0, table = typeof Int32Array !== "undefined" ? new Int32Array(4096) : new Array(4096);
  for (let n = 0; n < 256; ++n)
    table[n] = T[n];
  for (let n = 0; n < 256; ++n) {
    v = T[n];
    for (let c = 256 + n; c < 4096; c += 256)
      v = table[c] = v >>> 8 ^ T[v & 255];
  }
  const out = [];
  for (let n = 1; n < 16; ++n)
    out[n - 1] = typeof Int32Array !== "undefined" ? table.subarray(n * 256, n * 256 + 256) : table.slice(n * 256, n * 256 + 256);
  return out;
}
const TT = slice_by_16_tables(T0);
const [T1, T2, T3, T4, T5, T6, T7, T8, T9, Ta, Tb, Tc, Td, Te, Tf] = TT;
function crc32_bstr(bstr, seed = 0) {
  let C = seed ^ -1;
  for (let i = 0, L = bstr.length; i < L; )
    C = C >>> 8 ^ T0[(C ^ bstr.charCodeAt(i++)) & 255];
  return ~C;
}
function crc32_buf(B, seed = 0) {
  let C = seed ^ -1, L = B.length - 15, i = 0;
  for (; i < L; ) {
    C = Tf[B[i++] ^ C & 255] ^ Te[B[i++] ^ C >> 8 & 255] ^ Td[B[i++] ^ C >> 16 & 255] ^ Tc[B[i++] ^ C >>> 24] ^ Tb[B[i++]] ^ Ta[B[i++]] ^ T9[B[i++]] ^ T8[B[i++]] ^ T7[B[i++]] ^ T6[B[i++]] ^ T5[B[i++]] ^ T4[B[i++]] ^ T3[B[i++]] ^ T2[B[i++]] ^ T1[B[i++]] ^ T0[B[i++]];
  }
  L += 15;
  while (i < L)
    C = C >>> 8 ^ T0[(C ^ B[i++]) & 255];
  return ~C;
}
function crc32_str(str, seed = 0) {
  let C = seed ^ -1;
  for (let i = 0, L = str.length, c = 0, d = 0; i < L; ) {
    c = str.charCodeAt(i++);
    if (c < 128) {
      C = C >>> 8 ^ T0[(C ^ c) & 255];
    } else if (c < 2048) {
      C = C >>> 8 ^ T0[(C ^ (192 | c >> 6 & 31)) & 255];
      C = C >>> 8 ^ T0[(C ^ (128 | c & 63)) & 255];
    } else if (c >= 55296 && c < 57344) {
      c = (c & 1023) + 64;
      d = str.charCodeAt(i++) & 1023;
      C = C >>> 8 ^ T0[(C ^ (240 | c >> 8 & 7)) & 255];
      C = C >>> 8 ^ T0[(C ^ (128 | c >> 2 & 63)) & 255];
      C = C >>> 8 ^ T0[(C ^ (128 | d >> 6 & 15 | (c & 3) << 4)) & 255];
      C = C >>> 8 ^ T0[(C ^ (128 | d & 63)) & 255];
    } else {
      C = C >>> 8 ^ T0[(C ^ (224 | c >> 12 & 15)) & 255];
      C = C >>> 8 ^ T0[(C ^ (128 | c >> 6 & 63)) & 255];
      C = C >>> 8 ^ T0[(C ^ (128 | c & 63)) & 255];
    }
  }
  return ~C;
}
AR_SHADOW_CRC32.table = T0;
AR_SHADOW_CRC32.bstr = crc32_bstr;
AR_SHADOW_CRC32.buf = crc32_buf;
// ES6 模块导出
export { AR_SHADOW_CRC32 };

// 也可以使用默认导出
export default AR_SHADOW_CRC32;
// #ifndef H5
exports.AR_SHADOW_CRC32 = AR_SHADOW_CRC32;
// #endif