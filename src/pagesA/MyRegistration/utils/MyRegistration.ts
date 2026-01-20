import { orderStatusMap, OrderStatus } from './regDetail';
import { joinQuery } from '../../../common/utils';
import { getSysCode } from '@/common';

export type IRegistrationCardItem = {
  sysCode: string;
  hosData?: string;
  deptName: string;
  ampm: string;
  orderId: string;
  patientId: string;
  numId: string;
  hosDeptId: string;
  idCard: string;
  fee: number;
  ampmName: string;
  hisResult: string;
  orderStatus: OrderStatus;
  idCasourcerd: string;
  upIdCard: string;
  schId: string;
  visitingArea: string;
  docName: string;
  categorName: string;
  appointmentTime: string;
  clinicalType: string;
  hosName: string;
  patientName: string;
  patientNameEncry: string;
  cardType: string;
  appointmentNumber: string;
  hosId: string;
  herenId: string;
  patientPhone: string;
  filing: string;
  hosOrderId: string;
  createTime: string;
  categor: string;
  hosDocId: string;
  appointmentDate: string;
  cardNumber: string;
  schQukCategor: string;
  _statusLabel: string;
  regWay?: string; // 挂号途径 小程序、自助机、诊间预约等
  extend?: string;
};

//多院区院内导航 根据hosId
export const HosNavData = {
  1281: () => {
    return {
      appId: 'wx8735a8a39cf58b5e',
      path: 'pages/index?id=FBStSs2nQK&appKey=QCncL1CmoF',
      text: '院内导航',
      type: 'otherProgram',
      addition: {
        hosDeptId: 'poi',
      },
    };
  },
  12930: () => {
    return {
      appId: 'wx8735a8a39cf58b5e',
      path: 'pages/index?id=RjCFT94AaD&appKey=4l2c52f0jU',
      text: '院内导航',
      type: 'otherProgram',
      addition: {
        hosDeptId: 'poi',
      },
    };
  },
  // #ifdef  MP-WEIXIN
  13062: (item: IRegistrationCardItem) => {
    let extraData: any = {
      type: '8_2',
      typeData: JSON.stringify({
        buildingId: 209638,
        type: '1',
        hisName: item.hosDeptId,
      }),
    };
      return {
      appId: 'wx0815c00f0b4bd7c3',
      path: 'pages/index/index',
      text: '院内导航',
      type: 'otherProgram',
      extraData,
    };
  },
  13178: (item: IRegistrationCardItem, type?: string) => {
    let extraData: any = {
      type: '8_2',
      typeData: JSON.stringify({
        buildingId: 208089,
        type: '1',
        hisName: item.hosDeptId,
        // type:3,
        // hisCode:item.hosDeptId
      }),
    };

    if (type === '4') {
      extraData = {
        type: '8',
        buildingId: 208089,
      };
    }
    // console.log('跳转第三方小程序appId:wx0815c00f0b4bd7c3;path:pages/index/index',';extraData',extraData)
    // uni.navigateToMiniProgram({
    //   appId: 'wx0815c00f0b4bd7c3',
    //   path: 'pages/index/index',
    //   extraData
    // });
    return {
      appId: 'wx0815c00f0b4bd7c3',
      path: 'pages/index/index',
      text: '院内导航',
      type: 'otherProgram',
      extraData,
    };
  },

  13001: (item: IRegistrationCardItem) => {
    try {
      let { areaId } = JSON.parse(item?.extend || '');
      return {
        appId: 'wx0fb39a1dc27c5e6d',
        path: `pages/index?id=QFadbKUMCl&appKey=g8E7Yc23Tm&poi=${areaId}`,
        text: '院内导航',
        type: 'otherProgram',
      };
    } catch (e) {
      return null;
    }
  },
  12675: () => {
    return {
      appId: 'wx8735a8a39cf58b5e',
      path: 'pages/index?id=fjFuiy2y0W&appKey=ECUUsgGgSG',
      text: '院内导航',
      type: 'otherProgram',
      addition: {
        hosDeptId: 'poi',
      },
    };
  },
  12713: () => {
    return {
      appId: 'wx8735a8a39cf58b5e',
      path: 'pages/index?id=qMb5Ulu53x&appKey=ECUUsgGgSG',
      text: '院内导航',
      type: 'otherProgram',
      addition: {
        hosDeptId: 'poi',
      },
    };
  },
  13152: (item: IRegistrationCardItem) => {
    const { deptName: name, hosDeptId } = item;

    const arg = {
      appCode: 'zjzlyy_all',
      mode: 'hisid',
      test: 'zjzlyy_all',
      sIRObject: JSON.stringify([
        {
          name,
          value: [hosDeptId],
          type: 'code',
        },
      ]),
    };

    const j = encodeURIComponent(joinQuery('', arg).slice(1));
    const path = `pages/index/index?sence=${j}`;

    return {
      appId: 'wx0a7c0e9d33f0b074',
      path,
      text: '院内导航',
      type: 'otherProgram',
      // addition: {
      //   hosDeptId: 'poi',
      // },
    };
  },

  // #endif
  // #ifdef  MP-ALIPAY
  // 13178: (item: IRegistrationCardItem, type?: string) => {
  //   return {
  //     appId: '2018122862716277',
  //     path: 'pages/index/index',
  //     text: '院内导航',
  //     type: 'otherProgram',
  //     extraData: {
  //       hisCode: item.hosDeptId,
  //       buildingId: 208089,
  //       type: 3,
  //     },
  //   };
  // },
  // #endif
};

export const judgeAllowNav = (item) => {
  const { hosId } = item;
  const sysCode = getSysCode();
  // #ifdef  MP-WEIXIN
  if (sysCode === '1001093') {
    return true;
  }

  if (sysCode === '1001046') {
    return true;
  }

  if (sysCode === '1001035') {
    if (['12675', '12713'].includes(hosId)) {
      return true;
    }
  }
  if (sysCode === '1001033') {
    if (['1281'].includes(hosId)) {
      return true;
    }
  }
  if (sysCode === '1001060') {
    if (['13062'].includes(hosId)) {
      return true;
    }
  }
  if (sysCode === '1001052') {
    if (['13001'].includes(hosId)) {
      try {
        if (JSON.parse(item?.extend || '').areaId) {
          return true;
        }
      } catch (e) {
        return false;
      }
    }
  }
  // #endif
  return false;
};
