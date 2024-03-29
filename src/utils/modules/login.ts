import {
  useGlobalStore,
  useUserStore,
  useMessageStore,
  useRouterStore,
  IPat,
  isAreaProgram,
} from '@/stores';
import { getSysCode, joinQuery } from '@/common';
import { getOpenId, getOpenidTtResult } from '@/components/g-pay/index';

import api from '@/service/api';
import globalGl from '@/config/global';
import { apiAsync } from '@/utils';

export enum LoginType {
  // 微信腾讯健康
  WeChatThReg,
  WeChat,
  AliPay,
  H5,
  TouTiao,
  PassWord,
}

abstract class LoginHandler {
  abstract handler(payload?: any): Promise<void>;
}

export const getH5OpenidParam = function (data) {
  const globalStore = useGlobalStore();

  // #ifdef MP-WEIXIN
  data.openIds = [
    {
      openId: globalStore.h5OpenId,
      source: '3',
    },
    {
      openId: globalStore.openId,
      source: '19',
    },
  ];
  // #endif

  // #ifdef MP-ALIPAY
  data.openIds = [
    {
      openId: globalStore.openId,
      source: '21',
    },
  ];
  // #endif
};

export const packageAuthParams = (
  args: {},
  url: string,
  payload: {
    isOutArgs?: boolean;
  } = {}
) => {
  if (['/register/bindRegisterUser'].includes(url)) {
    getH5OpenidParam(args);
  }

  const globalStore = useGlobalStore();
  const argsDefault = {
    sysCode: getSysCode(),
    ...args,
  };
  const { isOutArgs } = payload;
  let authParam = argsDefault;
  let outParam: BaseObject = {};

  if (isOutArgs) {
    (authParam as any) = undefined;
    outParam = argsDefault;
  }

  return {
    authParam: {
      args: authParam,
      ...outParam,
      token: globalStore.getToken,
    },
    sysCode: undefined,
    url,
  };
};

export class GStores {
  messageStore = useMessageStore();
  userStore = useUserStore();
  globalStore = useGlobalStore();
}

export class LoginUtils extends GStores {
  async getUerInfo(type?: 'alone', justGetInfo?: boolean) {
    try {
      const { source } = this.globalStore.browser;
      const { result } = await api.allinoneAuthApi(
        packageAuthParams(
          {
            source,
          },
          '/modifyUserInfo/userInfoByToken'
        )
      );

      if (result) {
        const {
          cellPhoneNum: phone,
          herenId,
          idNo,
          name,
          sex,
          phoneNum,
          authPhoneVerify,
        } = result;

        this.userStore.updateName(name);
        this.userStore.updateSex(sex);
        this.userStore.updateIdNo(idNo);
        // #ifdef MP-ALIPAY
        this.userStore.updateAuthPhoneVerify(authPhoneVerify);
        // #endif
        this.userStore.updatePhone({
          phone,
          phoneNum,
        });

        this.globalStore.setHerenId(herenId);

        // #ifdef MP-WEIXIN
        if (!this.globalStore.h5OpenId && globalGl.h5AppId) {
          uni.reLaunch({
            url: '/pages/home/startCome',
          });

          return Promise.reject('未获取 h5openid');
        }
        // #endif

        if (!herenId && !justGetInfo) {
          this.messageStore.showMessage('未完善，请先完善', 1000);
          setTimeout(() => {
            uni.reLaunch({
              url: globalGl.addPersonUrl + '?pageType=perfectReal',
            });
          }, 1200);

          return Promise.reject('未完善');
        } else {
          if (type !== 'alone') {
            //获取就诊人列表
            await new PatientUtils().getPatCardList();
          }
        }
      }
    } catch (error) {
      uni.hideLoading();
      return Promise.reject(error);
    }
  }

