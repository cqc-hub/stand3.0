import { getLocalStorage, setLocalStorage } from '@/common';
import { ISelectOptions } from '@/components/g-form';
import { GStores } from './login';
import { type XOR } from '@/typeUtils/obj';
import { joinQuery } from '@/common';
import { beforeEach } from '@/router/index';

import api from '@/service/api';
import globalGl from '@/config/global';

type TBannerConfigBase = {
  src: `http${string}`;
  extraData?: BaseObject;
  path: string; // h5 跳转完整路径 其他跳转 如 home/my
  addition?: {
    token?: string;
    patientId?: string;
    herenId?: string;
  }; // 固定的附加参数(动态值) 键值为新的键名
};

type TBannerConfigH5 = {
  type: 'h5';
  isSelfH5?: '1'; // 我们的 h5 (v3)
  isLocal?: '1'; // 当他不存在
} & TBannerConfigBase;

type TBannerConfigSelf = {
  type: 'self';
} & TBannerConfigBase;

type TBannerConfigOtherProgram = {
  type: 'otherProgram';
  appId: string;
} & TBannerConfigBase;

export type TBannerConfig = XOR<
  TBannerConfigOtherProgram,
  XOR<TBannerConfigSelf, TBannerConfigH5>
>;

export type TButtonConfig = Omit<TBannerConfig, 'src'> & {
  text: string;
};

// 未指定说明的 '0' 均为 false '1' true
export interface ISystemConfig {
  // 预约挂号
  order: {
    // 选择科室医生页面顶部可选择的天数， chooseDay > 20 出现组件 ‘日历’
    chooseDay: number;
    // 选择号源时候显示几列
    selOrderColumn: number;
    // 精确号源?
    isOrderBlur: '0' | '1';
    // 选科室上面 banner
    bannerOrder?: TBannerConfig;
    // 展示号源数不为空的，超过当前时间的号源是否展示
    isHideOutTimeOrderSource?: '0' | '1';
    // 预约挂号时候付钱?
    isOrderPay: '0' | '1';

    /** 挂号记录 */
    // 显示院内导航按钮? 挂号状态 string
    isHosNavigation?: string[];
    // 排队叫号?
    isQueuing?: string[];
    // 服务评价?
    isFWBtn?: string[];
  };

  // 就诊人
  person: {
    // 新增就诊人页面 (medicalCardMan/perfectReal)页面是否有 '就诊人类型' 一行
    isHidePatientTypeInPerfect?: '0' | '1';
    // 开启短信验证？ 完善时候没有
    isSmsVerify?: '0' | '1';
    // 新增、完善就诊人时候 根据监护人证件号（身份证）判断监护人（至少 guardianAge 岁）
    ageGuardian: number;
    // 新增、完善就诊人时候 根据 生日｜身份证 判断 新生儿（至多 ageChildren 月）
    ageChildren: number;

    // 新增就诊人页面有证件且证件类型 身份证时候 小于6岁 是否监护人？
    isGuardianWithIdCard?: '0' | '1';

    ocr?: '0' | '1';
    isFace?: '1';
  };

  // 病案
  medRecord: {
    // 身份证上传要求 （人像、 背面、 手持）
    sfz: ('front' | 'end' | 'handler')[]; // 后端说 人像、 背面 必填 设置时候每次都加下

    // 收钱方式 0 预收 1 按项目、目的
    isItemCount?: '0' | '1';

    // 收钱方式预收的金额 ｜ 单个项目金额
    fee: number;
    hosId: string;
  }[];

  // 门诊缴费
  pay: {
    /**
     * 列表页
     */

    // 门诊类型  网络医院/线下门诊 (是否展示)
    isListShowClinicType?: '1';
    // 待缴费点击缴费时候提示的协议 (不配没有)
    confirmPayFg?: string;
    // 已缴费底部的按钮
    payedFooterBtn?: TButtonConfig;
    // 预结算
    isPreSettle?: '1';
  };
}

