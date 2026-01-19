export type THosButlerInfo = {
  /**
   * address* string
   * example: 南京市秦淮区XX路XX号
   * 户口地址
   */
  address: string;
  /**
   * admissionWay* string
   * example: 急诊入院
   * 入院途径
   */
  admissionWay: string;
  /**
   * birthCity* string
   * example: 南京市
   * 出生地 市
   */
  birthCity: string;
  birthCityName: string;
  /**
   * birthDistrict* string
   * example: 玄武区
   * 出生地 区/县
   */
  birthDistrict: string;
  birthDistrictName: string;
  /**
   * birthProvince* string
   * example: 江苏省
   * 出生地 省
   */
  birthProvince: string;
  birthProvinceName: string;
  /**
   * birthday* string
   * example: 1990-01-01
   * 出生日期
   */
  birthday: string;
  /**
   * cardNumber* string
   * example: C20251229001
   * 卡号/病案号
   */
  cardNumber: string;
  /**
   * chargeType* string
   * example: 医保
   * 费用类别
   */
  chargeType: string;
  /**
   * citizenship* string
   * example: 中国
   * 国籍
   */
  citizenship: string;
  /**
   * citizenshipCode* string
   * example: CN
   * 国籍编码
   */
  citizenshipCode: string;
  /**
   * deptId* string
   * example: DEPT001
   * 入院科室编号
   */
  deptId: string;
  /**
   * deptName* string
   * example: 心血管内科
   * 入院科室名称
   */
  deptName: string;
  /**
   * diagnosis* string
   * example: 急性心肌梗死
   * 诊断
   */
  diagnosis: string;
  /**
   * doctorCode* string
   * example: DOCTOR001
   * 主管医生编码
   */
  doctorCode: string;
  /**
   * doctorName* string
   * example: 王医生
   * 主管医生
   */
  doctorName: string;
  /**
   * edu* string
   * example: 本科
   * 学历
   */
  edu: string;
  /**
   * eduCode* string
   * example: 05
   * 学历编码
   */
  eduCode: string;
  /**
   * groupCode* string
   * example: GROUP001
   * 医疗组编码
   */
  groupCode: string;
  /**
   * groupName* string
   * example: 心内科一组
   * 医疗组名称
   */
  groupName: string;
  /**
   * hosId* string
   * example: 1001095
   * 院区编码
   */
  hosId: string;
  /**
   * hosName* string
   * example: XX市第一人民医院本部
   * 院区名称
   */
  hosName: string;
  /**
   * hospitalDate* string
   * example: 2025-12-29 08:30:00
   * 入院日期
   */
  hospitalDate: string;
  /**
   * hospitalWard* string
   * example: 心血管内科一病区
   * 入院病区
   */
  hospitalWard: string;
  /**
   * hospitalWardId* string
   * example: WARD001
   * 入院病区编号
   */
  hospitalWardId: string;
  /**
   * idCard* string
   * example: 320100199001011260
   * 证件号
   */
  idCard: string;
  /**
   * idType* string
   * example: 身份证
   * 证件类型
   */
  idType: string;
  /**
   * inHosNavigationAddress* string
   * example: XX市第一人民医院住院部1号楼5层
   * 线下导航地址
   */
  inHosNavigationAddress: string;
  /**
   * inHosNavigationAddressUrl* string
   * example: https://map.baidu.com/xxx
   * 线下地址导航链接
   */
  inHosNavigationAddressUrl: string;
  /**
   * inHosProcedures* string
   * example: 已办理
   * 入院手续
   */
  inHosProcedures: string;
  /**
   * insuranceCardNo* string
   * example: 320100199001011260
   * 医保卡号
   */
  insuranceCardNo: string;
  /**
   * marital* string
   * example: 已婚
   * 婚姻
   */
  marital: string;
  /**
   * membersAddress* string
   * example: 南京市鼓楼区XX路XX号
   * 联系人地址
   */
  membersAddress: string;
  /**
   * membersName* string
   * example: 李四
   * 联系人
   */
  membersName: string;
  /**
   * membersPhone* string
   * example: 13900139000
   * 联系人电话
   */
  membersPhone: string;
  /**
   * nation* string
   * example: 汉族
   * 民族
   */
  nation: string;
  /**
   * nationCode* string
   * example: 01
   * 民族编码
   */
  nationCode: string;
  /**
   * nativePlaceString* string
   * example: 江苏省南京市
   * 籍贯
   */
  nativePlaceString: string;
  /**
   * nurseCode* string
   * example: NURSE001
   * 责任护士编码
   */
  nurseCode: string;
  /**
   * nurseName* string
   * example: 张护士
   * 责任护士
   */
  nurseName: string;
  /**
   * occupation* string
   * example: 企业职员
   * 职业
   */
  occupation: string;
  /**
   * occupationCode* string
   * example: 002
   * 职业编码
   */
  occupationCode: string;
  /**
   * patientAge* string
   * example: 35
   * 年龄
   */
  patientAge: string;
  /**
   * patientName* string
   * example: 张三
   * 姓名
   */
  patientName: string;
  /**
   * patientPhone* string
   * example: 13800138000
   * 本人电话
   */
  patientPhone: string;
  /**
   * phone* string
   * example: 025-88888888
   * 家庭电话
   */
  phone: string;
  /**
   * postCode* string
   * example: 210000
   * 邮编
   */
  postCode: string;
  /**
   * presentAddress* string
   * example: 南京市玄武区XX路XX号
   * 现住址
   */
  presentAddress: string;
  /**
   * relationship* string
   * example: 父子
   * 关系
   */
  relationship: string;
  /**
   * serviceAgency* string
   * example: XX科技有限公司
   * 工作单位
   */
  serviceAgency: string;
  /**
   * sex* string
   * example: 男
   * 性别
   */
  sex: string;
  /**
   * status* string
   * example: 1
   * 状态值  1 待登记 2 检查评估 3 等待床位 4 到院入科

   */
  status: '1' | '2' | '3' | '4';
  /**
   * statusName* string
   * example: 已入院
   * 状态名称
   */
  statusName: string;
  /**
   * visitNo* string
   * example: ZY20251229001
   * 住院号
   */
  visitNo: string;
  /**
   * wardHeadNurseCode* string
   * example: HEADNURSE001
   * 病区护士长编码
   */
  wardHeadNurseCode: string;
  /**
   * wardHeadNurseName* string
   * example: 李护士长
   * 病区护士长
   */
  wardHeadNurseName: string;
};
