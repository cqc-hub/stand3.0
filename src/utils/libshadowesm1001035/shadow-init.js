import shadowlib from './shadowlib.js';
import {
	ar_shadow_isbodyencrypt,
	ar_shadow_publickeyurl,
	ar_shadow_yourdomain,
	ar_shadow_noxhrurls,
	ar_shadow_yourdomains,
	ar_shadow_nobodyencrypt_urls
} from './config.js';
import { ar_shadow_decodeResponse } from './decode.js';

export const shadowState = {
	isPubKeyInit: false,
	encryptUrl: "",
	clientData: "",
	arshadow$vData: {
		gyroscope: { x: 0, y: 0, z: 0 },
		sysv: '',
		battery: 100,
		brand: '',
		arlang: '',
		touchStartCount: 0,
		touchMoveCount: 0,
		inputCount: 0,
		totalScore: 0
	}
};

export function initShadowSDK() {
	console.log('Shadow SDK Init');

	if (!shadowlib || !shadowlib.ar_shadow_addparametertourl) {
		console.warn('shadowlib 未正确加载,SDK 功能将不可用');
	}

	try {
		uni.request({
			url: ar_shadow_publickeyurl,
			method: 'GET',
			success: (res) => {
				console.log(res, 'res');
				if (res.statusCode === 200 && res.data?.publicKey) {
					shadowState.isPubKeyInit = true;
					uni.setStorageSync('ar_shadow_publicKey', res.data.publicKey);
				} else {

					uni.removeStorageSync('ar_shadow_publicKey');
				}
			},
			fail: (err) => {
				console.error('初始化公钥失败:', err);
				uni.removeStorageSync('ar_shadow_publicKey');
			}
		});
	} catch (err) {
		console.error('初始化公钥失败:', err);
	}

	uni.addInterceptor('request', {
		invoke(args) {
			args.responseType = 'arraybuffer';

			let isMatchDomain = true;
			const domainSource = ar_shadow_yourdomains || ar_shadow_yourdomain;
			if (domainSource) {
				const domainList = domainSource.split(',').map(d => d.trim()).filter(Boolean);
				isMatchDomain = domainList.some(domain => {
					const isValidHost = !!domain.match(/^(https?:)?\/\/([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z0-9]{1,}(:[0-9]*)?/gi);
					return isValidHost && (args.url || '').indexOf(domain) > -1;
				});
			}

			const noEncryptList = ar_shadow_noxhrurls ? ar_shadow_noxhrurls.split(',').map(u => u.trim()) : [];
			let isNotInWhiteList = !noEncryptList.some(u => (args.url || '').indexOf(u) > -1);

			if (!isMatchDomain || !isNotInWhiteList) {
				console.log({
					isMatchDomain,
					isNotInWhiteList
				})
				return;
			}

			const publicKey = uni.getStorageSync('ar_shadow_publicKey');

			// const publicKey = uni.getStorageSync('-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCazbgbEUUU1Oy81O2j0seUiV7oW+nO9H/VVJuA+jGz6mkOH0A0udcw0uVaClEeXyoyxCLvkDAf0gMenwCqPDu5doRVwsWOWbFBEhF0sRIyXN/tdqXRj3TkLfFRUGi8hLMIUsPMezQ1PNPM9k8IBDP+DuwaPiYB7aOlMQVjqN93KwIDAQAB-----END PUBLIC KEY-----y');

			let u_token = uni.getStorageSync('ar_shadow_token1017');

			if (!publicKey || !u_token) {
				return;
			}

			let o = shadowState.arshadow$vData.gyroscope;
			let r = "x:" + o.x + " y:" + o.y + " z:" + o.z;
			let e = shadowState.arshadow$vData.battery;
			let l = shadowState.arshadow$vData.sysv;
			let g = shadowState.arshadow$vData.brand;
			let n = shadowState.arshadow$vData.arlang;
			let $ = shadowState.arshadow$vData.touchStartCount;
			let b = shadowState.arshadow$vData.touchMoveCount;
			let d = shadowState.arshadow$vData.inputCount;
			let totalScore = shadowState.arshadow$vData.totalScore || 0;

			let s = "";
			let h = args.method;
			let isWholeBodyEncrypt = false;

			let currentRequestNeedsBodyEncrypt = true;
			if (ar_shadow_nobodyencrypt_urls) {
				const noBodyEncList = ar_shadow_nobodyencrypt_urls.split(',').map(u => u.trim()).filter(Boolean);
				if (noBodyEncList.some(u => args.url && args.url.startsWith(u))) {
					currentRequestNeedsBodyEncrypt = false;
				}
			}
			const shouldEncryptBody = h && !h.match(/\bGET\b/gi) && ar_shadow_isbodyencrypt && currentRequestNeedsBodyEncrypt;

			if (h && h.match(/\bGET\b/gi) && args.data && typeof args.data === "object") {
				const k = Object.keys(args.data);
				if (k.length) {
					const q = k.map(f => {
						let val = args.data[f];
						if (typeof val === 'object' && val !== null) {
							val = JSON.stringify(val);
						}
						return encodeURIComponent(f) + "=" + encodeURIComponent(val);
					}).join("&");
					args.url += args.url.indexOf("?") > -1 ? "&" + q : "?" + q;
					args.data = undefined;
				}
			}

			if (shouldEncryptBody) {
				if (args.data) {
					let contentType = '';
					if (args.header) {
						const keys = Object.keys(args.header);
						for (let i = 0; i < keys.length; i++) {
							if (keys[i].toLowerCase() === 'content-type') {
								contentType = args.header[keys[i]];
								break;
							}
						}
					}

					let payloadStr = '';
					if (contentType.toLowerCase().indexOf('application/x-www-form-urlencoded') > -1) {
						if (typeof args.data === 'object' && args.data !== null) {
							const q = Object.keys(args.data).map(f => {
								let val = args.data[f];
								if (typeof val === 'object' && val !== null) {
									val = JSON.stringify(val);
								}
								return encodeURIComponent(f) + "=" + encodeURIComponent(val);
							}).join("&");
							payloadStr = q;
						} else {
							payloadStr = String(args.data);
						}
					} else {
						payloadStr = typeof args.data === 'string' ? args.data : JSON.stringify(args.data);
					}

					s = { 'BODY_PAYLOAD': payloadStr };
					isWholeBodyEncrypt = true;
				} else {
					s = args.data;
				}
			}

			let D = Math.floor(10 * Math.random());
			let y = "0000000000000000000" + (new Date).getTime() + "||||"
				+ u_token + "|" + String((new Date).getTime())
				+ "||-$-$" + totalScore + "$-$-$" + b + "$" + $ + "$" + d + "$1$-$-$4$"
				+ r + "$" + e + "$" + l + "$" + g + "$-$" + n + "$-$-$-|||"
				+ e + "$" + totalScore + "|||||||" + D + "|";

			if (shadowState.isPubKeyInit && shadowlib && shadowlib.ar_shadow_addparametertourl) {
				try {
					let c = shadowlib.ar_shadow_addparametertourl(args.url, s, y, publicKey);

					args.url = c.requrl;
					uni.setStorageSync("eurl", c.requrl);

					if (shouldEncryptBody) {
						if (c.reqbody !== undefined) {
							let encryptedStr = c.reqbody.BODY_PAYLOAD !== undefined ? c.reqbody.BODY_PAYLOAD : c.reqbody;

							if (typeof encryptedStr === 'string' && encryptedStr.startsWith('shadowanrui')) {
								let buf = new ArrayBuffer(encryptedStr.length);
								let view = new Uint8Array(buf);
								for (let i = 0; i < encryptedStr.length; i++) {
									view[i] = encryptedStr.charCodeAt(i);
								}
								args.data = buf;
							} else {
								args.data = encryptedStr;
							}
						}
						uni.setStorageSync("ebody", args.data instanceof ArrayBuffer ? "ArrayBuffer(encrypted)" : JSON.stringify(args.data));
					}

				} catch (e) {
					console.error('加密失败:', e);
				}

				shadowState.arshadow$vData.touchStartCount = 0;
				shadowState.arshadow$vData.touchMoveCount = 0;
				shadowState.arshadow$vData.inputCount = 0;
				shadowState.arshadow$vData.totalScore = 0;
			}
		},
		success(args) {
			return ar_shadow_decodeResponse(args);
		}
	});

	if (shadowlib && shadowlib.ar_shadow_getrandom) {
		let arshadowtoken = uni.getStorageSync("ar_shadow_token1017");
		if (!arshadowtoken) {
			try {
				arshadowtoken = (shadowlib.ar_shadow_getrandom() + new Date().getTime()).padStart(32, '0');
				uni.setStorageSync("ar_shadow_token1017", arshadowtoken);
			} catch (e) {
				console.error('Token 生成失败:', e);
			}
		}
	}

	shadowState.arshadow$vData.touchStartCount = 0;
	shadowState.arshadow$vData.touchMoveCount = 0;
	shadowState.arshadow$vData.inputCount = 0;
	shadowState.arshadow$vData.totalScore = 0;

	const systemInfo = uni.getSystemInfoSync();
	shadowState.arshadow$vData.arlang = systemInfo.language;
	shadowState.arshadow$vData.sysv = systemInfo.system;
	shadowState.arshadow$vData.brand = systemInfo.brand;

	uni.startGyroscope({
		success: function () { }
	});

	uni.onGyroscopeChange((res) => {
		shadowState.arshadow$vData.gyroscope = {
			x: res.x.toFixed(2),
			y: res.y.toFixed(2),
			z: res.z.toFixed(2),
		};
	});

	uni.getBatteryInfo({
		success: (res) => {
			shadowState.arshadow$vData.battery = res.level;
		},
	});
}

export function updateShadowPubKey() {
	try {
		uni.request({
			url: ar_shadow_publickeyurl,
			method: 'GET',
			success: (res) => {
				if (res.statusCode === 200 && res.data?.publicKey) {
					uni.setStorageSync('ar_shadow_publicKey', res.data.publicKey);
					shadowState.isPubKeyInit = true;
				}
			}
		});
	} catch (err) {
		console.error('更新公钥失败:', err);
	}
}

export function recordTouchStart() {
	shadowState.arshadow$vData.touchStartCount++;
	shadowState.arshadow$vData.totalScore++;
}

export function recordTouchMove() {
	shadowState.arshadow$vData.touchMoveCount++;
	shadowState.arshadow$vData.totalScore++;
}

export function recordInput() {
	shadowState.arshadow$vData.inputCount++;
	shadowState.arshadow$vData.totalScore++;
}

export function getShadowData() {
	return shadowState.arshadow$vData;
}


const initCtx1 = {
	shadowState,
	initShadowSDK,
	updateShadowPubKey,
	recordTouchStart,
	recordTouchMove,
	recordInput,
	getShadowData
}


export { initCtx1 };
export default initCtx1;
// #ifndef H5
exports.initCtx1 = initCtx1;
// #endif