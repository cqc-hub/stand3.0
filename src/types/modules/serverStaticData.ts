import { type XOR } from '@/typeUtils';
import { MEDICAL_PHOTOS } from '@/static/staticData';

export type TPersonExtraKey =
  | string
  | {
      key: string;
      sort: number; // 排序
    };

/**
 *  未指定说明的 '0' 均为 false '1' true
 */
export interface ISystemConfig_ {
  // pagesB/menus/index  子菜单业务功能入口配置
  BusinessMenu: {
    menus?: {
      [key: string]: {
        label: string; // 标题
        subLabel?: string; // 副标题
        config: TBannerConfig;
      }[];
    };
  };

  // 预约挂号 ORDER_REGISTER
  order: {
    /**
     * home 页面
     */
    // 医生推荐banner区
    isOpenHomeDoctorBanner?: '1';
    // 首页渲染时就加载获取医生推荐
    getDoctorBannerOnShow: '1';
    /**
     * pagesA/MyRegistration/RegSearch
     */
    // 搜索列表时候传入 hosId
    regSearchWithHosId?: '1';
    regSearchBanner?: TBannerConfig | TBannerConfig[];

    /**
     * pagesA/MyRegistration/Register
     */
    /** 获取医院列表时候带入定位信息 */
    getHosListWithLocation?: '1';

    /**
     * 选择医院页面
     */
    // 选医院上面 banner
    bannerSelHosTop?: TBannerConfig;
    /** 针对 mdt 功能, 开放的院区 */
    mdtHosOpened?: string[];

    /** 科室列表页面 pagesA/MyRegistration/selDepartment */
    // 选科室上面 banner
    bannerOrder?: TBannerConfig | TBannerConfig[];
    //党建专科
    partySpecialization?: string[];
    //选科室上面 banner-支付宝
    bannerOrderAlipay?: TBannerConfig | TBannerConfig[];
    //跳转名医名科模式,若开启则会请求医院参数CELEBRATED_DEPT
    isCelebratedDeptMode?: '1';
    /** 预约挂号温馨提示 */
    deptDialogBtnCannel?:
      | {
          label: string;
          // '0' 门诊充值
          key: '0';
        }
      | (TBannerConfig & { label: string });

    /** 挂号页面 */
    /** 挂号模式(挂号排序,显示等医院定制) 1 西安红会  2 义乌*/
    orderMode?: '1' | '2';
    // 选择科室医生页面顶部可选择的天数， chooseDay > 20 出现组件 ‘日历’
    chooseDay: number;
    /** 日历日期下面显示号源状态（有号、约满...） */
    calendarShowOrderStatus?: '1';
    // 过滤无号医生按钮
    isShowFilterOrderSourceBtn?: '1';
    /** 按日期, 分组名 categorName 隐藏 */
    isHideOrderCategorName?: '1';
    // 选择号源时候显示几列
    selOrderColumn: number;
    // 精确号源?  1 精确号源
    isOrderBlur: '0' | '1';
    // 展示号源数不为空的，超过当前时间的号源是否展示
    isHideOutTimeOrderSource?: '0' | '1';
    // 隐藏号源总数
    isHideNumCount?: '1';
    // 预约挂号时候付钱?
    isOrderPay: '0' | '1';
    // 医生排班里展示挂号类型
    isShowClinicalType?: '1';
    // 挂号待支付时候没有倒计时
    isOrderWithoutTime: '1';
    // 挂号成功后预问诊?
    isOpenPreConsultation?: '1';
    //预问诊跳转的第三方配置 不配置该参数默认跳转自研的
    //isSelOrderShow为1则全部挂号展示预问诊
    preConsultationBtn?: { isSelOrderShow?: '1' } & TBannerConfig;
    //预问诊显示的订单状态,['0']
    showYwzByOrderStauts?: string[];
    /** 挂号预结算 */
    isOrderPreSettle?: '1';
    /** 候补预约 */
    isOpenOrderWaiting?: '1';
    // 对应的医生不显示候补按钮
    orderWaitingDisabled?: {
      [hosId: string]:
        | string[]
        | {
            [hosDeptId: string]: string[];
          }; // hosDocId[];
    };
    /**开启后候补加号（候补兼容加号模式）*/
    isOpenAddedNum?: '1';
    /**
     * 开启后候补挂号与加号分离
     * 不分离就是 候补即加号
     *
     * */
    isAddedNumSelf?: '1';
    /** 预约挂号, 取消预约挂号时候  订阅微信消息(单次最多三个) */
    wxOrderSubscribeMessage?: string[];
    /** 挂号按钮 的 label */
    orderRegBtnLabel?: string;
    /** 快速预约（挂号无需绑定就诊人） */
    isOrderWithoutPat?: '1';
    /** 医生挂号展示医院名那儿多展示一下科室 */
    isShowHosNameWithDeptName?: '1';
    /** 挂号确认页面确认挂号前是否需要展示就诊提示 */
    isConfirmOrderWithDeptTip?: '1' | '2'; // 1 科室页面不弹 2 科室、挂号确认页面均弹
    /** 挂号确认页面点击我已阅读时候需要弹窗 */
    isConfirmOrderWithConfirmDialog?: '1';
    /** 挂号确认页面是否弹框提示知情同意书 */
    isConfirmOrderWithApplyBook?: '1' | '2'; //1、所有挂号订单都弹。2、调用接口判断是否弹窗
    /** 重复选择科室页面的提示 */
    isConfirmOrderOrderTipRepeat?: '1';
    /** 挂号确认页面 去预约变成去支付&跳到详情后自动拉起支付 */
    isConfirmOrderWithPay?: '1';

    /** 医生名片 */
    isPartyMemberStyle?: '1';
    isHideDocJob?: '1';
    isHideHosName?: '1';
    // 对应网络医院那边维护的 hosId， 他们不用区分院区的吗？(不用 固定的)
    netHosId?: string; // isOpenDocCardOnlineService === '1' 时候必给
    // 开启在线服务?
    isOpenDocCardOnlineService?: '1';
    isOpenDocCardOnlineServiceAlipay?: '1'; // 有的时候表示支付宝
    // 近一年大数据
    isOpenBigDataNearlyYear?: '1';
    // 评论
    isOpenComment?: '1';
    isHideCommentListInDocDetail?: '1';
    //排班页面是否隐藏号源的总量余量
    isHideNumberSourceTotalRemain?: '1';
    // 开放外院排班
    isOpenOutHosSch?: '1';
    // 点击了外院排班
    handlerOutHosSchClick?: TBannerConfig;
    // 请求排班不区分科室
    isSchNoDept?: '1';
    // 请求排班不区分医院
    isSchNoHos?: '1';

    /** 挂号记录 */
    //页面顶部按钮(仅我的挂号页面)
    MyRegistrationNavBtns?: TButtonConfig[];
    // 显示院内导航按钮? 挂号状态 string
    isHosNavigation?: string[];
    // 排队叫号?
    isQueuing?: string[];
    // 服务评价?
    isFWBtn?: string[]; // 需要服务评价的订单状态码
    // 已就诊、已结束订单状态显示“复诊预约”按钮
    isOpenReOrder?: '1';
    // 自定义列表子项底部按钮功能
    regListItemCustomButtons: TRegListButtonItem[];
    // 可以筛选 在线/全部 挂号?  设置后 列表, 详情 接口也会变更
    isCanSelOrderStatus?: '1';
    selOrderStatusDefault?: '1'; //isCanSelOrderStatus 开启后 设置默认挂号状态为全部挂号
    //是否管理在线挂号tab
    isCancelOlineReg?: '1';
    //开启后新增候补挂号tab
    isTabWaitReg?: '1';

    /**
     * 挂号详情页
     */
    // 预约科室字段后的按钮(导航)
    regDeptButton?: {
      [hosId: string]: TButtonConfig;
    };

    /** 搜索 */
    // 热门搜索
    hosRegHistory?: IRegSearchHistoryItem[];

    /** 门诊取号 | 在线签到 takeNumber  -> 新增配置入口 TakeNumber */
    // 列表页面
    takeNumberGoPayBtn?: '1'; // 是否显示门诊缴费入口按钮
    takeNumberQueueBtn?: '1'; // 是否显示排队叫号入口按钮
    takeNumberOnlineBtn?: '1'; // 是否显示在线签到入口按钮
    takeNumberAfterBtnForGoQueueNumber?: '1'; // 取号后  按钮变成 '查看排队信息': 跳 排队叫号; 默认 '刷码签到'
    takeNumber1ElectronicGuideBtn?: '1'; //否显示排队叫号入口按钮
    takeNumberConfirmAfter?: '1'; // 取号成功后 按照项目配置是否进行弹窗提示(去门诊缴费页面)
    expireButRetrieve?: '1'; //过号后进行弹窗并允许重新取号
    takeNumberHeadBtns?: TButtonConfig[]; // 取号顶部按钮
    onlineSignHeadBtns?: TButtonConfig[]; // 签到顶部按钮
    takeNumberConfirmAfterBtn?: TButtonConfig; // 取号成功后的弹窗(按钮配置)
    onlineSignConfirmAfterBtn?: TButtonConfig; //签到成功后的弹窗(按钮配置)
    AfterConfirmNoShowGoPayBtn?: '1'; //签到成功后不展示缴费按钮
    AfterConfirmNoShowQRcodeBtn?: '1'; //签到成功后不展示刷码签到按钮
    isTakeNumerWithPay?: '1'; //是否为缴费取号模式
  };

