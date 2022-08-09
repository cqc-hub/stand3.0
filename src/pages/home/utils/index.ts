import { useGlobalStore, useUserStore } from '@/stores';
import api from '@/service/api';
// import { } from

export const aliLogin = function () {
	my.getAuthCode({
		scopes: 'auth_user',
		success({ authCode }) {
			inLogin({
				code: authCode,
				codeType: 2
			});
		}
	});
};

export const wxLogin = function (e) {
	console.log(e);
};

const inLogin = async function ({ codeType, code }) {
	const globalStore = useGlobalStore();
	const userStore = useUserStore();
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

	if (authHerenId) {
		globalStore.setHerenId(authHerenId);
	}

	await api.userInfoByToken({});
};
