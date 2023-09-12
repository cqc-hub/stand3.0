/// <reference types="node" />
/// <reference path="./src/index.d.ts" />

import globalGl from './src/config/global';
import { getSConfig } from './src/config/sConfig';

const fs = require('fs');

const sysInfo: ISystemGlobalConfig = JSON.parse(
  fs.readFileSync('./src/config/config.json')
);

const sysCode = sysInfo.sysCode;
const sysConfig = sysInfo.sysConfig[sysCode];
const sConfig = getSConfig(sysCode);

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
  toutiaoAppid
} = sysConfig;

const { medicalMHelp,isOpenAlipayZndz } = sConfig;

const wxConfig = manifestFileDataObj['mp-weixin'];
const aliConfig = manifestFileDataObj['mp-alipay'];
const toutiaoConfig = manifestFileDataObj['mp-toutiao'];
const wxPlugin: any = {};
const aliPlugin: any = {};

if (isOpenHealthCard) {
  // 电子健康卡
  wxPlugin.healthCardPlugins = {
    // version: '3.1.15',
    version: '3.11.0',
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

if(isOpenAlipayZndz){
  //支付宝-分诊插件
  aliPlugin.codePlugin={
    "version": "*", // 目前只支持设置 * 拉取当前上架最新版本
    "provider": "2021003163608051"
  }
}

if (medicalMHelp) {
  const { alipay } = medicalMHelp;

  if (alipay) {
    const { medicalPlugin } = alipay;

    if (medicalPlugin) {
      aliPlugin['auth-pay-plugin'] = {
        version: '*',
        provider:
          globalGl.env === 'prod' ? '2021003147699046' : '2021003167601013',
          // globalGl.env === 'prod' ? '2021003147699046' : '2021003147699046',
      };
    }
  }
}

wxConfig.appid = wxAppid;
aliConfig.appid = alipayAppid;
toutiaoConfig.appid = toutiaoAppid;

wxConfig.plugins = wxPlugin;
aliConfig.plugins = aliPlugin;
manifestFileDataObj['mp-weixin'] = wxConfig;
manifestFileDataObj['mp-alipay'] = aliConfig;
manifestFileDataObj['mp-toutiao'] = toutiaoConfig;
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
