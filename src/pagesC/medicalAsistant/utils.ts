export const getItemStyle = item => {
  const {
    appointIndicator, // 是否需要预约 0否1是
    disposeStatus, // 1 未执行 2部分执行 3已执行
    isAppoint, // 是否已预约 0否1是
    orderClass, // 1药品 2检验 3检查
    performDeptCode, // 执行科室代码
  } = item;

  const s = {
    mainColor: "var(--hr-brand-color-6)",
    bgColor: "#E9F0FF",
  };

  // if (["2", "3"].includes(orderClass)) {
  // }

  if (["3"].includes(disposeStatus)) {
    s.mainColor = "#00b39e";
    s.bgColor = "#e7fff8";
  }


  return s;
}

export const ORDER_CLASS_MAP = {
  1: '药品',
  2: '检验',
  3: '检查'
}