  // https://developers.weixin.qq.com/community/business/doc/000442d352c1202bd498ecb105c00d
  async faceVerify({ name, idCardNumber }) {
    // #ifdef MP-WEIXIN
    return new Promise((resolve, reject) => {
      wx.checkIsSupportFacialRecognition({
        checkAliveType: 2,
        success() {
          wx.startFacialRecognitionVerify({
            checkAliveType: 2,
            name,
            idCardNumber,
            success(e) {
              //识别成功
              console.warn('识别成功', e);
              resolve(void 0);
            },
            fail(err) {
              //识别失败
              this.messageStore.showMessage('识别失败');
              console.error('识别失败', err);
              reject(err);
            },
          });
        },

        fail: (err) => {
          //不支持人脸检测
          this.messageStore.showMessage('该设备不支持人脸检测');
          console.error('该设备不支持人脸检测', err);

          reject(err);
        },
      });
    });
    // #endif
  }

  async checkNoPublicOpenId() {
    if (this.globalStore.h5OpenId) {
      const herenId = this.globalStore.herenId;
      await this.sysPatOpenIdAssignment(herenId, this.globalStore.h5OpenId);
    }
  }

  // 微信获取公众号 openid
  async getNoPublicOpenId(code: string) {
    const {
      result: { openId },
    } = await api.allinoneAuthApi(
      packageAuthParams(
        {
          accountType: 1,
          code,
        },
        '/wx/getNoPublicOpenId',
        {
          isOutArgs: true,
        }
      )
    );

    this.globalStore.setH5OpenId(openId);

    const herenId = this.globalStore.herenId;

    if (herenId) {
      this.sysPatOpenIdAssignment(herenId, openId);
    }

    await this.getUerInfo();
  }

  //微信绑定openid接口
  async sysPatOpenIdAssignment(herenId, openId) {
    await api.sysPatOpenIdAssignment({
      herenId,
      openIds: [
        {
          openId: this.globalStore.openId,
          source: 19, //微信小程序openid
        },

        {
          openId,
          source: 3, //公众号openid
        },
      ],
    });
  }

  outLogin(
    options: Partial<{
      isHideMessage: boolean;
      isGoLoginPage: boolean;
    }> = {}
  ) {
    const { isHideMessage, isGoLoginPage } = options;
    this.userStore.clearStore();
    this.globalStore.clearStore();
    useRouterStore().clear();

    setTimeout(() => {
      if (!isHideMessage) {
        this.messageStore.showMessage('退出成功', 3000);
      }

      if (isGoLoginPage) {
        uni.reLaunch({
          url: '/pages/home/my',
          complete: () => {
            setTimeout(() => {
              this.messageStore.showMessage('请登录', 3000);
            }, 500);
          },
        });
      }
    }, 500);
  }

  // 注销用户
  async logoutUser() {
    await api.logoutUser({
      source: this.globalStore.browser.source,
    });
  }
}

class WeChatLoginHandler extends LoginUtils implements LoginHandler {
  async handler(payload?: any): Promise<void> {
    // 微信 必然有 payload
    if (!payload) return;
    const { target, detail } = payload;

    // if (!target.code) {
    //   this.messageStore.showMessage('用户未授权，请重新登录', 3000);
    //   return Promise.reject();
    // }

    if (detail.errMsg !== 'getPhoneNumber:ok') {
      this.messageStore.showMessage('用户取消授权', 3000);
      return Promise.reject(payload);
    }

    await new Promise<void>((resolve, reject) => {
      uni.showLoading({
        mask: true,
      });
      wx.login({
        success: async ({ code }) => {
          if (!code) {
            reject();
            return;
          }

          const accountType = this.globalStore.browser.accountType;

          const { result } = await api.allinoneAuthApi(
            packageAuthParams(
              {
                code,
                accountType,
              },
              '/wx/getWxOpenId',
              {
                isOutArgs: true,
              }
            )
          );

          if (result) {
            const { openId, sessionKeyEn, sessionKey } = result;
            const {
              encryptedData: encrypData,
              iv: ivData,
              code: phoneNumberCode,
            } = target;

            this.globalStore.setOpenId(openId);

            const requestData = {
              accountType,
              openId,
              sessionKeyEn,
              sessionKey,
              phoneNumberCode,
              ivData,
              encrypData,
            };

            const { result: loginResult } = await api.allinoneAuthApi(
              packageAuthParams(requestData, '/wx/wxLoginByPhoneNumberCode')
            );

            if (loginResult) {
              const { accessToken, refreshToken } = loginResult;
              this.globalStore.setToken({
                accessToken,
                refreshToken,
              });

              await this.getUerInfo();
              resolve();
            }
          } else {
            reject();
          }
        },

        complete: uni.hideLoading,
      });
    });
  }
}