  // 门诊缴费  CLINIC_PAY_CONFIG ...
  pay: {
    /**
     * 列表页
     */
    /** 可以切换院区? */
    isListToggleHos?: '1';
    /** 扫码进来(带 params 场景下待缴费无数据的跳转动作) */
    scanPayEmptyAction?: TButtonConfig;

    /**
     * 待缴费选择选择医保或者慢特病点击支付存在自费项目时候， 引导先自费（可以继续缴费医保或者慢特病）
     */
    isGuideSelfPayFirst?: '1';
    /** isGuideSelfPayFirst === '1' 的情况下， 强制先自费， 默认勾选所有自费 */
    isForceSelfPayFirst?: '1';

    /** 门诊类型  网络医院/线下门诊 (是否展示) */
    isListShowClinicType?: '1';
    /** 待缴费点击缴费时候提示的协议编号 (不配没有) */
    confirmPayFg?: string;
    // 已缴费底部的按钮
    payedFooterBtn?: TButtonConfig | TButtonConfig[];
    /** 预结算 */
    isPreSettle?: '1';

    /** 是否开启数字人民币支付 */
    payList?: {
      wx?: IPayListObj;
      alipay?: IPayListObj;
    };
    /** 扫码缴费是否隐藏列表金额 */
    isScanListHideMoney?: '1';

    /** 页面顶部 banner */
    bannerPay?: TBannerConfig;

    //门诊缴费自定义tabs
    tabField?: IOptions[];

    //支付后已缴费列表是否查询草药代煎列表
    isQueryChineseMedicine?: '1';

    //门诊缴费列表支持分项支付
    isListCanPayedItem?: '1';

    //门诊缴费支持库存调用释放
    // isDrugPreemption?: '1';
    /**
     * 详情页
     */
    /** 待缴费详情页面 的费用总额是否可以让用户选择缴费 */
    isSubitemPay?: '1';
    /** 子费用项(处方)可选缴费 */
    // isSubitemChildrenPay?: '1';
    /** 待缴费详情页禁用查看费用明细 */
    isDisabledShowCostList?: '1';
    // 申请退单
    isOpenChargeback?: '1';
    // 已缴费详情页面对某一条具体的费用进行申请退费
    isPayedItemDetailRefund?: '1';
    // 已缴费详情底部的按钮
    payedDetailFooterBtns?: TButtonConfig[];

    // 缴费完成后跳转
    /**
     * prop 对应缴费列表 clinicType 值
     * 1-线下就诊
     * 2-网络问诊
     * 3-会诊
     */
    pageNextAdress?: Record<
      '1' | '2' | '3',
      {
        /**
         * @mode
         * 1-电子导诊单
         * 2-药品助手
         * 3-门诊取号
         */
        mode: '1' | '2' | '3';
        extraData?: BaseObject;
      }
    >;

    // 缴费完成后跳转 与 pageNextAdress 区别是不看 clinicType 且 pageNextAdress 优先
    payNextAction?: TButtonConfig;

    // 医保在线配置(个别项目需要支持医保退费但不需要医保支付)-  默认开启， 关闭时候设置 '0'
    medical?: {
      // 开启挂号医保
      isMedicalOrder?: '0' | '1';
      // 开启门诊医保
      isMedicalPay?: '0' | '1';
    };
  };

