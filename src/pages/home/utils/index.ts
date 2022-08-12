import { useGlobalStore, useUserStore, useMessageStore } from '@/stores';
import api from '@/service/api';
import global from '@/config/global';
// import { } from

export const aliLogin = function () {
	my.getAuthCode({
		scopes: 'auth_user',
		success({ authCode }) {
			aliInLogin({
				code: authCode,
				codeType: 2
			});
		},

		fail({ errorMessage }) {
			const messageStore = useMessageStore();
			messageStore.showMessage(errorMessage);
		}
	});
};

export const wxLogin = function (e) {
	const messageStore = useMessageStore();
	const globalStore = useGlobalStore();
	const accountType = globalStore.browser.accountType;

	const { target, detail } = e;

	if (detail.errMsg !== 'getPhoneNumber:ok') {
		messageStore.showMessage('用户取消授权', 1500);
		return;
	}

	wx.login({
		success: async ({ code }) => {
			const { result } = await api.getAppletsOpenId({
				code,
				accountType
			});

			if (result) {
				const { openId, sessionKey } = result;
				const {
					encryptedData: encrypData,
					iv: ivData,
					code: phoneNumberCode
				} = target;

				globalStore.setOpenId(openId);

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
					globalStore.setToken({
						accessToken,
						refreshToken
					});

					getUerInfo();
				}
			}
		}
	});
};

const aliInLogin = async function ({ codeType, code }) {
	const globalStore = useGlobalStore();
	const accountType = globalStore.browser.accountType;

	const { result } = await api.getTPAlipayUserInfoShare({
		code,
		codeType,
		accountType
	});

	const { userId, accessToken, refreshToken, authHerenId } = result;

	if (accountType === 1) {
		globalStore.setH5OpenId(userId);
	} else {
		globalStore.setOpenId(userId);
	}

	globalStore.setToken({
		accessToken,
		refreshToken
	});

	getUerInfo();
};

export const getUerInfo = async function () {
	const { result } = await api.userInfoByToken({});

	if (result) {
		const userStore = useUserStore();
		const globalStore = useGlobalStore();
		const messageStore = useMessageStore();

		const { cellPhoneNum, herenId, idNo, name, sex } = result;

		userStore.updateName(name);
		userStore.updateSex(sex);
		userStore.updateIdNo(idNo);
		userStore.updatePhone(cellPhoneNum);

		globalStore.setHerenId(herenId);

		if (!herenId) {
			messageStore.showMessage('未完善，请先完善', 1000);
			setTimeout(() => {
				uni.reLaunch({
					url: '/pagesA/medicalCardMan/addMedical'
				});
			}, 1200);
		}
	}
};

export const outLogin = function () {
	const messageStore = useMessageStore();
	const userStore = useUserStore();
	const globalStore = useGlobalStore();

	userStore.clearStore();
	globalStore.clearStore();

	setTimeout(() => {
		messageStore.showMessage('退出成功', 1500);
	}, 500);
};
