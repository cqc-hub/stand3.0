/**
 * 容器为 develop 环境(开发版)下 替换 sysConfig
 */

const config = <const>{
  'person.isSmsVerify': '0',
  'medRecord.0.isCustomPatRecord': '1',
  'order.regListItemCustomButtons.0': {
    env: ['wx'],
    appId: 'wx8735a8a39cf58b5e',
    path: 'pages/index',
    text: '院内导航',
    type: 'otherProgram',
    addition: {
      hosDeptId: 'poi',
    },
    extraData: {
      id: 'RjCFT94AaD',
      appKey: '4l2c52f0jU',
    },
  },
};

export default config;