  /** 移动端伦理委员会(h5) */
  LUN_LI?: {
    // 对应科室id
    [key: string]: {
      entranceType: string;
      iconfont: string;
      title: string;
    };
  };

  /** 就诊人 PERSON_FAMILY_CARDMAN */
  person: {
    // 本系统不需要完善
    isSkipPerfect?: '1';
    // pagesA/medicalCardMan/medicalCardMan
    /** 本系统禁用就诊卡二维码 */
    isQrCodeDisabled?: '1';
    /** 点击就诊卡详情时候是否可以选择去 "电子医保凭证"小程序 (自费二维码|医保二维码), 二维码详情页加入医保码切换 */
    isMedicalQrChoose?: '1';
    /** 开放实名认证(去认证-就诊人列表按钮) */
    realNameAuth?: ('ocrVerify' | 'faceVerify')[];
    /** 手机号+姓名 新增就诊人成功后是否提示进入实名流程 */
    isRealNameAuthAfterAdd?: '1';
    /** 新增就诊人后进行免密代扣授权(开启后预约挂号时替换挂号接口, 病案) */
    isPayWithoutSecretAuth?: '1';
    /** 修改家庭成员中就诊人手机号 */
    isEditPatPhone?: '1';
    /** 允许该平台访问院内此用户的就诊数据 */
    isUserInfoShareAgree?: '1';
    /** 就诊人列表/详情 开放被绑定查询及解绑 */
    isSearchPatBound?: '1';
    /** 被绑定查询页面中解绑是否要人脸验证 */
    isRemoveBindingByFaceVerify?: '1';

    /**
     * 表单填写补充字段
     * referenceId - 备注
     * countries - 国籍
     * relationship - 关系
     */
    formExtraKeys?: TPersonExtraKey[]; // 一起加
    formExtraKeysInAddPatPage?: Exclude<TPersonExtraKey, string>[]; // 仅添加就诊人详情页面
    formExtraKeysInQuickAddPatPage?: Exclude<TPersonExtraKey, string>[]; // 仅快速添加就诊人页面
    formNotDisableKeysInQuickAddPatPage?: Exclude<TPersonExtraKey, string>[]; // 快速添加就诊人页面,默认值取消

    // medicalCardMan/perfectReal  pagesA/medicalCardMan/addMedical
    isVerifyIdCardLastFourNumber?: '1';
    /** 新增就诊人页面 (medicalCardMan/perfectReal)页面是否有 '就诊人类型' 一行 */
    isHidePatientTypeInPerfect?: '1' | '0';
    /** 开启短信验证？ 完善时候没有 */
    isSmsVerify?: '1';
    /** 短信验证时候图形验证? */
    isSmsVerifyWithImgCode?: '1';
    // /** 就诊人列表存在补充证件号入口 */
    isCanAddPatCardNo?: '1';
    /** 就诊人列表存在补充监护人入口 */
    isCanAddGuardian?: '1';
    // 新增就诊人是否监护人手机号
    // isUpNamePhone?: '1';
    /** 新增、完善就诊人时候 根据监护人证件号（身份证）判断监护人（至少 guardianAge 岁） */
    ageGuardian: number;
    /** 新增、完善就诊人时候 根据 生日｜身份证 判断 新生儿（至多 ageChildren 月） */
    ageChildren: number;
    /** 新增就诊人页面有证件且证件类型 身份证时候  小于默认isGuardianWithIdCardAge(6)岁 是否监护人 ？ */
    isGuardianWithIdCard?: number;
    // 不需要地址
    isDropAddress?: '1';
    // 不可删除本人
    isNotDeleteSelf?: '1';
    defaultAddress?: { provinces?: string; citys?: string; areas?: string };
    // 所在地区排序
    sortProvinces?: string[];
    sortCitys?: string[];
    sortAreas?: string[];

    // 不需要民族
    isDropNation?: '1';
    /**
     * 仅微信, 支付宝 手动 config.json 配置 isOpenOcr
     * 情况有变, 支付宝 也可以直接在这儿(但目前没做), 需要开通 https://b.alipay.com/page/product-workspace/product-detail/I1080300001000043632
     * 支付宝基本申请开了之后也会同时支持人脸
     */
    ocr?: '0' | '1';
    isFace?: '1';
    // 存在监护人 人脸使用监护人
    isUpFace?: '1';
    /** 适用人脸范围 默认 [17, 60] */
    faceAgeRange?: [number, number];
    // 远程人脸
    isFaceRemote?: '1';

    // 修改建档手机号 pagesA/medicalCardMan/ocrUser
    isCanChangeHosPhone?: '1'; // 前提需要开通 ocr | 人脸 至少一个
    isChangeHosPhoneWay?: ('ocr' | 'face')[]; // 和 useFaceVerifyInChangePhone 具备重复性
    useFaceVerifyInChangePhone?: '1'; // 使用人脸认证, 否则使用 ocr 认证
  };

