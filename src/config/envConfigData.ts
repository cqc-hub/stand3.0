import { type TButtonConfig } from '@/utils';

/**
 * 容器为 develop 环境(开发版)下 替换 sysConfig
 */

const config = <const>{
  'person.isSmsVerify': '0',
  // 'order.isOrderPreSettle': '1',
  'medRecord.0.isCustomPatRecord': '1',
  'reportQuery.jyHoverTipBtns': <TButtonConfig[]>[
    {
      text: '复诊预约',
      type: 'self',
      path: 'pagesA/MyRegistration/order',
      addition: {

      },
    },
    {
      text: '咨询医生',
      type: 'self',
      path: 'pagesA/MyRegistration/order',
      addition: {

      },
    },
  ],
};

export default config;
