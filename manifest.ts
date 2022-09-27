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

manifestFileDataObj['mp-weixin']['appid'] = sysConfig.wxAppid;
manifestFileDataObj['mp-alipay']['appid'] = sysConfig.alipayAppid;
manifestFileDataObj['name'] = sysConfig.name;

fs.writeFileSync(manifestFileUrl, JSON.stringify(manifestFileDataObj), {
  encoding: 'utf8'
});

module.exports = {};
