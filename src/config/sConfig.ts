interface ISConfig {
  // 有药品配送功能?
  isDrugDelivery?: '1';
}

const scJson: {
  [key: string]: ISConfig;
} = {
  1001052: {
    isDrugDelivery: '1',
  },
};

export const getSConfig = (sysCode: string) => {
  return <ISConfig>(scJson[sysCode] || {});
};