  // 病案 MEDICAL_CASE_COPY
  medRecord: {
    /**
     * 增取件方式 1快递邮寄，2自取，3邮箱
     */
    pickupTypeOpt: IOptions<'1' | '2' | '3'>[];

    /**
     * 身份证上传要求 （人像、 背面、 手持）
     * 后端说 人像、 背面 必填 设置时候每次都加下
     */
    sfz: TMedRecordSfz[];
    isHandPhoto?: '1'; // 设置后 sfz设置无效 变 -> ['front', 'end', 'handler']
    /** sfz 配置中 front 的进行 ocr认证 */
    isOcrSfz?: '1';
    /** 不配置时候 sfz 中所有图片必须上传, 配置时候对应字段必须上传 可以使用 ['front|hkb'] 这样的格式 */
    requireSfz?: string[];
    /** 按照业务类型配置需要上传的证件(设置后 sfz 参数将无效) */
    photoConfig?: {
      modes: IMedicalPhotoMode[];
    };
    /** 选择上传图片的方式，默认支持相册与相机 */
    photoChooseWay?: 'album' | 'camera';

    // 病案代理申请(选择家属代办)
    patProxy?: '1';
    // patProxy 时候开启人脸
    patProxyFaceVerify?: '1';

    /** 复印目的 不配置使用原来的那几个目的 */
    purpose?: string[];
    /** 可选择的复印目的长度 默认 3 */
    selPurposeLen?: number;
    // /** 至少选择的复印目的长度 */
    // selPurposeLenAtLeast?: number;
    /** 目的有没有份数可以选择 */
    isPurposeRadio?: '1';

    /** 复印材料 不配置或为空则不显示 */
    material?: string[];
    /** 可选择的复印材料数量 默认 3 */
    selMaterialLen?: number;
    /** 复印材料跟着住院记录走 */
    materialInRecord?: '1';

    /** 收钱方式 0 预收 1 按项目、目的(tollMode) 2    */
    isItemCount?: '0' | '1'; // 优先级更高
    tollMode?: '1'; // isItemCount(字段不统一)
    /** isItemCount | tollMode 为 1 时, 计算的金额不受选了多个目的影响 */
    itemCountExcludeAim?: '1';

    /**  收钱方式预收的金额 ｜ 单个项目金额 */
    fee: number;
    price?: number; // fee(字段不统一)
    hosId: string;

    /** 是否支持自定义住院记录 */
    isCustomPatRecord?: '1';
    /** 手动添加记录里面是否可以切换院区 */
    isToggleHos?: '1';
    /** 手动添加记录(出入院日期)自定义截止日期 YYYY-MM-DD */
    isCustomPatRecordEndDate?: string;
    /* 是否下载委托书 */
    isMandateUrl?: string;
    /** 支持住院记录中选择目的的份数? */
    selPurposeInRecord?: '1';
    /** 复印最大份数 */
    maxNum?: number;

    /** 快递公司(新增病案时候的快递公司选择) */
    company?: (IOptions & {
      // 快递方式描述 (到付, 寄付..)
      des?: string;
    })[];
  }[];

