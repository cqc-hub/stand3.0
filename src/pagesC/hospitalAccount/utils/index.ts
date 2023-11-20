export interface IHospitalAccountDetail {
  accountBalance: string;
  accountNo: string;
  cardNumber: string;
  patientName: string;
  allowOnLineCash: string;
  cardList?: {
    cardNo: string;
    cardType: string;
  }[];
}
export interface IAccountWithdrawal {}
