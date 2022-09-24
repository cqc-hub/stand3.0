interface ISystemGlobalItem {
  wxAppid: string;
  alipayAppid: string;
  h5Appid: string;
}

interface ISystemGlobalConfig {
  sysCode: string;
  sysConfig: {
    [key: string]: ISystemGlobalItem;
  };
}
