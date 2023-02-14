export interface IWaitListItem {
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
  drugIsDelivery: '0' | '1'; // 代煎方式 0代煎 1代煎外配
  takenDrug: '0' | '1'; // 0 待取药 1 已取药
  _id: string;
}

interface IDrugDetailListItem {
  amount: string;
  drugCode: string;
  drugName: string;
  itemSpec: string;
  units: string;
  use: string;
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

export const isChineseMedical = (item: IWaitListItem) => {
  return !!(item.drugTypeName && item.drugTypeName.includes('中药'));
};

export const getShowDrugName = (item: IWaitListItem) => {
  const { drugTypeName, drugIsDelivery } = item;

  if (isChineseMedical(item)) {
    return drugTypeName + `(${drugIsDelivery === '1' ? '代煎外配' : '代煎'})`;
  } else {
    return drugTypeName;
  }
};
