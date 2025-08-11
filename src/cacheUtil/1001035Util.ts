// import { shadowlib } from './shadowlib/shadowlib.js';
// import {
//   ar_shadow_isbodyencrypt,
//   ar_shadow_publickeyurl,
// } from './shadowlib/config.js';

export const a = () => {
  // @ts-expect-error
  const { shadowlib } = require('./shadowlib/shadowlib.js');

  const { ar_shadow_isbodyencrypt, ar_shadow_publickeyurl } =
    // @ts-expect-error
    require('./shadowlib/shadowlib.js');

  console.log({
    shadowlib,
    ar_shadow_isbodyencrypt,
    ar_shadow_publickeyurl,
  });
  return {
    shadowlib,
    ar_shadow_isbodyencrypt,
    ar_shadow_publickeyurl,
  };
};
