import globalGl from '@/config/global';

export const getSrc = (v) => {
  return (
    globalGl.BASE_IMG +
    `${v === '1' ? 'express-logo_sfsy@2x.png' : 'express-logo_ems@2x.png'}`
  );
};