let isLoading = false;
export class AliPayLoginHandler extends LoginUtils implements LoginHandler {
  async handler(): Promise<void> {
    return await this.handlerAuth();
    if (isLoading) {
      return;
    }

    uni.showLoading({
      mask: true,
    });

    try {
      isLoading = true;
      const getPhoneNumberOpt: BaseObject = {};
      const isvAppId = globalGl.systemInfo.isvAlipayAppid;
      if (isvAppId) {
        getPhoneNumberOpt.protocols = {
          isvAppId,
        };
      }

      /**
       * https://opendocs.alipay.com/isv/03l4j2
       * https://opendocs.alipay.com/isv/03kqzj#1.%20%E4%B8%BA%E6%A8%A1%E6%9D%BF%E7%94%B3%E8%AF%B7%E7%94%A8%E6%88%B7%E4%BF%A1%E6%81%AF
       * 待开发后台
       *  - 开发设置-应用网关
       *  - 产品绑定-绑定产品-获取会员手机号
       *
       * - 主体申请 会员手机号能力
       *
       */
      const { response: responseStr } = await apiAsync(
        my.getPhoneNumber,
        getPhoneNumberOpt
      );

      const accountType = this.globalStore.browser.accountType;
      const { authCode } = await apiAsync(my.getAuthCode, {
        // scopes: 'auth_user',
        scopes: 'auth_base',
      });
      const loginArg = {
        code: authCode,
        encrypData: responseStr,
        accountType,
      };

      const { result } = await api.allinoneAuthApi(
        packageAuthParams(loginArg, '/aliUserLogin/getAlipayBaseEncryLogin')
      );

      const { userId, accessToken, refreshToken } = result;

      if (accountType === 1) {
        this.globalStore.setH5OpenId(userId);
      } else {
        this.globalStore.setOpenId(userId);
      }

      this.globalStore.setToken({
        accessToken,
        refreshToken,
      });

      await this.getUerInfo();
    } catch (error: any) {
      if (error) {
        const { errorMessage } = error;

        if (errorMessage) {
          this.messageStore.showMessage(errorMessage);
        }

        throw new Error(error);
      }
    } finally {
      isLoading = false;
      uni.hideLoading();
    }
  }

  // handlerAuth
  async handlerAuth(): Promise<void> {
    uni.showLoading({
      mask: true,
    });

    try {
      const { authCode } = await apiAsync(my.getAuthCode, {
        scopes: 'auth_user',
        // scopes: 'auth_base',
      });

      const accountType = this.globalStore.browser.accountType;
      const { result } = await api.allinoneAuthApi(
        packageAuthParams(
          {
            code: authCode,
            codeType: 2,
            accountType,
          },
          '/aliUserLogin/getTPAlipayUserInfoShare'
        )
      );

      const {
        userId,
        accessToken,
        refreshToken,
        certNo,
        certType,
        gender,
        mobile,
        userName,
        authPhoneVerify,
      } = result;

      this.userStore.updateCacheUser({
        certNo,
        certType,
        gender,
        mobile,
        userName,
      });
      this.userStore.updateAuthPhoneVerify(authPhoneVerify);

      if (accountType === 1) {
        this.globalStore.setH5OpenId(userId);
      } else {
        this.globalStore.setOpenId(userId);
      }

      this.globalStore.setToken({
        accessToken,
        refreshToken,
      });

      // await this.getUerInfo('alone', true);
      await this.getUerInfo();
    } catch (error: any) {
      if (error) {
        const { errorMessage } = error;

        if (errorMessage) {
          this.messageStore.showMessage(errorMessage);
        }

        throw new Error(error);
      }
    } finally {
      uni.hideLoading();
    }
  }
}

