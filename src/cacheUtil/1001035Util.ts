import shadowlib from './shadowlib/shadowlib.js';
import {
  ar_shadow_isbodyencrypt,
  ar_shadow_publickeyurl,
} from './shadowlib/config.js';

export default () => {
  return {
    shadowlib,
    ar_shadow_isbodyencrypt,
    ar_shadow_publickeyurl,
  };
};