  //住院服务 PATIENT_SERVICE_CONFIG
  hospitalCare: {
    //顶部tab
    /** {"value":"0","label":"住院信息"},{"value":"1","label":"日费用清单"},{ "value": "2", "label": "历次住院清单" } */
    tab: IOptions<'0' | '1' | '2' | '3'>[];
    //配置的预缴金额 [500,1000,2000,3000,5000,10000]
    inPatientPrePay: string[];
    /** 共3种模式：默认 1 不限制金额，2 仅支持整数金额，3 仅支持百倍金额输入  */
    isMode: '1' | '2' | '3';
    //列表1 详情2 住院总计清单
    isHosTotallist: '1' | '2';
    //列表1 详情2 日费用清单模式
    isHosDaylist: '1' | '2';
    //0否 1 是 是否支持预交金记录查询
    isQueryPreRecord?: '1';
    //是否关闭预交金充值入口
    isHidePay?: '1';
    // phs接口：getInHospitalInfo 新增字段 prepaymentPayCount, 不能超出此限制
    maxPayNumCount?: number;
    /** 是否开启数字人民币支付 */
    payList?: {
      wx?: IPayListObj;
      alipay?: IPayListObj;
    };

    /**
     * pagesC/hospitalAccount/hospitalAccount
     * 查看充值及消费记录
     */
    isOpenLookRecordBtn?: '1';
    /** 隐藏充值按钮 */
    isHideAccountRefillBtn?: '1';
    // 支持退款
    isAccountCanRefund?: '1';

    /** 住院预约前查询当前就诊人是否有自助入院，有则跳转至自助入院页面 */
    isSelfQueryBeforeAppoint?: '1';

    /**
     * hospitalCare/changeOrder
     */
    // 展示 "备注" 字段
    isChangeOrderRemarkShow?: '1';

    /**
     * pagesA/hospitalCare/choosePatientInfo
     */
  };