class WebLoginHandler extends LoginUtils implements LoginHandler {
  async handler(payload?: any): Promise<void> {
    // this.messageStore.showMessage('暂未支持 h5 登录');
    // return Promise.reject('暂未支持 h5 登录');

    const pages = getCurrentPages();

    if (pages.length) {
      const fullUrl: string = (pages[pages.length - 1] as any).$page.fullPath;
      const routeStore = useRouterStore();
      routeStore.receiveQuery({
        _url: fullUrl,
      });
    }

    uni.navigateTo({
      url: '/pages/login/h5',
    });

    throw Error('即将去往 h5 登录页');
  }
}

/** wx腾讯健康登录 */
class WeChatThRegHandler extends LoginUtils implements LoginHandler {
  async handler({ thRegisterId }): Promise<void> {
    const openId = await getOpenId();
    const { source } = this.globalStore.browser;

    const { result: loginResult } = await api.loginByThRegisterId({
      source,
      openId,
      thRegisterId,
    });

    if (loginResult) {
      const { accessToken, refreshToken } = loginResult;
      const pages = getCurrentPages();
      const fullPathNow = (pages[pages.length - 1] as any).$page
        .fullPath as string;

      this.globalStore.setToken({
        accessToken,
        refreshToken,
      });

      if (!this.globalStore.h5OpenId && globalGl.h5AppId) {
        useRouterStore().receiveQuery({
          _url: encodeURIComponent(fullPathNow),
        });
      }

      await this.getUerInfo('alone', true);

      if (!this.globalStore.herenId) {
        useRouterStore().receiveQuery({
          _url: encodeURIComponent(fullPathNow),
        });
        await this.getUerInfo('alone');
      }
    }
  }
}

/** 抖音登录 */
class TouTiaoHandler extends LoginUtils implements LoginHandler {
  async handler({ detail }): Promise<void> {
    try {
      const { encryptedData, iv } = detail;

      if (!encryptedData) {
        this.messageStore.showMessage('用户取消登录', 3000);
        return Promise.reject('用户取消登录');
      }

      uni.showLoading({
        mask: true,
        title: '登录中..',
      });

      const accountType = this.globalStore.browser.accountType;
      const { openId, sessionKeyEn } = await getOpenidTtResult();

      // https://developer.open-douyin.com/docs/resource/zh-CN/mini-app/open-capacity/basic-capacities/obtain-mobilenumber/
      // https://developer.open-douyin.com/docs/resource/zh-CN/codelabs/mini-app/microapp-login/silent-login
      const { anonymousCode, code } = await apiAsync(uni.login, {});

      const { result } = await api.allinoneAuthApi(
        packageAuthParams(
          {
            code,
            anonymousCode,
            accountType,
            encryptedData,
            iv,
            openId,
            sessionKeyEn,
          },
          '/tikTok/tikTokLogin'
        )
      );

      if (result) {
        const { accessToken, refreshToken } = result;
        this.globalStore.setToken({
          accessToken,
          refreshToken,
        });

        await this.getUerInfo();
      } else {
        return Promise.reject('登录失败');
      }
    } catch (error) {
      console.error(error);
      throw new Error('登录失败');
    } finally {
      uni.hideLoading();
    }
  }
}

class PassWordHandler extends LoginUtils implements LoginHandler {
  async handler({ password, cellPhoneNum }): Promise<void> {
    const reqArg = {
      sysCode: getSysCode(),
      password,
      cellPhoneNum,
      loginName: cellPhoneNum,
    };

    const { result } = await api.allinoneAuthApi(
      packageAuthParams(reqArg, joinQuery('/login/usePasswordLogin', reqArg))
    );

    const { accessToken, refreshToken } = result;

    this.globalStore.setToken({
      accessToken,
      refreshToken,
    });

    await this.getUerInfo();
  }
}