export interface IHosInfo {
  address: string;
  aliasName: string;
  hosId: string;
  hosName: string;
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
}

const _cacheMap = new WeakMap();

const Med_Copy_Config = { name: 'Med_Copy_Config' };

const getMedRecordConfig = async <T>(result: any): Promise<T> => {
  const list = _cacheMap.get(Med_Copy_Config);

  if (list) {
    return list;
  }

  // const { result } = await api.getParamsMoreBySysCode({
  //   paramCode: 'MEDICAL_CASE_COPY',
  // });

  if (result && result.MEDICAL_CASE_COPY) {
    const _configList = JSON.parse(result.MEDICAL_CASE_COPY);

    if (_configList.length) {
      const configList: any[] = [];
      Object.entries(_configList[0]).map(([hosId, value]) => {
        const { tollMode, price, isHandPhoto } = value as any;

        const isItemCount = tollMode === '1' ? '1' : '0';

        configList.push({
          hosId,
          isItemCount,
          fee: price * 1,
          sfz:
            isHandPhoto === '1'
              ? ['front', 'end', 'handler']
              : ['front', 'end'],
        });
      });
      // _cacheMap.set(Med_Copy_Config, configList);

      return <T>configList;
    } else {
      throw new Error('未配置_medCopyList');
    }
  } else {
    throw new Error('未配置_medCopy');
  }
};

export const useTBanner = async (config: Omit<TBannerConfig, 'src'>) => {
  const { type, extraData = {}, path, appId, addition } = config;
  let [isLogin, isPatient] = [false, false];

  if (addition) {
    const { token, patientId, herenId } = addition;
    const gStores = new GStores();
    if (patientId) {
      extraData[patientId] = gStores.userStore.patChoose.patientId;
      isPatient = true;
    }

    if (token) {
      extraData[token] = gStores.globalStore.getToken;
      isLogin = true;
    }

    if (herenId) {
      isLogin = true;
      extraData[herenId] = gStores.globalStore.herenId;
    }
  }

  let fullUrl = joinQuery(path, extraData);

  const pages = getCurrentPages();

  if (pages.length) {
    const _fullUrl: string = (pages[pages.length - 1] as any).$page.fullPath;

    await beforeEach({
      url: _fullUrl,
      _isLogin: isLogin,
      _isPatient: isPatient,
    });
  }

  if (type === 'h5') {
    if (config.isSelfH5) {
      let baseUrl =
        (globalGl.env as any) === 'prod'
          ? 'https://h5.eheren.com/v3/#/'
          : 'https://health.eheren.com/v3/#/';

      if (config.isLocal) {
        baseUrl = 'http://10.10.83.70:3000/#/';
      }
      fullUrl = baseUrl + fullUrl;
    }
    // #ifdef H5
    location.href = fullUrl;
    // #endif

    // #ifndef H5
    const url = joinQuery('/pagesA/webView/webView', {
      https: encodeURIComponent(fullUrl),
    });

    uni.navigateTo({
      url,
    });
    // #endif
  } else if (type === 'self') {
    const url = `/${fullUrl}`;

    uni.navigateTo({
      url,
    });
  } else {
    uni.navigateToMiniProgram({
      appId: appId!,
      path,
      extraData,
    });
  }
};

export class ServerStaticData {
  /**
   * 医院列表
   */
  static async getHosList(
    data = {},
    opt: { noCache: boolean } = { noCache: false }
  ): Promise<IHosInfo[]> {
    let hosList = getLocalStorage('hosList') || _cacheMap.get(this.getHosList);

    if (!(hosList && hosList.length) || opt.noCache) {
      const { result } = await api.getHospital<IHosInfo[]>(data);

      result.map((o) => {
        const { distance, hosId, hosName } = o;

        o.label = hosName;
        o.value = hosId;

        if (distance) {
          o.distanceFormat = (distance / 1000).toFixed(1);
        }
      });

      hosList = result;

      _cacheMap.set(this.getHosList, result);

      // setLocalStorage({
      //   hosList: result
      // });
    }

    return hosList;
  }

