import api from '@/service/api';
import HTMLParser from '@/common/html-parser';
import { GStores, ServerStaticData } from '@/utils';
export interface IWaitListItem {
  acceptTime: string;
  expressNo: string;
  expressCompany: string;
  expressParam: string;
  hosId: string;
  hosName: string;
  drugTypeCode: string;
  drugTypeName: string;
  deliveryType: string;
  prescId: string;
  prescNo: string;
  takenDrugType: string;
  prescTime: string;
  deptName: string;
  clinicType?: string;
  visitType?: '1' | '2';
  supportEditAddr?: '1'; // 特殊情况支持修改取药方式或者修改地址 1需要 台一需要
  drugIsDelivery: '0' | '1'; // 代煎方式 0代煎 1代煎外配
  takenDrug: string; // 0 待取药 1 已取药
  tcmDecoctionIndicator?: '0' | '1';
  prescVisitType?: string;
  _id: string;
  scan?: number;
  cardNumber?:string;
  linkRecordId?:string
}

interface IDrugDetailListItem {
  amount: string;
  drugCode: string;
  drugName: string;
  itemSpec: string;
  units: string;
  use: string;
  isTake: number;
}

export interface IItemDetail {
  drugDetailList: IDrugDetailListItem[];
  acceptTime: string;
  amount: string;
  checkDocName: string;
  deliveryAddress: string;
  deliveryType: '1' | '2' | '3' | '4'; // 允许配送类型 1-可常温配送/ 2-窗口取药/ 3-冷链配送/ 4-中药代煎
  drugTypeCode: string;
  drugTypeName: string;
  expressCompany: '1' | '2';
  expressId: string;
  expressNo: string;
  expressNos: string[];
  expressParam: string;
  frequency: string;
  hosId: string;
  hosName: string;
  masterDocName: string;
  medicineNo: string;
  num: string;
  patientId: string;
  patientName: string;
  prescNo: string;
  prescTime: string;
  qrCode: string;
  takeLocation: string;
  takenDrugType: '0' | '1' | '2' | '4' | '20' | '50'; // 处置方式 0 未处置（患者未处置默认显示 窗口取药) 1-窗口取药2-已处置快递配送，配送信息已填写；4.已取药 20快递已发货 50快递已签收
  use: string;
  addresseeAddress: string;
  addresseeName: string;
  addresseePhone: string;
}

export const isChineseMedical = (item) => {
  return !!(item.drugTypeName && item.drugTypeName.includes('中药'));
};

export const isToBeFriedAndDelivery = (item: IWaitListItem) => {
   const gStores = new GStores();
  
  if (isChineseMedical(item)&&gStores.globalStore.sysCode !== '1001035') {
    return item.drugIsDelivery === '1' && item.tcmDecoctionIndicator === '1';
  }

  return false;
};

export const getShowDrugName = (item: IWaitListItem) => {
  const gStores = new GStores();
  const { drugTypeName } = item;

  if (isChineseMedical(item) && gStores.globalStore.sysCode !== '1001035') {
    if (isToBeFriedAndDelivery(item)) {
      return drugTypeName + `(代煎外配)`;
    } else if (
      item.tcmDecoctionIndicator === '1' &&
      item.drugIsDelivery === '0'
    ) {
      return drugTypeName + `(代煎)`;
    }
  }

  return drugTypeName;
};

export const getSysAppMore = async (typeFlag: string) => {
  let text;
  try {
    const { result } = await api.getSysAppMore({
      typeFlag,
    });
    const { content } = result;
    text = HTMLParser(content);
  } catch (err) {
    text = '请凭二维码前往药房取药';
  }
  return text;
};


