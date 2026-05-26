/// <reference types="node" />
/// <reference path="./src/index.d.ts" />

import { miniProgramConfig, manifestFileDataObj } from './proConfig';

const fs = require('fs');

let manifestFileUrl = `${__dirname}/src/manifest.json`;
let pagesExportFileUrl = `${__dirname}/src/pages.json`;
const configFileUrl = `${__dirname}/src/config/config.json`;
const dynamicUtilUrl = `${__dirname}/src/utils/dynamicUtil.ts`;
const sysInfo: ISystemGlobalConfig = JSON.parse(fs.readFileSync(configFileUrl));

const sysCode = sysInfo.sysCode;
const sysConfig = miniProgramConfig[sysCode];
const sConfig = sysConfig.sConfig || {};

const {
  wxAppid,
  alipayAppid,
  name: sysName,
  isOpenHealthCard,
  isOpenOcr,
  toutiaoAppid,
} = sysConfig;

const { medicalMHelp, isOpenAlipayZndz, isOpenWechatSI } = sConfig;

const wxConfig = manifestFileDataObj['mp-weixin'];
const aliConfig = manifestFileDataObj['mp-alipay'];
const toutiaoConfig = manifestFileDataObj['mp-toutiao'];
const harmonyConfig = manifestFileDataObj['mp-harmony'];
//主包引入插件
const wxPlugin: any = {};
const aliPlugin: any = {};
//分包引入插件
const pagesPlugins = {
  'pagesA-plugins': { wx: {} as any, ali: {} as any },
  'pagesB-plugins': { wx: {} as any, ali: {} as any },
  'pagesC-plugins': { wx: {} as any, ali: {} as any },
  'pagesG-plugins': { wx: {} as any, ali: {} as any },
};

if (isOpenHealthCard) {
  // 电子健康卡
  pagesPlugins['pagesA-plugins'].wx[`healthCardPlugins`] = {
    // version: '3.50.1',
    version: isOpenHealthCard?.isNewMode ? '3.50.1' : '3.11.0',
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

if (isOpenWechatSI) {
  wxPlugin.SIPlugin = {
    version: '0.3.6',
    provider: 'wx069ba97219f66d99',
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
    const crossProgramBizType = wx?.crossProgramBizType;
    if (crossProgramBizType) {
      wxPlugin.crossProgramPlugins = {
        version: 'latest',
        provider: 'wx12cec70855c0cacf',
      };
    }
  }
}

if (sysCode === '1001094') {
  // https://mp.weixin.qq.com/wxopen/plugindevdoc?appid=wx08b6b6e7153f00e3&token=1520196324&lang=zh_CN#1-
  pagesPlugins['pagesG-plugins'].wx['medicalLetterPlugins'] = {
    version: '1.0.20',
    provider: 'wx08b6b6e7153f00e3',
  };
}

wxConfig.appid = wxAppid;
aliConfig.appid = alipayAppid;
toutiaoConfig.appid = toutiaoAppid;

wxConfig.plugins = wxPlugin;
aliConfig.plugins = aliPlugin;
manifestFileDataObj['mp-weixin'] = wxConfig;
manifestFileDataObj['mp-alipay'] = aliConfig;
manifestFileDataObj['mp-toutiao'] = toutiaoConfig;
manifestFileDataObj['mp-harmony'] = harmonyConfig;
manifestFileDataObj['name'] = sysName;

fs.writeFileSync(
  manifestFileUrl,
  JSON.stringify(manifestFileDataObj, null, 2),
  {
    encoding: 'utf8',
  }
);

fs.writeFileSync(
  configFileUrl,
  JSON.stringify(
    {
      sysCode,
      sysConfig,
    },
    null,
    2
  ),
  {
    encoding: 'utf8',
  }
);

let pagesConfig = fs.readFileSync('./pages.config.json', 'utf8');

Object.entries(pagesPlugins).forEach(([k, v]) => {
  const { wx, ali } = v as any;
  let pluginsStr = ``;
  if (JSON.stringify(wx) !== '{}') {
    pluginsStr += `
    // #ifdef  MP-WEIXIN
    ${JSON.stringify(wx)}
    // #endif
    `;
  }
  if (JSON.stringify(ali) !== '{}') {
    pluginsStr += `
    // #ifdef  MP-ALIPAY
    ${JSON.stringify(ali)}
    // #endif
    `;
  }
  pagesConfig = pagesConfig.replace(
    new RegExp(`"${k}": ""`, 'g'),
    `"plugins":  ${pluginsStr || '{}'}`
  );
});

fs.writeFileSync(pagesExportFileUrl, pagesConfig, {
  encoding: 'utf8',
});

// let dynamicUtilData = `
//   import { shadowlib } from './libshadowesm1001035/shadowlib.js';
//   import uni_modules_libshadowesm_config from './libshadowesm1001035/config.js';
//   console.log(shadowlib);
//   console.log(uni_modules_libshadowesm_config);
//   export {}
// `;

// 利用 treeShank 摆脱不需要的依赖
const dynamicUtilHeaderData: string[] = [];
const dynamicUtilBodyData: string[] = [];
const dynamicUtilFooterData = ['export {};'];

if (sysCode === '1001035') {
  dynamicUtilHeaderData.push(
    "import { shadowlib } from './libshadowesm1001035/shadowlib.js';",
    "import uni_modules_libshadowesm_config from './libshadowesm1001035/config.js';",
    "import { ar_shadow_decodeResponse } from './libshadowesm1001035/decode.js';",
    "import initCtx from './libshadowesm1001035/shadow-init.js';"
  );

  dynamicUtilBodyData.push(
    'shadowlib;',
    'uni_modules_libshadowesm_config;',
    'ar_shadow_decodeResponse;',
    'initCtx;'
  );
}

fs.writeFileSync(
  dynamicUtilUrl,
  [
    '//#ifdef MP-WEIXIN | MP-ALIPAY',
    '\n',
    ...dynamicUtilHeaderData,
    '\n',
    ...dynamicUtilBodyData,
    ...dynamicUtilFooterData,
    '// #end if',
  ].join('\n'),
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
