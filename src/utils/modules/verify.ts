export const verifyPhone = (tel: string) => {
  if (tel) {
    return /^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(tel);
  }

  return false;
};