  //报告查询 REPORT_QUERY_CONFIG
  reportQuery: {
    // 开启报告解读（目前嘉二是列表 其他默认都详情）
    reportAnalysis: '1';
    // 报告解读悬浮框图片  标准版 中医版reportAnalysisImg_1001035.png
    reportAnalysisImg: string;
    // 列表页开放选择时间
    isOpenFilterReportByTime?: '1';
    // 详情页开放收藏按钮
    isOpenCollect?: '1';
    //顶部tab
    reportTab: IReportConfigTab[];
    //0否 1 是 是否显示水印
    isWatermark: '1';
    //水印文案 (二维码不支持中文 取消该字段, 取医院名字)
    // watermarkText?: string;
    //0否 1 是 是否开启医生名片入口
    isDoctorCard: '1';
    //0否 1 是 是否开启支持下载报告 开启这个配置且有图文的前提 页面才会实现
    isDownloadRepor?: '1';
    //0否 1 是 是否支持查看图文报告 有图文必有下载功能
    isGraphic?: '1';
    /** 检查报告查询第三方 点击检查跳转第三方h5 */
    isCheckThirdParty?: '1';
    /** 检查报告云影像复制链接前往h5查看*/
    isCheckGetYunUrlByH5?: '1';
    /** 检查报告图文报告复制链接前往h5查看*/
    isJCGetImageUrlByH5?: '1';
    isJYGetImageUrlByH5?: '1';
    isTJGetImageUrlByH5?: '1';
    /** 云影像复制链接前往h5查看*/
    isJCGetYunUrlByH5?: '1';
    isJYGetYunUrlByH5?: '1';

    /** 报告查询列表云影像链接 */
    listYun?: {
      // 只传入 imgUrl 调用后端接口获取三方h5链接
      imgUrl: string; // https://phsdevoss.eheren.com/pcloud/phs3.0/stand3-yun-banner.png
    } & TBannerConfig;

    jyListFooterBtn?: TButtonConfig[] | TButtonConfig;
    jcListFooterBtn?: TButtonConfig[] | TButtonConfig;
    defaultListFooterBtn?: TButtonConfig[] | TButtonConfig;

    // 详情里面浮窗引导提示的按钮组(报告看不懂？结果有疑问?)
    jyHoverTipBtns?: TButtonConfig[] | TButtonConfig;
    jcHoverTipBtns?: TButtonConfig[] | TButtonConfig;

    // 详情里面底部按钮
    jcBottomNav?: TReportDetailBottomConfig;
    jyBottomNav?: TReportDetailBottomConfig;
    //类型是体检的 和 tab 无关
    tjBottomNav?: TReportDetailBottomConfig;
  };

  /** 药品配送 DRUG_DELIVERY_CONFIG */
  drugDelivery: {
    company?: Array<{ label: string; value: string; iceBagfee?: string }>;

    /** 中药代煎外配详情 内跳快递小程序的appid*/
    deliveryFired?: {
      wx?: string;
      alipay?: string;
    };

    // 药品配送中药代煎需要验证收货人与就诊人一致
    deliveryFiredVerifySelf?: '1';
    // 指定后端提交类型
    deliveryType?: string;

    //支持选择冰袋
    isSelectIceBag?: '1';
    //支持快递下单支付
    isPayOnline?: '1';
  };

  /** 病历查询 */
  CASE_HISTORY_CONFIG: {
    //  列表页tab
    tab: IOptions[];
    // 门诊病历详情底部按钮
    clinicDetailBtns: IOptions<'preview' | 'down'>[];
  };

  /** 健康咨询 */
  HEALTH_COUNSEL: {
    // '' 咨询  '1' 视频
    listTopTab: IOptions<'' | '1'>[];
    //首页的公告替换成别的轮播内容与点击事件
    noticeReplaceParam?: TButtonConfig & { buttonName?: string };
  };

  /** 自助开单 SELF_BILLING */
  selfBilling: {
    footerBtn?: TButtonConfig;
    tabs?: IOptions[];
    multi?: '1'; // 多选?
    /** 选择医院页面需要过滤的医院 */
    hideHosIds?: string[];
  };

  /** 名医名科 */
  FAMOUS_DOCTOR_DEPT: {
    // 隐藏健康科普?
    isHideScienceHealth?: '1';
  };

  // --------- h5
  /** 用药查询 */
  MEDICAL_SEARCH: {
    banner?: TBannerConfig;
  };

