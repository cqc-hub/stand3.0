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
// let manifestFileData = fs.readFileSync(manifestFileUrl, { encoding: 'utf8' });
// // 移除注释
// manifestFileData = manifestFileData.replace(/\/\*[\s\S]*?\*\//g, '');

const manifestFileDataObj: any = {
  appid: '__UNI__DC06FC7',
  description: '',
  versionName: '1.0.0',
  versionCode: '100',
  transformPx: false,
  'app-plus': {
    usingComponents: true,
    nvueStyleCompiler: 'uni-app',
    compilerVersion: 3,
    splashscreen: {
      alwaysShowBeforeRender: true,
      waiting: true,
      autoclose: true,
      delay: 0,
    },
    modules: {},
    distribute: {
      android: {
        permissions: [
          '<uses-permission android:name="android.permission.CHANGE_NETWORK_STATE"/>',
          '<uses-permission android:name="android.permission.MOUNT_UNMOUNT_FILESYSTEMS"/>',
          '<uses-permission android:name="android.permission.VIBRATE"/>',
          '<uses-permission android:name="android.permission.READ_LOGS"/>',
          '<uses-permission android:name="android.permission.ACCESS_WIFI_STATE"/>',
          '<uses-feature android:name="android.hardware.camera.autofocus"/>',
          '<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>',
          '<uses-permission android:name="android.permission.CAMERA"/>',
          '<uses-permission android:name="android.permission.GET_ACCOUNTS"/>',
          '<uses-permission android:name="android.permission.READ_PHONE_STATE"/>',
          '<uses-permission android:name="android.permission.CHANGE_WIFI_STATE"/>',
          '<uses-permission android:name="android.permission.WAKE_LOCK"/>',
          '<uses-permission android:name="android.permission.FLASHLIGHT"/>',
          '<uses-feature android:name="android.hardware.camera"/>',
          '<uses-permission android:name="android.permission.WRITE_SETTINGS"/>',
        ],
      },
      ios: {},
      sdkConfigs: {},
    },
  },
  quickapp: {},
  'mp-weixin': {
    appid: 'wxe26143481567cb97',
    __usePrivacyCheck__: true,
    setting: {
      urlCheck: false,
      postcss: false,
      minified: true,
      es6: true,
    },
    optimization: {
      subPackages: true,
    },
    permission: {
      'scope.userLocation': {
        desc: '你的位置信息将用于小程序位置接口的效果展示',
      },
    },
    requiredPrivateInfos: ['chooseLocation', 'getLocation', 'chooseAddress'],
    usingComponents: true,
    plugins: {},
    mergeVirtualHostAttributes: true,
    lazyCodeLoading: 'requiredComponents',
    libVersion: 'latest',
  },
  'mp-alipay': {
    component2: true,
    usingComponents: true,
    plugins: {},
    mergeVirtualHostAttributes: true,
    appid: '2021002139602458',
  },
  'mp-baidu': {
    usingComponents: true,
  },
  'mp-toutiao': {
    usingComponents: true,
  },
  uniStatistics: {
    enable: false,
  },
  vueVersion: '3',
  name: '台州市第一人民医院',
  h5: {
    router: {
      base: './',
    },
    sdkConfigs: {
      maps: {
        qqmap: {
          key: 'GH4BZ-SD6L3-2WN3U-3BAE5-7UYIH-3SFRJ',
        },
      },
    },
  },
};

const {
  wxAppid,
  alipayAppid,
  name: sysName,
  isOpenHealthCard,
  isOpenOcr,
  toutiaoAppid,
} = sysConfig;

const { medicalMHelp, isOpenAlipayZndz } = sConfig;

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

if (isOpenAlipayZndz) {
  //支付宝-分诊插件
  aliPlugin.codePlugin = {
    version: '*', // 目前只支持设置 * 拉取当前上架最新版本
    provider: '2021003163608051',
  };
}

if (medicalMHelp) {
  const { alipay, wx } = medicalMHelp;

  if (alipay) {
    const { medicalPlugin } = alipay;
    //  更新医保插件 一定自测下 正式域名 zhyb.ybj.zj.gov.cn 测试域名 zhybyf.ybj.zj.gov.cn
    if (medicalPlugin) {
      aliPlugin['auth-pay-plugin'] = {
        version: '*',
        provider:
          // globalGl.env === 'prod' ? '2021003147699046' : '2021003167601013',
          '2021003147699046',
      };
    }
  }
  if (wx) {
    const crossProgramBizType =wx?.crossProgramBizType;
    if (crossProgramBizType) {
      wxPlugin.crossProgramPlugins = {
        version: 'latest',
        provider: 'wx12cec70855c0cacf',
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
