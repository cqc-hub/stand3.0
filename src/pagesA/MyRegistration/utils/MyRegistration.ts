import { orderStatusMap, OrderStatus } from './regDetail';

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
};

//多院区院内导航（仅绍兴）
export const HosNavData = {
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
  13178: (item: IRegistrationCardItem, type?: string) => {
    let extraData: any = {
      type: '8_2',
      typeData: JSON.stringify({
        buildingId: 208089,
        type: '1',
        hisName: item.deptName,
      }),
    };
    if (type === '4') {
      extraData = {
        type: '8',
        buildingId: 208089,
      };
    }
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
