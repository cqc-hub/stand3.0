/// <reference path="./src/index.d.ts" />

const fs = require('fs');

const sysInfo: ISystemGlobalConfig = JSON.parse(
  fs.readFileSync('./src/config/config.json')
);

const sysCode = sysInfo.sysCode;
const sysConfig = sysInfo.sysConfig[sysCode];

// manifest.json 路径
let manifestFileUrl = `${__dirname}/src/manifest.json`;
// 读取文件数据
let manifestFileData = fs.readFileSync(manifestFileUrl, { encoding: 'utf8' });
// 移除注释
manifestFileData = manifestFileData.replace(/\/\*[\s\S]*?\*\//g, '');

let manifestFileDataObj = JSON.parse(manifestFileData);
sysConfig.isOpenHealthCard;
const { wxAppid, alipayAppid, name: sysName, isOpenHealthCard } = sysConfig;

const wxConfig = manifestFileDataObj['mp-weixin'];
const aliConfig = manifestFileDataObj['mp-alipay'];
const wxPlugin: any = {};
const aliPlugin: any = {
  // ocr
  ocrPlugin: { version: '*', provider: '2021001130678316' },
};

if (isOpenHealthCard) {
  // 电子健康卡
  wxPlugin.healthCardPlugins = {
    version: '3.1.5',
    provider: 'wxee969de81bba9a45',
  };
}

wxConfig.appid = wxAppid;
aliConfig.appid = alipayAppid;

wxConfig.plugins = wxPlugin;
aliConfig.plugins = aliPlugin;
manifestFileDataObj['mp-weixin'] = wxConfig;
manifestFileDataObj['mp-alipay'] = aliConfig;
manifestFileDataObj['name'] = sysName;

fs.writeFileSync(manifestFileUrl, JSON.stringify(manifestFileDataObj), {
  encoding: 'utf8',
});

module.exports = {};