export class Login extends LoginUtils {
  public static handlerMap: Record<LoginType, LoginHandler> = {
    [LoginType.WeChat]: new WeChatLoginHandler(),
    [LoginType.AliPay]: new AliPayLoginHandler(),
    [LoginType.H5]: new WebLoginHandler(),
    [LoginType.WeChatThReg]: new WeChatThRegHandler(),
    [LoginType.TouTiao]: new TouTiaoHandler(),
    [LoginType.PassWord]: new PassWordHandler(),
  };

  static async handler(type: LoginType, payload?: any) {
    await Login.handlerMap[type].handler(payload);
    new LoginUtils().checkNoPublicOpenId();
  }
}

export class PatientUtils extends LoginUtils {
  /** 升级医保用户 */
  async upToMedicalPat(data: { pat?: IPat; cardNumber?: string }) {
    const { pat, cardNumber } = data;
    const isOpenPatToMedicalPat =
      globalGl.sConfig.medicalMHelp?.isOpenPatToMedicalPat;
    const {
      browser: { source },
    } = this.globalStore;

    if (!isOpenPatToMedicalPat) {
      return;
    }

    if (cardNumber) {
      await api.altHosMedicalInfo({
        cardNumber,
        source,
      });
    } else if (pat) {
      const { patientId, healthCardUser } = pat;
      if (healthCardUser && healthCardUser === '2') {
        return;
      }

      await api.updateHosInfo({
        patientId,
        source,
      });

      await this.getPatCardList();
      const { patChoose, patList } = this.userStore;

      if (patChoose.patientId === patientId) {
        const newPatInfo = patList.find((p) => p.patientId === patientId)!;
        this.userStore.updatePatChoose(newPatInfo);
      }
    }
  }

  /**
   * 完善
   */
  async registerUser(
    payload: BaseObject,
    options: Partial<{
      addPatInterface: 'hasBeenTreated' | 'relevantPatient';
    }> = {
      addPatInterface: 'hasBeenTreated',
    }
  ) {
    const { addPatInterface } = options;
    const {
      idCard: idNo,
      idType,
      patientName,
      patientPhone,
      patientType: patientType,
      verifyCode,
      verifyType,
      sex,
      birthday,
      wechatCode, // 微信电子健康卡时候有
      cellPhoneNumber,
      idCardEncry,
    } = payload;
    const { accountType, source } = this.globalStore.browser;

    const _sex = (sex && (sex === '男' ? '1' : '2')) || '';
    const requestData = {
      accountType,
      idNo,
      // 统一认证不区分 国内外 护照， 只有护照
      idType: ['031', '032'].includes(idType) ? '03' : idType,
      patientType,
      name: patientName,
      cellphone: patientPhone,
      sex: _sex,
      gender: _sex,
      birthday,
      cellPhoneNumber,
      idCardEncry,
      source,
    };

    uni.showLoading({
      title: '完善就诊人中...',
      mask: true,
    });

    let result: any;

    if (addPatInterface === 'hasBeenTreated') {
      const { result: r } = await api.allinoneAuthApi1(requestData);
      result = r;
    } else {
      const { result: r } = await api.allinoneAuthApi(
        packageAuthParams(requestData, '/register/bindRegisterUser')
      );
      result = r;
    }

    // .catch((err) => {
    //   return Promise.reject({
    //     errorType: 'add',
    //     err,
    //   });
    // });

    if (result) {
      const { accessToken, refreshToken } = result;
      this.globalStore.setToken({
        accessToken,
        refreshToken,
      });

      uni.showLoading({
        title: '获取就诊人数据...',
        mask: true,
      });

      await this.getUerInfo('alone');

      uni.showLoading({
        title: '添加就诊人中...',
        mask: true,
      });

      if (addPatInterface === 'hasBeenTreated') {
        await this.addPatient({
          ...payload,
          defaultFalg: '1',
          herenId: this.globalStore.herenId,
          patientName,
          patientPhone,
          patientType,
          source: this.globalStore.browser.source,
          verifyCode: verifyCode || '1',
          verifyType,
          _type: 'perfect',
        });
      } else {
        // relevantPatient
        await this.addRelevantPatient({
          ...payload,
          _type: 'perfect',
        }).catch(async (err) => {
          const errMsg = err?.message || '新增就诊人失败';

          await apiAsync(uni.showModal, {
            content: errMsg + ' 系统将为您注册账号，但不进行绑定就诊人！',
            showCancel: false,
          });

          return Promise.reject({
            err,
            errorType: 'add',
          });
        });
      }

      await this.getPatCardList();
    }
  }

