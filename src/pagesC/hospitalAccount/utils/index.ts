export interface IHospitalAccountDetail {
  accountBalance: string;
  accountNo: string;
  cardNumber: string;
  patientName: string;
  allowOnLineCash: string;
  stopIndicator: string; // 停用标记 0-停用 1-正常使用
  cardList?: {
    cardNo: string;
    cardType: string;
  }[];
  reason?: {
    codeName: string;
  }[]
}
export interface IAccountWithdrawal {}

export type hospitalPayResult = any[]
export type TRefundRecord = any[]
