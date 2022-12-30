import { getSysCode, joinQueryForUrl } from '@/common';
import globalGl from '@/config/global';

import api from '@/service/api';

export interface ITab {
  typeId: string;
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

  patientName?: string;
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

  patientName?: string;
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
export const getShareTotalUrl = (query, path) => {
  // const source = getBrowser().source;

  // const data = cloneUtil(query);
  const data = {...query, _scan: '1'};
  const bUrl = (globalGl.env as string === 'prod')  ? 'https://h5.eheren.com/note' : 'https://health.eheren.com/note'

  const outTime = 7;
  return new Promise((resolve, reject) => {
    const envWx = globalGl.env as string === 'prod' ? 'release': 'develop'; // develop | release | trial
    uni.showLoading({
      title: '请求中..',
      mask: true,
    });
    // if (source == 19) {
    // }
    api
      .getScheme({
        days: outTime,
        envVersion: envWx,
        path,
        sysCode: getSysCode(),
        // query: 'mq' + encodeURIComponent(JSON.stringify(data)),
        query: joinQueryForUrl('', data).slice(1),
      })
      .then(({ result, message }) => {
        uni.hideLoading();
        if (result) {
          // resolve(bUrl + '?' + result.split('?')[1]);
          resolve(result);
        } else {
          reject(message);
        }
      })
      .catch((e) => {
        reject(e);
      });
  });
};
//添加水印方法
export const addWatermark = (text) => {
  var ctx = uni.createCanvasContext('watermarkCanvas');
  //设置文字的旋转角度，角度为45°；
  ctx.rotate((-45 * Math.PI) / 180);
  //对斜对角线以左部分进行文字的填充
  for (let j = 1; j < 30; j++) {
    //用for循环达到重复输出文字的效果，这个for循环代表纵向循环
    ctx.beginPath();
    ctx.setFontSize(16);
    ctx.setFillStyle('rgba(169,169,169,.2)');
    //文本 x坐标位置  y坐标位置 需要绘制的最大宽度
    ctx.fillText(text, 0, 150 * j);
    for (let i = 1; i < 20; i++) {
      //这个for循环代表横向循环，
      ctx.beginPath();
      ctx.setFontSize(16);
      ctx.setFillStyle('rgba(169,169,169,.2)');
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
    ctx.setFillStyle('rgba(169,169,169,.2)');
    // 文本 x坐标位置  y坐标位置 需要绘制的最大宽度
    ctx.fillText(text, 80, -100 * j);
    for (let i = 1; i < 20; i++) {
      ctx.beginPath();
      ctx.setFontSize(16);
      ctx.setFillStyle('rgba(169,169,169,.2)');
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