  /**
   * 新增
   */
  async addPatient(
    data: Partial<{
      defaultFalg: '0' | '1';
      herenId: number | string;
      openIds: { openId: string; source: string }[];
      patientName: string;
      patientPhone: string;
      patientType: string;
      source: string | number;
      upIdCard: string;
      upName: string;
      verifyCode: string;
      verifyType: string;
      _type?: 'perfect';
    }>
  ) {
    getH5OpenidParam(data);
    if (data._type === 'perfect') {
      return await api.addPatByHasBeenTreatedEncry({
        ...data,
        patientType: '',
      });
    } else {
      return await api.addPatientByHasBeenTreated({ ...data, patientType: '' });
    }
  }

  async addRelevantPatient(
    data: Partial<{
      _type?: 'perfect';
      _autoSetDefault: string;
      wechatCode: string; // 微信电子健康卡时候有

      addressCity: string;
      addressCounty: string;
      addressCountyCode: string;
      addressProvince: string;
      birthday: string; //非身份证类型/儿童必填
      defaultFalg: boolean;
      idCard: string;
      idType: string;
      location: string;
      nation: string;
      openIds: { openId: string; source: string }[];
      patientName: string;
      patientPhone: string;
      patientType: string;
      sex: string; // 非身份证类型/儿童必填
      upIdCard: string; // 儿童必填
      upName: string; // 儿童必填
      verifyCode: string;
      verifyType: string; // 1&bk 不开启验证  2&kq 开启验证
    }>
  ) {
    const { wechatCode } = data;

    const requestArg = {
      ...data,
      defaultFalg: data.defaultFalg ? '1' : '0',
      source: this.globalStore.browser.source,
      herenId: this.globalStore.herenId,
      verifyType: data.verifyType || '1&bk',
      healthCardId: '',
      qrCodeText: '',
    };

    getH5OpenidParam(requestArg);
    if (wechatCode) {
      const { healthCardId, qrCodeText } = await this.regHealthCardByPatInfo(
        data
      );

      requestArg.qrCodeText = qrCodeText;
      requestArg.healthCardId = healthCardId;
    }

    const {
      result: { patientId },
    } = await api.addPat(requestArg);

    if (data._autoSetDefault) {
      await this.changeDefault({
        patientId,
        defaultFalg: true,
      });
    } else {
      if (data.defaultFalg) {
        this.userStore.updatePatChoose({} as any);
      }

      // if (wechatCode) {
      //   await this.registerHealthCard(
      //     {
      //       patientId,
      //       wechatCode,
      //     },
      //     false,
      //     false
      //   );
      // }
    }
  }

  async registerHealthCard(
    data: { patientId: string; wechatCode: string },
    isErr = true,
    showMessage = true
  ) {
    const { patientId, wechatCode } = data;

    await api
      .registerHealthCard(
        {
          patientId,
          wechatCode,
          source: this.globalStore.browser.source,
        },
        {
          showMessage,
        }
      )
      .catch((err) => {
        if (isErr) {
          throw new Error(err);
        } else {
          console.error('此处不抛出错误', err);
        }
      });
  }

