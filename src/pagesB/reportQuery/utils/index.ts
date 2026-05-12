import { deQueryForUrl, getSysCode, joinQueryForUrl } from '@/common';
import { apiAsync, IHosInfo, ServerStaticData } from '@/utils';
import { ref } from 'vue';

export interface ITab {
  typeId: number;
  headerType: string;
  headerName: string;
}
export interface INucleic {
  collectionDate: string;
  hsAmount: string;
  hsDate: string;
  hsOrgan: string;
  hsResult: '阳性' | '阴性';
  name: string;
}

export interface ICms {
  reportHosNameResults: reportList[];
  date?: string;
}
export interface reportList {
  reportList?: getReportList[];
  hosName?: string;
}
export interface getReportList {
  extend?: string;
  dataSource?: string;
  hosId?: string;
  hosName?: string;
  repDate?: string;
  repId?: string;
  repName?: string;
  repType?: string;

  // 1-普通检验报告 2-微生物药敏、细菌培养报告

  reportType?: string;
}

//检验详细出参
export interface checkoutReportDetails {
  /**
   * 图文
   */
  pdfUrl?: string;
  pdfUrls?: string[];
  extend?: string;
  age?: string;
  //年龄
  antiItemResult?: antiItemResult[];
  applyDoc?: string;
  //开单医生
  applyDocId?: string;
  deptId?: string;
  //开单医生id
  applyTime?: string;
  //申请单号
  serialNo?: string;
  //申请时间
  cardNumber?: string;
  //院内患者ID或者cardNumber
  hosId?: string;
  //医院编码
  hosName?: string;
  //医院名称
  itemNo?: string;
  //报告编号
  normalList?: normalList[];
  passDoc?: string;
  //审核医生

  passDocId?: string;
  //审核医生

  patientName: string;
  //患者姓名

  patientNameEncry?: string;
  //患者脱敏姓名

  regTime?: string;
  //采集或登记时间

  reminder?: string;
  //检验提示

  repCode?: string;
  //项目编码

  repId?: string;
  //报告单号

  repName?: string;
  //项目名称

  repTime?: string;
  //报告时间

  reportDoc?: string;
  //报告医生

  reportDocId?: string;
  //报告医生ID

  sex?: string;
  //性别

  specimen?: string;
  //化验标本

  visitNo?: string;
  //就诊序号
  diagnosis?: string;
}

export interface antiItemResult {
  antiList?: antiList[];
  bioId?: string;
  //培养菌编码

  bioName?: string;
  //培养菌名称

  remark?: string;
  //临床提醒

  spectrum?: string;
  //耐药类型
  bioNum?: string;
}

export interface antiList {
  antiId?: string;
  //药敏抗生素Id

  antiName?: string;
  //药敏抗生素名称

  antiNo?: string;
  //药敏抗生素编号

  antiResult?: string;
  //结果

  itemUnits?: string;
  //单位

  result?: string;
  //结果标识

  resultName?: string;
  //结果名称

  testMethod?: string;
  //测试方法

  testRange?: string;
  //范围

  inflectionPoint?: string;
  //折点

  number?: string;
  //数值
}

export interface normalList {
  flag?: string;
  //异常标志 N,正常 L，低 H，高，Y异常

  itemName?: string;
  //项目名称

  itemUnits?: string;
  //单位

  itemVal?: string;
  //结果

  normalVal?: string;
  //参考范围
}

//检查详细出参
export interface examineReportDetails {
  extend?: string;
  age?: string;
  //年龄

  pdfType?: 'JPG' | 'pdf';
  diacrisis?: string;
  applyDoc?: string;
  //开单医生

  applyDocId?: string;
  //开单医生id

  applyTime?: string;
  //申请时间
  serialNo?: string;
  //申请单号
  cardNumber?: string;
  //院内患者ID或者cardNumber

  deptName?: string;
  //申请科室

  description?: string;
  //报告描述所见
  detailsResult?: examineReportDetails[];
  //报告诊断、提示
  dicomList?: string[];
  hosId?: string;
  //医院编码

  hosName?: string;
  //医院名称

  isCharged?: string;
  //是否收费

  itemNo?: string;
  //报告编号

  keyPicList?: string[];
  needPay?: string;
  //云医像是否支持付费 0-需要支付 1-不需支付

  part?: string;
  //部位

  passDoc?: string;
  //审核医生

  passDocId?: string;
  //审核医生

  patientName: string;
  //患者姓名

  patientNameEncry?: string;
  //患者脱敏姓名

  pdfPath?: string;
  //关键图文地址

  regTime?: string;
  //采集或登记时间

  repCode?: string;
  //项目编码

  repId?: string;
  //报告单号

  repName?: string;
  //项目名称

  repTime?: string;
  //报告时间