  /** 电子导诊单 */
  Electronic_Consultation_Sheet: {
    toLocationMiniProgram?: {
      appId: string;
      path: string;
      // 会拼接到path中, 但需要取点击到当前行中存在的数据
      myExtraData: BaseObject;
    };

    // 开启后列表子项开放 "出示就诊码" 按钮, 隐藏底部的
    isItemQrCodeShow?: '1';
    navBtns?: TButtonConfig[];
    //智能医助
    intelMedicalAssistConfig?: {
      //选择智能医助虚拟人物
      distinctiveImage?: {
        imageList?: Array<string>;
        noLoginNotice?: string;
      };
      //企微客服按钮，例{"extInfo": "https://work.weixin.qq.com/kfid/kfc0987f35e21a6f2bd","corpId": "wwdbaea46632b03769"}
      isOpenWxServiceBtn?: Object;
      //开启和仁导诊
      isIntelligentGuidance?: '1';
      //h5版本智能客服开启语音识别
      isH5OpenWechatSI?: '1';
      //是否替换首页的搜索框
      isReplaceHomeSearch?: '1';
      //微信小程序是否启用流文本形式Api
      isWXStreamApi?: '1';
      //是否开启报告解读
      isReportAnalysis?: '1' | '2'; //1:开启上传报告解读和本院报告解读功能，2:仅开启上传报告进行解读
      guessAskList?: Array<{ label: string; value: string }>;
      //isSelfMethod:reportAnalysis 报告解读功能
      //isSelfMethod:openWxService 唤起企业微信 在 "extraData"中跟isOpenWxServiceBtn的参数一致
      //isSelfMethod:makePhone 唤起手机电话  例：在 "extraData"中{"phone":"400-060-0763"}
      guessServerList?: Array<TButtonConfig & { isSelfMethod?: string }>;
    };
    //智能陪诊
    medicalAsistantConfig?: {
      //智能陪诊日期右侧区域的按钮
      timeLineBtn?: Array<TButtonConfig>; //写死的按钮
      contentBtn?: TButtonConfig[]; //依次为：查看报告、院内导航、用药指导、查看预约、立即预约，没有则路径传空字符串{path:''}
      bottomBtn?: TButtonConfig[]; //最多展示两个icon按钮和两个普通按钮
    };
  };

  /** 手术进度查询 */
  Operation_Search: {
    // 开启手术订阅 ?
    isOpenSubscribe?: '1';
  };

  /** 杂项配置（客服、意见反馈、隐私政策、入口选择页)- */
  RestOfConfig: {
    //隐私政策
    isOpenAIPolicy?: '1';
    //自定义隐私政策列表，为空则展示默认值
    policyList?: Array<Array<{ label: string; flag: string }>>;

    // home 页面底部产品图标
    homeProductionIcon?: string;
    //手机号验证码登录
    isLoginByPhoneVerify?: '1';

    // 客服中心  pagesA/serviceCenter/serviceCenter
    // 意见反馈使用自定义的页面?
    isCustomFeedback?: '1';
    //匿名意见反馈
    anonymousFeedback?: '1';
    // 常见问题模式 默认一层层点页面
    serviceProblemMode?: '1'; // 1 抽屉模式

    // 开启咨询客服弹窗
    isOpenMyService?: {
      extInfo: string;
      corpId: string;
    };
    //开启拨打电话
    isOpenPhone?: string;
    //开启腾讯在线客服
    isTxService?: '1';
    //开启腾讯意见反馈
    isTxFeedback?: '1';
    //失物招领电话
    lostAndFoundPhone?: string;
    //自定义按钮
    customBtn?: {
      label: string; // 标题
      subLabel?: string; // 副标题
      icon?: string; //icon
      config: TBannerConfig;
    }[];

    //入口选择页pagesD/common/chooseTabJump
    tabJumpConfig?: {
      title?: string; //页面标题，无则标题展示空
      showFlag?: number; //页面底部协议，无则不展示
      entryType?: string; //多次使用需跟页面路由参数入口一致，无则取第一项
      tabs?: Array<
        TButtonConfig & { bgSrc?: string; subTitle?: string; height?: string }
      >; //bgSrc背景图 height//背景图高度
    }[];
    //h5通用协议阅读页
    flagReadConfig?: {
      entryType?: string; //多次使用需跟页面路由参数入口一致，无则取第一项
      flag?: string; //协议号
      footerBtn?: Array<TButtonConfig & { btnType?: string; flex?: string }>; //底部按钮,btnType 按钮类型 flex: 按钮宽度比例
    }[];
  };
}

