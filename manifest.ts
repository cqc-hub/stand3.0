/// <reference path="./src/index.d.ts" />

import globalGl from './src/config/global';

const fs = require('fs');

const sysInfo: ISystemGlobalConfig = JSON.parse(
  fs.readFileSync('./src/config/config.json')
);

const sysCode = sysInfo.sysCode;
const sysConfig = sysInfo.sysConfig[sysCode];

let manifestFileUrl = `${__dirname}/src/manifest.json`;
let manifestFileData = fs.readFileSync(manifestFileUrl, { encoding: 'utf8' });
// 移除注释
manifestFileData = manifestFileData.replace(/\/\*[\s\S]*?\*\//g, '');

const manifestFileDataObj = JSON.parse(manifestFileData);

const {
  wxAppid,
  alipayAppid,
  name: sysName,
  isOpenHealthCard,
  isOpenOcr,
  medicalMHelp,
} = sysConfig;

const wxConfig = manifestFileDataObj['mp-weixin'];
const aliConfig = manifestFileDataObj['mp-alipay'];
const wxPlugin: any = {};
const aliPlugin: any = {};

if (isOpenHealthCard) {
  // 电子健康卡
  wxPlugin.healthCardPlugins = {
    version: '3.1.15',
    provider: 'wxee969de81bba9a45',
  };
}

if (isOpenOcr) {
  //支付宝ocr插件
  aliPlugin.ocrPlugin = {
    version: '*',
    provider: '2021001130678316',
  };
}

if (medicalMHelp) {
  const { alipay } = medicalMHelp;

  if (alipay) {
    const { type } = alipay;

    if (type === '2') {
      // https://adccloud.yuque.com/adccloud/abilitywarehouse/kc7ro5?#AbvRt
      aliPlugin['auth-pay-plugin'] = {
        version: '*',
        // 正式环境插件ID：2021003147699046
        provider:
          globalGl.env === 'prod' ? '2021003147699046' : '2021003167601013',
      };
    }
  }
}

wxConfig.appid = wxAppid;
aliConfig.appid = alipayAppid;

wxConfig.plugins = wxPlugin;
aliConfig.plugins = aliPlugin;
manifestFileDataObj['mp-weixin'] = wxConfig;
manifestFileDataObj['mp-alipay'] = aliConfig;
manifestFileDataObj['name'] = sysName;

fs.writeFileSync(
  manifestFileUrl,
  JSON.stringify(manifestFileDataObj, null, 2),
  {
    encoding: 'utf8',
  }
);

// -----------------------------------------------s

// const appVueFileUrl = `${__dirname}/src/App.vue`;
// const appVueData = fs.readFileSync(appVueFileUrl, { encoding: 'utf8' });

// console.log(appVueData);
// console.log('-------------');
export {};
