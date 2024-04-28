// /**
//  * base64js
//  * base64js.toByteArray(d.input)
//  * base64js.fromByteArray(c);
//  * 国密SM4加密算法
//  */
  var n = [];
  var o = [];
  var f = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
  var i =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  for (var a = 0, u = i.length; a < u; ++a) {
    n[a] = i[a];
    o[i.charCodeAt(a)] = a;
  }
  o['-'.charCodeAt(0)] = 62;
  o['_'.charCodeAt(0)] = 63;
  function d(r) {
    var e = r.length;
    if (e % 4 > 0) {
      throw new Error('Invalid string. Length must be a multiple of 4');
    }
    return r[e - 2] === '=' ? 2 : r[e - 1] === '=' ? 1 : 0;
  }
  function c(r) {
    return (r.length * 3) / 4 - d(r);
  }
  function v(r) {
    var e, t, n, i, a;
    var u = r.length;
    i = d(r);
    a = new f((u * 3) / 4 - i);
    t = i > 0 ? u - 4 : u;
    var c = 0;
    for (e = 0; e < t; e += 4) {
      n =
        (o[r.charCodeAt(e)] << 18) |
        (o[r.charCodeAt(e + 1)] << 12) |
        (o[r.charCodeAt(e + 2)] << 6) |
        o[r.charCodeAt(e + 3)];
      a[c++] = (n >> 16) & 255;
      a[c++] = (n >> 8) & 255;
      a[c++] = n & 255;
    }
    if (i === 2) {
      n = (o[r.charCodeAt(e)] << 2) | (o[r.charCodeAt(e + 1)] >> 4);
      a[c++] = n & 255;
    } else {
      if (i === 1) {
        n =
          (o[r.charCodeAt(e)] << 10) |
          (o[r.charCodeAt(e + 1)] << 4) |
          (o[r.charCodeAt(e + 2)] >> 2);
        a[c++] = (n >> 8) & 255;
        a[c++] = n & 255;
      }
    }
    return a;
  }
  function l(r) {
    return (
      n[(r >> 18) & 63] +
      n[(r >> 12) & 63] +
      n[(r >> 6) & 63] +
      n[r & 63]
    );
  }
  function h(r, e, t) {
    var n;
    var o = [];
    for (var f = e; f < t; f += 3) {
      n = (r[f] << 16) + (r[f + 1] << 8) + r[f + 2];
      o.push(l(n));
    }
    return o.join('');
  }
  function s(r) {
    var e;
    var t = r.length;
    var o = t % 3;
    var f = '';
    var i = [];
    var a = 16383;
    for (var u = 0, d = t - o; u < d; u += a) {
      i.push(h(r, u, u + a > d ? d : u + a));
    }
    if (o === 1) {
      e = r[t - 1];
      f += n[e >> 2];
      f += n[(e << 4) & 63];
      f += '==';
    } else {
      if (o === 2) {
        e = (r[t - 2] << 8) + r[t - 1];
        f += n[e >> 10];
        f += n[(e >> 4) & 63];
        f += n[(e << 2) & 63];
        f += '=';
      }
    }
    i.push(f);
    return i.join('');
  }
   function fromByteArray(string) {
    return s(string)
  }
 function toByteArray(string) {
    return v(string)
  } 
 
export default {
  fromByteArray,
  toByteArray
}