  /**
   * 选择地址的数据
   */
  static async getAddressData(): Promise<ISelectOptions[]> {
    const addressCity =
      getLocalStorage('addressCity') || _cacheMap.get(this.getAddressData);

    if (!addressCity) {
      const { result } = await api.getAllDivision({});

      if (result && result.length) {
        setLocalStorage({
          addressCity: result,
        });

        _cacheMap.set(this.getAddressData, result);

        return result;
      } else {
        return [];
      }
    } else {
      return addressCity;
    }
  }

  static async getAddMedicalData() {
    let addMedicalData = getLocalStorage('addMedicalData');

    if (!addMedicalData) {
      await api.getTermsBySysAndCode({
        domainCode:
          'USE_DRUG_UNIT|USE_DRUG_USES|USE_DRUG_WAY|USE_DRUG_FREQUENCY',
      });
    }
  }

  /**
   * label: "已预约", value: "0"
   */
  static async getSystemTerms(): Promise<ISelectOptions[]> {
    const sysTerms =
      <ISelectOptions[] | undefined>getLocalStorage('sysTerms') ||
      _cacheMap.get(this.getSystemTerms);

    if (!sysTerms) {
      const { result } = await api.getParamsMoreBySysCode({
        paramCode: 'REG_ORDER_STATUS',
      });

      const list = result && result.REG_ORDER_STATUS;

      if (list) {
        const res = JSON.parse(list).map((item) => {
          return {
            label: item.label,
            value: item.code,
          };
        });

        // setLocalStorage({
        //   sysTerms: res
        // });

        _cacheMap.set(this.getSystemTerms, res);

        return res;
      } else {
        return [];
      }
    } else {
      return sysTerms;
    }
  }

  /**
   * 民族
   */
  static async getNationTerms(): Promise<ISelectOptions[]> {
    const nationTerms =
      <ISelectOptions[] | undefined>getLocalStorage('nationTerms') ||
      _cacheMap.get(this.getNationTerms);

    if (!nationTerms) {
      const { result } = await api.getTermsBySysAndCode({
        domainCode: 'CHINESE_NATION',
      });

      const list = result && result.length && result[0].terms;

      if (list) {
        const res = list.map((o) => ({
          label: o.label,
          value: o.code,
        }));

        _cacheMap.set(this.getNationTerms, res);
        // setLocalStorage({
        //   nationTerms: res
        // });

        return res;
      } else {
        return [];
      }
    } else {
      return nationTerms;
    }
  }

  /**
   * 就诊人类型
   */
  static async getPatientTypeTerms(): Promise<ISelectOptions[]> {
    const gStores = new GStores();

    const patientTypeTerms =
      <ISelectOptions[] | undefined>getLocalStorage('patientTypeTerms') ||
      _cacheMap.get(this.getPatientTypeTerms);

    if (!patientTypeTerms) {
      const { result } = await api.getParamsMoreBySysCode({
        paramCode: 'PATIENT_TYPE',
      });
      const PATIENT_TYPE = result.PATIENT_TYPE;

      try {
        const patientTypeTerms = JSON.parse(PATIENT_TYPE);

        // setLocalStorage({
        //   patientTypeTerms
        // });
        _cacheMap.set(this.getPatientTypeTerms, patientTypeTerms);

        return patientTypeTerms;
      } catch (err) {
        gStores.messageStore.showMessage('获取就诊人类型失败');
        console.error('获取就诊人类型失败: ', err);
        return [];
      }
    } else {
      return patientTypeTerms;
    }
  }

