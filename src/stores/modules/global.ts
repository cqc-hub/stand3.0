import { defineStore } from 'pinia';
import api from '@/service/api';

interface IStateGlobal {
	token: {
		accessToken: string;
		refreshToken: string;
	};

	browser: {
		source: number;
		accountType: number;
		payType: string;
	};

	openId: string;
	h5OpenId: string;
	herenId: string;
	sysTerms: { label: string; value: string }[];
}
//页面存储token brower等
const globalStore = defineStore('global', {
	persist: {
		key: 'global',
		paths: ['token', 'openId', 'h5OpenId', 'herenId', 'sysTerms']
	},

	state: (): IStateGlobal => {
		return {
			// 所有这些属性都将自动推断其类型
			token: {
				accessToken: '',
				refreshToken: ''
			},
			//来源
			browser: {
				source: 4,
				accountType: 2,
				payType: 'ALI_WAP'
			},
			openId: '',
			h5OpenId: '',
			herenId: '',
			sysTerms: []
		};
	},
	getters: {
		getToken(): any {
			return this.token;
		},
		getBrowser(): any {
			return this.browser;
		},

		isLogin(): boolean {
			if (this.token.accessToken) {
				return true;
			}
			return false;
		}
	},
	actions: {
		clearStore() {
			this.token = {
				accessToken: '',
				refreshToken: ''
			};

			this.openId = '';
			this.h5OpenId = '';
			this.herenId = '';
		},

		getSysTermLabel(v: string): string {
			const item = this.sysTerms.find((o) => o.value === v);
			if (item) {
				return item.label;
			} else {
				return '';
			}
		},

		updateToken(token) {
			this.token = token;
		},
		updateBrowser(browser) {
			this.browser = browser;
		},

		initBrowser() {
			const { updateBrowser } = this;
			// #ifdef H5
			const browser = navigator.userAgent.toLowerCase();

			if (browser) {
				if (browser.match(/Alipay/i) == 'alipay') {
					updateBrowser({
						source: 4,
						accountType: 2,
						payType: 'ALI_WAP'
					});
				} else if (
					browser.match(/MicroMessenger/i) == 'micromessenger'
				) {
					updateBrowser({
						source: 3,
						accountType: 1,
						payType: 'WX_JSAPI'
					});
				}
			}
			// #endif

			// #ifdef MP-WEIXIN
			updateBrowser({
				source: 19,
				accountType: 11
			});
			// #endif

			// #ifdef MP-ALIPAY
			updateBrowser({
				source: 21,
				accountType: 22
			});
			// #endif
		},

		setOpenId(id: string) {
			this.openId = id;
		},

		setH5OpenId(id: string) {
			this.h5OpenId = id;
		},

		setToken({ accessToken, refreshToken }) {
			this.token = {
				accessToken,
				refreshToken
			};
		},

		setHerenId(id: string) {
			this.herenId = id;
		},

		// 获取术语
		async getSysTerm() {
			if (this.sysTerms.length) {
				return;
			}

			const { result } = await api.getParamsMoreBySysCode({
				paramCode: 'REG_ORDER_STATUS'
			});

			let list = result && result.REG_ORDER_STATUS;
			if (list) {
				list = JSON.parse(list).map((item) => {
					return {
						label: item.label,
						value: item.code
					};
				});

				this.sysTerms = list;
			}
		}
	}
});

export const useGlobalStore = function () {
	return globalStore();
};
