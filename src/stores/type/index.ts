export interface IPat {
	address: string;
	aliFreeSignId: string;
	birthday: string;
	cardNumber: string;
	cardType: string;
	cellPhoneNumber: string;
	defaultFlag: '1' | '0';
	herenId: number;
	idCard: string;
	idCardEncry: string;
	idType: string;
	nation: string;
	nationCode: string;
	patientAge: string;
	patientId: string;
	patientName: string;
	patientPhone: string;
	patientSex: '男' | '女';
	patientType: string;
	relationship: string;
	sysCode: string;
	thirdOpenId: string;
	upIdCard: string;
	upName: string;
	healthQrCodeText?: string;
	_showId: string;
}
