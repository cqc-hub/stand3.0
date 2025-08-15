import globalGl from '@/config/global';

const getKeySuffix = () => {
  return ('0' + new Date().getDate()).slice(-2);
};

export const getQKey = () => {
  return `${globalGl.q}-${getKeySuffix()}`;
};

export const getRKey = () => {
  return `${globalGl.r}-${getKeySuffix()}`;
};
