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
	sysTerms: IOptions[];
	nationTerms: IOptions[];
	patientTypeTerms: IOptions[];
}
//页面存储token brower等
const globalStore = defineStore('global', {
	/**
	 * 数据存在 storage 中
	 * 大小存在限制
	 * 所有 storage 10mb
	 * 单个 storage key   wx 1mb  alipay  200kb
	 */
	persist: {
		key: 'global',
		paths: [
			'token',
			'openId',
			'h5OpenId',
			'herenId',
			'sysTerms',
			'nationTerms',
			'browser'
		]
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
			sysTerms: [],
			nationTerms: [],
			patientTypeTerms: []
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

		// 获取后台静态数据
		async getSysTerm() {
			// label: "已预约", value: "0"
			if (!this.sysTerms.length) {
				uni.showLoading({
					title: '获取系统配置中',
					mask: true
				});
				const { result } = await api.getParamsMoreBySysCode({
					paramCode: 'REG_ORDER_STATUS'
				});

				uni.hideLoading();

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

			if (!this.nationTerms.length) {
				uni.showLoading({
					title: '获取系统配置中',
					mask: true
				});
				const { result } = await api.getTermsBySysAndCode({
					domainCode: 'CHINESE_NATION'
				});

				uni.hideLoading();

				const list = result && result.length && result[0].terms;

				if (list) {
					this.nationTerms = list.map((o) => ({
						label: o.label,
						value: o.code
					}));
				}
			}

			await api.getParamsMoreBySysCode({
				paramCode: 'PATIENT_TYPE'
			});
		}
	}
});

export const useGlobalStore = function () {
	return globalStore();
};
