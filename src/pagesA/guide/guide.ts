export type TVisitRecord = {
  date: string;
  deptName: string;
  visitNo: string;
  deptId?: string;
  // regWay: '云门诊' | '图文问诊' | '普通预约';
  areaName: string; // 互联网医院类型的值为 "网络就诊"
};

export const titleMap = {
  1: '门诊取号',
  2: '诊区签到',
  3: '门诊就诊',
  4: '门诊缴费',
  5: '检查项目',
  6: '检验项目',
  7: '其他项目',
  8: '门诊取药',
  9: '复诊签到',
} as const;

type TTitleMap = typeof titleMap;

export type TVisitInfo = {
  title: TTitleMap[keyof TTitleMap];
  appointmentTime: string;
  areaId: string;
  areaName: string;
  categorName: string;
  /** 完成状态 0未完成 1全部完成 */
  completionStatus: 0 | 1;
  docName: string;
  hosId: string;
  hosName: string;
  reportPlace: string;
  /** 1 网络就诊（云门诊） */
  _regWay: string;

  /** 门诊取药 */
  drugs: {
    itemName: string;
    itemAddress: string;
    disposeStatus: string;
    [key: string]: any;
  }[];

  /** 检验 */
  labs: {
    itemName: string;
    itemAddress: string;
    status: string;
    orderId: string;
    billDeptName: string;
    performDeptCode: string;
    reportPlace: string;
    isEmptyStomach: string;
    isDeptStorage: string;
    appointIndicator: string;
  }[];
  /** 检查 */
  exams: TVisitInfo['labs'];
  /** 其他 */
  others: TVisitInfo['labs'];
};

const a = {
  jyBtns: [
    {
      disposeStatus: ['2'],
      type: 'self',
      path: 'pagesB/reportQuery/reportQuery',
      text: '查看报告',
      btnClass: 'btn-primary text-white',
    },
    {
      labStatus: ['4'],
      type: 'self',
      path: 'pagesA/MyRegistration/DoctorDetails',
      addition: {
        patientId: 'patientId',
        hosDocId: 'hosDocId',
        deptId: 'hosDeptId',
        hosId: 'hosId',
      },
      text: '咨询医生',
    },
  ],
  mzjzBtns: [
    {
      otherStatus: [
        {
          label: '_regWay',
          value: ['1'],
        },
      ],
      type: 'self',
      path: 'pagesC/cloudHospital/cloudHospital?_url=pages%2Fv3%2Forder%2Flist',
      text: '咨询订单',
      btnClass: 'btn-primary text-white',
    },
    {
      otherStatus: [
        {
          label: '_regWay',
          value: ['1'],
        },
      ],
      type: 'self',
      path: 'pagesC/cloudHospital/cloudHospital?_url=pages%2Fv3%2Forder%2Fyhz%2Flist',
      text: '云候诊进度',
    },
  ],
  jcBtns: [
    {
      disposeStatus: ['2'],
      type: 'self',
      path: 'pagesB/reportQuery/reportQuery?tabIndex=1',
      text: '查看报告',
      btnClass: 'btn-primary text-white',
    },
    {
      labStatus: ['1'],
      type: 'h5',
      isSelfH5: '1',
      path: 'pagesC/choosePat/choosePat?_type=jcyy1001035',
      text: '检查预约',
      addition: {
        patientId: '_patientId',
        token: 'token',
      },
    },
    {
      labStatus: ['2'],
      type: 'h5',
      isSelfH5: '1',
      path: 'pagesC/choosePat/choosePat?_type=jcyy1001035',
      text: '预约查询及改约',
      addition: {
        patientId: '_patientId',
        token: 'token',
      },
    },
    {
      labStatus: ['4'],
      type: 'self',
      path: 'pagesA/MyRegistration/DoctorDetails',
      addition: {
        patientId: 'patientId',
        hosDocId: 'hosDocId',
        hosId: 'hosId',
        deptId: 'hosDeptId',
      },
      text: '咨询医生',
    },
  ],
  jzwcBtns: [
    {
      type: 'self',
      path: 'pagesA/MyRegistration/DoctorDetails',
      addition: {
        patientId: 'patientId',
        hosDocId: 'hosDocId',
        deptId: 'hosDeptId',
        hosId: 'hosId',
      },
      text: '复诊预约',
    },
    {
      type: 'h5',
      isSelfH5: '1',
      path: 'pagesC/question/questionAfterVisit',
      text: '满意度评价',
      addition: {
        patientId: '_pd',
        token: 'token',
      },
    },
  ],
  mzqhBtns: [
    {
      type: 'h5',
      isSelfH5: '1',
      path: 'pagesC/inquiries/inquiriesRes1',
      completionStatus: [0],
      text: '预问诊',
      addition: {
        token: 'token',
        herenId: 'herenId',
        orderId: 'hosOrderId',
        patientId: 'patientId',
        hosDeptId: 'hosDeptId',
        hosOrderId: 'hosOrderId',
        visitNo: 'visitNo',
        hosData: 'hosData',
      },
    },
    {
      type: 'self',
      path: 'pagesC/takeNumber/takeNumber',
      completionStatus: [0],
      addition: {
        patientId: 'patientId',
      },
      text: '在线取号',
    },
    {
      type: 'self',
      path: 'pagesA/MyRegistration/MyRegistration',
      completionStatus: [0],
      addition: {
        patientId: 'patientId',
      },
      text: '取消预约',
    },
  ],
  takeDrugBtns: [
    {
      disposeStatus: ['2'],
      completionStatus: [1],
      type: 'h5',
      isSelfH5: '1',
      path: 'pagesC/medicationQuery/medicationQuery',
      text: '用药指导',
      isLocal: '1',
      addition: {
        patientId: '_patientId',
      },
    },
    {
      completionStatus: [0],
      type: 'self',
      path: 'pagesB/medicationAssistant/medicalHelp',
      text: '药品代煎快递',
    },
    {
      completionStatus: [1],
      type: 'h5',
      isSelfH5: '1',
      path: 'pagesC/medicationQuery/medicationQuery',
      text: '用药查询',
      isLocal: '1',
      addition: {
        patientId: '_patientId',
      },
    },
    {
      completionStatus: [1],
      type: 'self',
      path: 'pagesB/medicationAssistant/medicalHelp?tabIndex=1',
      text: '药品快递查询',
    },
  ],
  mzjfBtns: [
    {
      completionStatus: [0, 1],
      type: 'self',
      path: 'pagesA/clinicPay/clinicPayDetail?tabIndex=1',
      text: '缴费记录查询',
    },
    {
      completionStatus: [0],
      type: 'self',
      path: 'pagesA/clinicPay/clinicPayDetail',
      text: '在线缴费',
      btnClass: 'btn-primary text-white',
    },
    {
      completionStatus: [0, 1],
      type: 'self',
      path: 'pagesB/medicationAssistant/medicalHelp',
      text: '药品代煎快递',
    },
  ],
  tabDrugTip: '缴费完成请取药',
};
