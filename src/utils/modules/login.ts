import {
  useGlobalStore,
  useUserStore,
  useMessageStore,
  IPat,
  isAreaProgram,
} from '@/stores';
import { getSysCode, setLocalStorage } from '@/common';
import { routerJump, ServerStaticData } from '@/utils';
import api from '@/service/api';
import globalGl from '@/config/global';

export const getH5OpenidParam = function (data) {
  // #ifdef MP-WEIXIN
  const globalStore = useGlobalStore();
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
};

const packageAuthParams = (
  args: {},
  url: `/${string}`,
  payload: {
    isOutArgs?: boolean;
  } = {}
) => {
  if (['/register/bindRegisterUser'].includes(url)) {
    getH5OpenidParam(args);
  }

  const globalStore = useGlobalStore();
  const argsDefault = {
    ...args,
    sysCode: getSysCode(),
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

enum LoginType {
  WeChat,
  AliPay,
  H5,
}

abstract class LoginHandler {
  abstract handler(payload?: any): Promise<void>;
}

export class GStores {
  messageStore = useMessageStore();
  userStore = useUserStore();
  globalStore = useGlobalStore();
}

export class LoginUtils extends GStores {
  async getUerInfo() {
    try {
      const { result } = await api.allinoneAuthApi(
        packageAuthParams({}, '/modifyUserInfo/userInfoByToken')
      );

      if (result) {
        const {
          cellPhoneNum: phone,
          herenId,
          idNo,
          name,
          sex,
          phoneNum,
        } = result;

        this.userStore.updateName(name);
        this.userStore.updateSex(sex);
        this.userStore.updateIdNo(idNo);

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

        if (!herenId) {
          this.messageStore.showMessage('未完善，请先完善', 1000);
          setTimeout(() => {
            uni.reLaunch({
              url: globalGl.addPersonUrl + '?pageType=perfectReal',
            });
          }, 1200);

          return Promise.reject('未完善');
        } else {
          //获取就诊人列表
          await new PatientUtils().getPatCardList();
        }
      }
    } catch (error) {
      uni.hideLoading();
      return Promise.reject(error);
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
    //调用微信绑定openid的接口
    if (this.globalStore.h5OpenId) {
      await this.sysPatOpenIdAssignment(herenId, this.globalStore.h5OpenId);
    }
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

    setTimeout(() => {
      if (!isHideMessage) {
        this.messageStore.showMessage('退出成功', 1500);
      }

      if (isGoLoginPage) {
        uni.reLaunch({
          url: '/pages/home/my',
          complete: () => {
            setTimeout(() => {
              this.messageStore.showMessage('请登录', 1500);
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

    if (detail.errMsg !== 'getPhoneNumber:ok') {
      this.messageStore.showMessage('用户取消授权', 1500);
      return Promise.reject();
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
              '/wx/getAppletsOpenId',
              {
                isOutArgs: true,
              }
            )
          );

          if (result) {
            const { openId, sessionKey } = result;
            const {
              encryptedData: encrypData,
              iv: ivData,
              code: phoneNumberCode,
            } = target;

            this.globalStore.setOpenId(openId);

            const requestData = {
              accountType,
              openId,
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

class AliPayLoginHandler extends LoginUtils implements LoginHandler {
  async handler(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      uni.showLoading({
        mask: true,
      });
      my.getAuthCode({
        scopes: 'auth_user',
        success: async ({ authCode }) => {
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
            authHerenId,
            certNo,
            certType,
            gender,
            mobile,
            userName,
          } = result;

          this.userStore.updateCacheUser({
            certNo,
            certType,
            gender,
            mobile,
            userName,
          });

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
          resolve();
        },

        fail: ({ errorMessage }) => {
          this.messageStore.showMessage(errorMessage);
          reject();
        },

        complete: uni.hideLoading,
      });
    });
  }
}

class WebLoginHandler extends LoginUtils implements LoginHandler {
  async handler(payload?: any): Promise<void> {
    this.messageStore.showMessage('暂未支持 h5 登录');
  }
}

export class Login extends LoginUtils {
  public static handlerMap: Record<LoginType, LoginHandler> = {
    [LoginType.WeChat]: new WeChatLoginHandler(),
    [LoginType.AliPay]: new AliPayLoginHandler(),
    [LoginType.H5]: new WebLoginHandler(),
  };

  static async handler(type: LoginType, payload?: any) {
    await Login.handlerMap[type].handler(payload);
  }
}

export class PatientUtils extends LoginUtils {
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
    } = payload;
    const accountType = this.globalStore.browser.accountType;

    const requestData = {
      accountType,
      idNo,
      // 统一认证不区分 国内外 护照， 只有护照
      idType: ['031', '032'].includes(idType) ? '03' : idType,
      patientType,
      name: patientName,
      cellphone: patientPhone,
      sex: sex === '男' ? '1' : '2',
      birthday,
    };

    uni.showLoading({
      title: '完善就诊人中...',
      mask: true,
    });

    const { result } = await api.allinoneAuthApi(
      packageAuthParams(requestData, '/register/bindRegisterUser')
    );
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

      await this.getUerInfo();

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
        });
      } else {
        await this.addRelevantPatient(payload).catch((err) => {
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
    }>
  ) {
    getH5OpenidParam(data);
    await api.addPatientByHasBeenTreated({ ...data, patientType: '' });
  }

  async addRelevantPatient(
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
  ) {
    const { wechatCode } = data;
    const requestArg = {
      ...data,
      defaultFalg: data.defaultFalg ? '1' : '0',
      source: this.globalStore.browser.source,
      herenId: this.globalStore.herenId,
      verifyType: data.verifyType || '1',
    };

    getH5OpenidParam(requestArg);

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

      if (wechatCode) {
        await this.registerHealthCard({
          patientId,
          wechatCode,
        });
      }

      await this.getPatCardList();
    }
  }

  async registerHealthCard(data: { patientId: string; wechatCode: string }) {
    const { patientId, wechatCode } = data;

    await api.registerHealthCard({
      patientId,
      wechatCode,
      source: this.globalStore.browser.source,
    });
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
      // 	const newDefaultPat = this.userStore.patList[0];
      // 	this.changeDefault({
      // 		patientId: newDefaultPat.patientId,
      // 		defaultFalg: true
      // 	});
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

export const handlerLogin = async (e) => {
  let _env = LoginType.WeChat;

  // #ifdef MP-ALIPAY
  _env = LoginType.AliPay;
  // #endif

  // #ifdef H5
  _env = LoginType.H5;
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