  async regHealthCardByPatInfo(
    data: Partial<{
      _autoSetDefault: string;
      wechatCode: string; // 微信电子健康卡时候有

      addressCity: string;
      addressCounty: string;
      addressCountyCode: string;
      addressProvince: string;
      birthday: string; //非身份证类型/儿童必填
      defaultFalg: boolean;
      idCard: string;
      idType: string;
      location: string;
      nation: string;
      openIds: { openId: string; source: string }[];
      patientName: string;
      patientPhone: string;
      patientType: string;
      sex: string; // 非身份证类型/儿童必填
      upIdCard: string; // 儿童必填
      upName: string; // 儿童必填
      verifyCode: string;
      verifyType: string; // （1或空）不开启验证  2:开启验证
    }>
  ): Promise<{ healthCardId: string; qrCodeText: string }> {
    const requestArg = {
      ...data,
      defaultFalg: data.defaultFalg ? '1' : '0',
      source: this.globalStore.browser.source,
      herenId: this.globalStore.herenId,
      verifyType: data.verifyType || '1&bk',
      healthCardId: '',
      qrCodeText: '',
    };

    getH5OpenidParam(requestArg);

    const { result } = await api.regHealthCardByPatInfo(requestArg);

    return result;
  }

  async getPatCardList() {
    const requestArg = {
      herenId: this.globalStore.herenId,
      source: this.globalStore.browser.source,
    };

    const { result } = await api.getPatCardList(requestArg);

    if (result && result.length) {
      const isArea = isAreaProgram();
      result.map((o) => {
        o._showId = (isArea && o.idCard) || o.cardNumber || '';
      });

      this.userStore.updatePatList(result);
    } else {
      this.userStore.updatePatList([]);
    }
  }

  /**
   * 切换默认人
   */
  async changeDefault(data: { defaultFalg: boolean; patientId: string }) {
    const { patientId, defaultFalg } = data;

    uni.showLoading({
      title: '请求中...',
      mask: true,
    });

    await api.updateDefaultPat({
      patientId,
      defaultFalg: defaultFalg ? '1' : '0',
      herenId: this.globalStore.herenId,
    });

    uni.hideLoading();

    this.userStore.updatePatListDefault({
      patientId,
      defaultFalg,
    });
  }

  /**
   * 删除就诊人
   */
  async deletePat(data: { patientId: string }) {
    const { patientId } = data;

    const pat = <IPat>(
      this.userStore.patList.find((o) => o.patientId === patientId)
    );

    uni.showLoading({
      title: '请求中...',
      mask: true,
    });

    await api.deletePat({
      patientId,
      source: this.globalStore.browser.source,
    });

    uni.hideLoading();
    this.userStore.deletePat(patientId);

    if (this.userStore.patList.length) {
      // 自动切换默认就诊人 （产品拒绝加上）
      // if (pat.defaultFlag === '1') {
      //   const newDefaultPat = this.userStore.patList[0];
      //   this.changeDefault({
      //     patientId: newDefaultPat.patientId,
      //     defaultFalg: true,
      //   });
      // }
    }
  }
}

export const aliLogin = async function () {
  await Login.handler(LoginType.AliPay);
};

export const wxLogin = async function (e) {
  await Login.handler(LoginType.WeChat, e);
};

export const handlerLogin = async (e: BaseObject = {}) => {
  const { thRegisterId } = e;
  let _env = LoginType.WeChat;

  // #ifdef MP-WEIXIN
  if (thRegisterId) {
    _env = LoginType.WeChatThReg;
  }
  // #endif

  // #ifdef MP-ALIPAY
  _env = LoginType.AliPay;
  // #endif

  // #ifdef H5
  _env = LoginType.H5;
  // #endif

  // #ifdef MP-TOUTIAO
  _env = LoginType.TouTiao;
  // #endif

  await Login.handler(_env, e);
};

export const outLogin = function (
  payload: Partial<{
    isHideMessage: boolean;
    isGoLoginPage: boolean;
  }> = {}
) {
  new LoginUtils().outLogin(payload);
};

export const handlerWeChatThRegLogin = async function (e: {
  thRegisterId?: string;
}) {
  const { thRegisterId } = e;

  // #ifdef MP-WEIXIN
  const gStores = new GStores();

  if (thRegisterId && !gStores.globalStore.isLogin) {
    await handlerLogin(e);

    if (gStores.globalStore.herenId) {
      await new PatientUtils().getPatCardList();
    }
  }
  // #endif
};