  /**
   * 01身份证 02居民户口簿 03护照 031中国籍普通护照
   */
  static async getIdTypeTerms(): Promise<ISelectOptions[]> {
    const gStores = new GStores();

    const idTypeTerms =
      <ISelectOptions[] | undefined>getLocalStorage('idTypeTerms') ||
      _cacheMap.get(this.getIdTypeTerms);

    if (!idTypeTerms) {
      const { result } = await api.getParamsMoreBySysCode({
        paramCode: 'ID_CARD_TYPE',
      });
      const ID_CARD_TYPE = result.ID_CARD_TYPE;

      try {
        const idTypeTerms = JSON.parse(ID_CARD_TYPE);

        // setLocalStorage({
        //   idTypeTerms
        // });
        _cacheMap.set(this.getIdTypeTerms, idTypeTerms);

        return idTypeTerms;
      } catch (err) {
        gStores.messageStore.showMessage('获取卡类型失败');
        console.error('获取卡类型失败: ', err);
        return [];
      }
    } else {
      return idTypeTerms;
    }
  }

  static getOptionsLabel(list: ISelectOptions[], value) {
    const item = list.find((o) => o.value === value);
    if (item) {
      return item.label;
    } else {
      return '';
    }
  }

  /**
   * 首页配置的数据
   */
  static async getHomeConfig(): Promise<any[]> {
    const viewConfig = getLocalStorage('viewConfig');

    if (!viewConfig) {
      const arg = {
        version: '',
        source: 1,
      };

      // #ifdef H5
      arg.source = 3;
      // #endif

      const { result } = await api.queryHospitalPattern(arg);

      if (result && result.length) {
        setLocalStorage({
          viewConfig: result,
        });

        return result;
      } else {
        return [];
      }
    } else {
      return viewConfig;
    }
  }

  static async getSystemConfig<T extends keyof ISystemConfig>(
    key: T,
    payload: {} = {}
  ): Promise<ISystemConfig[T]> {
    // const res: ISystemConfig = {
    //   order: {
    //     chooseDay: 30,
    //     selOrderColumn: 3,
    //     isOrderBlur: '1',
    //     isOrderPay: '0',
    //   },

    //   person: {
    //     isHidePatientTypeInPerfect: '1',
    //     ageChildren: 6,
    //     ageGuardian: 18,
    //     isGuardianWithIdCard: '1',
    //     isSmsVerify: '0',
    //     ocr: '1',
    //   },

    //   medRecord: [
    //     {
    //       sfz: ['front', 'end'],
    //       isItemCount: '1',
    //       fee: 10,
    //       hosId: '100',
    //     },
    //   ],
    // };

    // return res[key];

    let systemConfig: ISystemConfig = getLocalStorage('systemConfig');
    if (!systemConfig) {
      //PERSON_FAMILY_CARDMAN 家庭成员 预约挂号 ORDER_REGISTER 病案复印MEDICAL_CASE_COPY
      const { result } = await api.getParamsMoreBySysCode({
        paramCode: 'PERSON_FAMILY_CARDMAN,MEDICAL_CASE_COPY,ORDER_REGISTER',
      });

      try {
        const person = JSON.parse(result.PERSON_FAMILY_CARDMAN || '{}');
        const medRecord = await getMedRecordConfig<ISystemConfig['medRecord']>(
          result
        );
        const order = JSON.parse(result.ORDER_REGISTER || '{}');
        systemConfig = {
          person,
          order,
          medRecord,
          pay: {
            isListShowClinicType: '1',
            payedFooterBtn: {
              addition: {
                patientId: 'patientId',
              },
              type: 'h5',
              extraData: {
                sysCode: '1001033',
              },
              path: 'https://health.eheren.com/v3_h5/#/pagesA/diseaseCyclopedia/index',
              text: '导诊单',
            },
            confirmPayFg: '15',
            // isPreSettle: '1',
          },
        };
      } catch (error) {
        throw new Error('序列化错误, 请检查全局的参数');
      }

      setLocalStorage({
        systemConfig,
      });
      return systemConfig[key];
    } else {
      return systemConfig[key];
    }
  }

  private constructor() {}
}