  reportDoc?: string;
  //报告医生

  reportDocId?: string;
  //报告医生ID

  sex?: string;
  //性别

  suggest?: string;
  //报告建议

  visitNo?: string;
  //就诊序号
  impression?: string;
  deptId?: string;
  diagnosis?: string;

  // 云影像
  yunUrl?: string;
}

//体检详细出参
export interface medicalReportDetails {
  age?: string;
  url?: string;
  applyDoc?: string;
  applyDocId?: string;
  applyTime?: string;
  cardNumber?: string;
  collect?: string;
  conclusion?: string;
  deptId?: string;
  deptName?: string;
  hosId?: string;
  hosName?: string;
  itemNo?: string;
  passDoc?: string;
  passDocId?: string;
  patientName?: string;
  regTime?: string;
  repCode?: string;
  repId?: string;
  repName?: string;
  repTime?: string;
  reportDoc?: string;
  reportDocId?: string;
  serialNo?: string;
  sex?: string;
  suggest?: string;
  visitNo?: string;
}

//添加水印方法
export const addWatermark = (text) => {
  var ctx = uni.createCanvasContext('watermarkCanvas');
  //设置文字的旋转角度，角度为45°；
  ctx.rotate((-45 * Math.PI) / 180);
  ctx.setGlobalAlpha(0.2);
  const fc = 'rgb(169, 169, 169)';

  //对斜对角线以左部分进行文字的填充
  for (let j = 1; j < 30; j++) {
    //用for循环达到重复输出文字的效果，这个for循环代表纵向循环
    ctx.beginPath();
    ctx.setFontSize(16);
    ctx.setFillStyle(fc);
    //文本 x坐标位置  y坐标位置 需要绘制的最大宽度
    ctx.fillText(text, 0, 150 * j);
    for (let i = 1; i < 20; i++) {
      //这个for循环代表横向循环，
      ctx.beginPath();
      ctx.setFontSize(16);
      ctx.setFillStyle(fc);
      //文本 x坐标位置  y坐标位置 需要绘制的最大宽度
      ctx.fillText(text, -200 * i, 150 * j);
      // ctx.fillText('    手机号:' + waterPhone, 350 * i, 150 * j + 20);
      // ctx.fillText('本操作将被记录，泄露相关信息', 350 * i, 150 * j + 40);
      // ctx.fillText('将被依法追究法律责任', 350 * i, 150 * j + 60);
    }
  } //两个for循环的配合，使得文字充满斜对角线的左下部分

  //对斜对角线以右部分进行文字的填充逻辑同上
  for (let j = 0; j < 20; j++) {
    ctx.beginPath();
    ctx.setFontSize(16);
    ctx.setFillStyle(fc);
    // 文本 x坐标位置  y坐标位置 需要绘制的最大宽度
    ctx.fillText(text, 80, -100 * j);
    for (let i = 1; i < 20; i++) {
      ctx.beginPath();
      ctx.setFontSize(16);
      ctx.setFillStyle(fc);
      //文本 x坐标位置  y坐标位置 需要绘制的最大宽度
      ctx.fillText(text, 80 * i, -100 * j);
    }
  }
  ctx.draw();
};

export const getQueryUrl = function (url: string): BaseObject {
  const aUrl = [...url];
  const aArg = aUrl
    .slice(aUrl.findIndex((o) => o === '?') + 1)
    .join('')
    .split('&')
    .map((o) => {
      const [key, value] = o.split('=');
      return [key, value];
    });

  return Object.fromEntries(aArg);
};

export const reportAnalysisFun = async (pageProps) => {
  const { confirm } = await apiAsync(uni.showModal, {
    title: '授权提醒',
    content:
      'AI报告解读为您提供报告异常指标分析，健康生活及就诊科室建议，是否授权本条报告数据给大模型进行智能解读？',
    confirmText: '确认',
    cancelText: '取消',
  });
  if (confirm) {
    const { repId, repType, extend, headerType } = pageProps;
    let data = {
      repId,
      repType,
      extend,
      headerType,
    };
    uni.navigateTo({
      // 跳转到智能客服,报告列表?type=report，直接解读报告?type=report&reportId=xxx
      url: joinQueryForUrl('/pagesA/intelMedicalAssist/intelMedicalAssist', {
        type: 'report',
        reportId: repId,
        reportData: data,
      }),
    });
  }
};

export const useHosInfo = () => {
  const hosInfo = ref({} as IHosInfo);
  const getHosInfo = async (hosId) => {
    const list = await ServerStaticData.getHosList();
    hosInfo.value = list.find((o) => o.hosId === hosId) || ({} as IHosInfo);

    return hosInfo.value;
  };

  return {
    hosInfo,
    getHosInfo,
  };
};
