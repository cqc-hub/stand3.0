import { useGlobalStore, useUserStore, useMessageStore } from '@/stores';
import { getSysCode } from '@/common';

import api from '@/service/api';

const packageAuthParams = (
	args,
	url: `/${string}`,
	payload: {
		isOutArgs?: boolean;
	} = {}
) => {
	const globalStore = useGlobalStore();
	const argsDefault = {
		...args,
		sysCode: getSysCode()
	};
	const { isOutArgs } = payload;
	let authParam = argsDefault;
	let outParam: BaseObject = {};

	if (isOutArgs) {
		authParam = undefined;
		outParam = argsDefault;
	}

	return {
		authParam: {
			args: authParam,
			...outParam,
			token: globalStore.getToken
		},
		sysCode: undefined,
		url
	};
};

enum LoginType {
	WeChat,
	AliPay
}

abstract class LoginHandler {
	abstract handler(payload?: any);
}

class GStores {
	messageStore = useMessageStore();
	userStore = useUserStore();
	globalStore = useGlobalStore();
}

class LoginUtils extends GStores {
	async getUerInfo() {
		try {
			const { result } = await api.allinoneAuthApi(
				packageAuthParams({}, '/modifyUserInfo/userInfoByToken')
			);

			if (result) {
				const { cellPhoneNum, herenId, idNo, name, sex } = result;

				this.userStore.updateName(name);
				this.userStore.updateSex(sex);
				this.userStore.updateIdNo(idNo);
				this.userStore.updatePhone(cellPhoneNum);

				this.globalStore.setHerenId(herenId);

				if (!herenId) {
					this.messageStore.showMessage('未完善，请先完善', 1000);
					setTimeout(() => {
						uni.reLaunch({
							url: '/pagesA/medicalCardMan/addMedical'
						});
					}, 1200);
				}
			}
		} catch (error) {
			uni.hideLoading();
			return Promise.reject(error);
		}
	}

	outLogin() {
		this.userStore.clearStore();
		this.globalStore.clearStore();

		setTimeout(() => {
			this.messageStore.showMessage('退出成功', 1500);
		}, 500);
	}
}

class WeChatLoginHandler extends LoginUtils implements LoginHandler {
	handler(payload?: any) {
		// 微信 必然有 payload
		if (!payload) return;
		const { target, detail } = payload;

		if (detail.errMsg !== 'getPhoneNumber:ok') {
			this.messageStore.showMessage('用户取消授权', 1500);
			return;
		}

		wx.login({
			success: async ({ code }) => {
				const accountType = this.globalStore.browser.accountType;

				const { result } = await api.allinoneAuthApi(
					packageAuthParams(
						{
							code,
							accountType
						},
						'/wx/getAppletsOpenId',
						{
							isOutArgs: true
						}
					)
				);

				if (result) {
					const { openId, sessionKey } = result;
					const {
						encryptedData: encrypData,
						iv: ivData,
						code: phoneNumberCode
					} = target;

					this.globalStore.setOpenId(openId);

					const requestData = {
						accountType,
						openId,
						sessionKey,
						phoneNumberCode,
						ivData,
						encrypData
					};

					const { result: loginResult } =
						await api.wxLoginByPhoneNumberCode(requestData);

					if (loginResult) {
						const { accessToken, refreshToken } = loginResult;
						this.globalStore.setToken({
							accessToken,
							refreshToken
						});

						this.getUerInfo();
					}
				}
			}
		});
	}
}

class AliPayLoginHandler extends LoginUtils implements LoginHandler {
	async handler() {
		my.getAuthCode({
			scopes: 'auth_user',
			success: async ({ authCode }) => {
				const accountType = this.globalStore.browser.accountType;
				const { result } = await api.allinoneAuthApi(
					packageAuthParams(
						{
							code: authCode,
							codeType: 2,
							accountType
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
					userName
				} = result;

				this.userStore.updateCacheUser({
					certNo,
					certType,
					gender,
					mobile,
					userName
				});

				if (accountType === 1) {
					this.globalStore.setH5OpenId(userId);
				} else {
					this.globalStore.setOpenId(userId);
				}

				this.globalStore.setToken({
					accessToken,
					refreshToken
				});

				this.getUerInfo();
			},

			fail: ({ errorMessage }) => {
				this.messageStore.showMessage(errorMessage);
			}
		});
	}
}

export class Login extends LoginUtils {
	public static handlerMap: Record<LoginType, LoginHandler> = {
		[LoginType.WeChat]: new WeChatLoginHandler(),
		[LoginType.AliPay]: new AliPayLoginHandler()
	};

	static handler(type: LoginType, payload?: any) {
		Login.handlerMap[type].handler(payload);
	}
}

export class PatientUtils extends LoginUtils {
	/**
	 * 完善
	 */
	async registerUser(payload: BaseObject) {
		const {
			cardNumber,
			idCard: idNo,
			idType,
			patientName,
			patientPhone
		} = payload;
		const accountType = this.globalStore.browser.accountType;

		const requestData = {
			accountType,
			idNo,
			idType,
			name: patientName,
			cellphone: patientPhone
		};

		const { result } = await api.allinoneAuthApi(
			packageAuthParams(requestData, '/register/bindRegisterUser')
		);

		if (result) {
			const { accessToken, refreshToken } = result;
			this.globalStore.setToken({
				accessToken,
				refreshToken
			});

			await this.getUerInfo();

			this.addPatient({
				defaultFalg: '1',
				herenId: this.globalStore.herenId,
				patientName,
				patientPhone,
				source: this.globalStore.browser.source,
				verifyCode: '1'
			});
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
		}>
	) {
		await api.addPatientByHasBeenTreated(data);
	}

	async getPatCardList() {
		const requestArg = {
			herenId: this.globalStore.herenId,
			source: this.globalStore.browser.source
		};

		api.getPatCardList(requestArg);
	}
}

export const aliLogin = function () {
	Login.handler(LoginType.AliPay);
};

export const wxLogin = function (e) {
	Login.handler(LoginType.WeChat, e);
};

export const outLogin = function () {
	new LoginUtils().outLogin();
};