type TInsertEnv<T extends BaseObject, S extends keyof any> = {
  [K in keyof T]: T[K] & { [P in S]?: T[K] };
};

/** 报告查询详情底部按钮 */
type TReportDetailBottomConfig = {
  btnAskDoc?: '1';
  btnReOrder?: '1';
  btnNotShare?: '1';
};

export type ISystemConfig = TInsertEnv<ISystemConfig_, TConfigEnv>;

export type TConfigEnv = 'inWx' | 'inAlipay';

type TMedicalPhotoKey = (typeof MEDICAL_PHOTOS)[number]['value'];

export interface IMedicalPhotoMode extends IHOptionItem {
  /** 业务类型1 本人办理，2代成年人办，3代未成年人办理，4代死亡人员办理 */
  value: string; // 配置必填
  photos: TMedicalPhotoKey[]; // 存在默认值(可以不配置)
  require: (TMedicalPhotoKey | string)[]; // 存在默认值
  children: (IHOptionItem & { url: string })[]; // 程序生成, 不需要配置
}

export interface IHosInfo {
  address: string;
  aliasName: string;
  hosId: string;
  hosName: string;
  hosLevel: number;
  hosLevelName: string;
  hosPhoto: string;
  hosType: string;
  ifClick: string;
  intro: string;
  sender: string;
  senderAddress: string;
  senderPhone: string;
  distance?: number; // 距离 （m）
  distanceFormat?: string; // 距离 （km）
  gisLat?: number; // 经度
  gisLng?: number; // 纬度
  label: string;
  value: string;
  hosLogo: string;
  tcHosId?: string; // 通策的一级hosId
  tcSubHosId?: string; // 通策的二级hosId
  schTime?: string; //  点击院区时，支持弹框显示 就诊提醒
}

export type TBannerConfigBase = {
  src?: `http${string}`;
  /** 会添加到path 后面的 query 里面 */
  extraData?: BaseObject;
  /** h5 跳转完整路径 其他跳转 如 home/my */
  path: string;
  /**  固定的附加参数(动态值) 键名为查找域中的值 键值为新的键名 */
  addition?: {
    // 传入保证需要登录
    token?: string;

    // 传入保证需要就诊人
    patientId?: string;
    cardNumber?: string;

    // 传入保证需要完善
    herenId?: string;

    openId?: string;

    // useTBanner 传入 additionData (配合业务手动注入 additionData)
    [key: string]: any;
  };
};

type TBannerConfigH5 = {
  type: 'h5';
  /** 我们的 h5 (v3) 跳自己h5 必设置(参数加密.....) */
  isSelfH5?: '1';
  isLocal?: '1'; // 当他不存在
} & TBannerConfigBase;

type TBannerConfigSelf = {
  type: 'self';
} & TBannerConfigBase;

type TBannerConfigNet = {
  type: 'netHospital';
} & TBannerConfigBase;

type TBannerConfigOtherProgram = {
  type: 'otherProgram';
  appId: string;
  envVersion?: 'release' | 'develop' | 'trial';
  deepProps?: BaseObject;
} & TBannerConfigBase;

type TBannerConfigBackProgram = {
  type: 'backProgram';
  appId: string;
  envVersion?: 'release' | 'develop' | 'trial';
  deepProps?: BaseObject;
} & TBannerConfigBase;

export type TBannerConfig = XOR<
  XOR<
    TBannerConfigOtherProgram,
    XOR<TBannerConfigSelf, XOR<TBannerConfigNet, TBannerConfigH5>>
  >,
  TBannerConfigBackProgram
>;

export type TButtonConfig = Omit<TBannerConfig, 'src'> & {
  text: string;
  icon?: string;
  isExpired?: string;
};

/**
 * 首页菜单配置
 */
export type TBannerHomeMenuConfig = TBannerConfig & {
  _type: 'useTBanner';
  _tip?: string;
  _disabled?: '1';
};

/** 挂号记录*/
type TRegListButtonItem = {
  /** 哪些环境显示, 不配全显 */
  env?: ('wx' | 'alipay' | 'h5')[];
  /** 哪些状态时候显示, 不配全显 */
  orderStatus?: string[];
} & TButtonConfig;

export interface IRegSearchHistoryItem {
  label: string;
  hot?: '1'; // 标记 🔥
}

export interface IReportConfigTab {
  headerType: string;
  headerName: string;
  typeId: number;
}

export interface IPayListObj {
  digital: '1';
  channel: string;
  businessType: string;
}

type TMedRecordSfz = 'front' | 'end' | 'handler' | 'handlerBack' | 'hkb';
