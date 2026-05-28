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
	pubKeyFetchAttempted: false, // 记录是否已尝试拉取过公钥
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

// 公钥加载超时时间限制
const PUB_KEY_TIMEOUT = 1000;
// 全局待发送的请求队列
const pendingRequests = [];
// 公钥加载超时保护定时器
let pubKeyTimeoutTimer = null;
// 是否正在请求公钥中
let isPubKeyFetching = false;

// 清除公钥加载定时器
function clearPubKeyTimeout() {
	if (pubKeyTimeoutTimer) {
		clearTimeout(pubKeyTimeoutTimer);
		pubKeyTimeoutTimer = null;
	}
}

// 释放并执行队列中的所有请求
function flushPendingRequests() {
	clearPubKeyTimeout();

	if (pendingRequests.length === 0) return;
	console.log(`[ShadowSDK] 公钥初始化状态更新，开始消费并发送队列中积压的 ${pendingRequests.length} 个请求`);

	const originRequest = uni.request._original || uni.request;

	while (pendingRequests.length > 0) {
		const item = pendingRequests.shift();
		if (item.timeoutTimer) {
			clearTimeout(item.timeoutTimer);
		}

		if (item.resolve) {
			// Promise 链式调用
			const p = originRequest(item.args);
			if (p && typeof p.abort === 'function') {
				item.setRealTask(p);
			}
			p.then(res => {
				item.resolve(res);
			}).catch(err => {
				item.reject(err);
			});
		} else {
			// 回调函数调用
			const task = originRequest(item.args);
			item.setRealTask(task);
		}
	}
}

// 获取公钥接口的主动调度器
export function fetchPubKey() {
	if (isPubKeyFetching) return;
	isPubKeyFetching = true;
	shadowState.pubKeyFetchAttempted = true;

	clearPubKeyTimeout();
	pubKeyTimeoutTimer = setTimeout(() => {
		console.warn('[ShadowSDK] 公钥拉取超时，强行释放待处理队列');
		isPubKeyFetching = false;
		flushPendingRequests();
	}, PUB_KEY_TIMEOUT);

	const originRequest = uni.request._original || uni.request;

	try {
		originRequest({
			url: ar_shadow_publickeyurl,
			method: 'GET',
			timeout: 1000,
			success: (res) => {
				console.log('[ShadowSDK] 获取公钥接口回包状态:', res.statusCode);
				isPubKeyFetching = false;
				if (res.statusCode === 200 && res.data?.publicKey) {
					shadowState.isPubKeyInit = true;
					uni.setStorageSync('ar_shadow_publicKey', res.data.publicKey);
				} else {
					uni.removeStorageSync('ar_shadow_publicKey');
				}
				flushPendingRequests();
			},
			fail: (err) => {
				console.error('[ShadowSDK] 初始化公钥失败:', err);
				isPubKeyFetching = false;
				uni.removeStorageSync('ar_shadow_publicKey');
				flushPendingRequests();
			}
		});
	} catch (err) {
		console.error('[ShadowSDK] 初始化公钥失败:', err);
		isPubKeyFetching = false;
		flushPendingRequests();
	}
}

export function initShadowSDK() {
	console.log('Shadow SDK Init');

	if (!shadowlib || !shadowlib.ar_shadow_addparametertourl) {
		console.warn('shadowlib 未正确加载,SDK 功能将不可用');
	}

	// 代理并重写 uni.request，建立待就绪队列阀门
	if (!uni.request._original) {
		const originRequest = uni.request;

		uni.request = function (args) {
			// 包装劫持 success 和 fail，捕获并透传实际发送的加密 URL
			const originalSuccess = args.success;
			if (originalSuccess) {
				args.success = function (res) {
					res.realRequestUrl = args.url;
					originalSuccess(res);
				};
			}
			const originalFail = args.fail;
			if (originalFail) {
				args.fail = function (err) {
					err.realRequestUrl = args.url;
					originalFail(err);
				};
			}

			// 1. 公钥获取请求本身不拦截，直接放行
			const isPubKeyRequest = args.url === ar_shadow_publickeyurl;
			if (isPubKeyRequest) {
				return originRequest(args);
			}

			// 2. 检查当前域名和黑白名单是否需要加密，若不需要则直接放行
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
			const needEncrypt = isMatchDomain && isNotInWhiteList;

			if (!needEncrypt) {
				return originRequest(args);
			}

			// 3. 检查公钥与 token 是否已就绪，若已就绪直接放行
			const publicKey = uni.getStorageSync('ar_shadow_publicKey');
			const u_token = uni.getStorageSync('ar_shadow_token1017');

			if (publicKey && u_token) {
				return originRequest(args);
			}

			// 4. 未就绪，判断是否已经尝试过拉取公钥
			if (shadowState.pubKeyFetchAttempted && !isPubKeyFetching) {
				return originRequest(args);
			}

			// 5. 如果公钥拉取正在进行中（即小程序刚启动时的首次拉取竞态阶段），才将请求挂起排队
			fetchPubKey();
			console.log('[ShadowSDK] 首次公钥拉取进行中，业务请求进入挂起队列:', args.url);

			const hasCallback = args.success || args.fail || args.complete;
			let resolvePromise, rejectPromise;
			let promise;

			if (!hasCallback) {
				promise = new Promise((resolve, reject) => {
					resolvePromise = resolve;
					rejectPromise = reject;
				});
			}

			let realRequestTask = null;
			const fakeRequestTask = {
				abort() {
					if (realRequestTask) {
						realRequestTask.abort();
					} else {
						const index = pendingRequests.findIndex(item => item.fakeTask === fakeRequestTask);
						if (index > -1) {
							const matchedItem = pendingRequests[index];
							if (matchedItem.timeoutTimer) {
								clearTimeout(matchedItem.timeoutTimer);
							}
							pendingRequests.splice(index, 1);
						}
						const err = { errMsg: 'request:fail abort' };
						if (rejectPromise) rejectPromise(err);
						if (args.fail) args.fail(err);
						if (args.complete) args.complete(err);
					}
				}
			};

			const queueItem = {
				args: args,
				fakeTask: fakeRequestTask,
				setRealTask(task) {
					realRequestTask = task;
				},
				resolve: resolvePromise,
				reject: rejectPromise,
				timeoutTimer: null
			};

			// 单体防卡死逃逸定时器：1秒后如果还没发送，自动自我释放以降级明文发送
			queueItem.timeoutTimer = setTimeout(() => {
				const idx = pendingRequests.indexOf(queueItem);
				if (idx > -1) {
					console.warn('[ShadowSDK] 挂起请求等待公钥超时，执行降级强行释放发送:', args.url);
					pendingRequests.splice(idx, 1);

					if (queueItem.resolve) {
						const p = originRequest(queueItem.args);
						if (p && typeof p.abort === 'function') {
							queueItem.setRealTask(p);
						}
						p.then(res => queueItem.resolve(res)).catch(err => queueItem.reject(err));
					} else {
						const task = originRequest(queueItem.args);
						queueItem.setRealTask(task);
					}
				}
			}, PUB_KEY_TIMEOUT);

			pendingRequests.push(queueItem);

			if (hasCallback) {
				return fakeRequestTask;
			} else {
				promise.abort = () => {
					fakeRequestTask.abort();
				};
				return promise;
			}
		};

		uni.request._original = originRequest;
	}

	// 自动拉取公钥
	fetchPubKey();

	uni.addInterceptor('request', {
		invoke(args) {
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
				return;
			}

			// 确认是需要加密的域名，才设置 responseType 为 arraybuffer
			args.responseType = 'arraybuffer';

			const publicKey = uni.getStorageSync('ar_shadow_publicKey');

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
		success(res) {
			const headers = res.header || {};
			const isObfuscated = headers['x-obfuscated'] === '1' || headers['X-Obfuscated'] === '1';

			// 1. 如果是加密响应，或者数据不是 ArrayBuffer（正常放行的非加密请求），直接交给原有解密器
			if (isObfuscated || !(res.data instanceof ArrayBuffer)) {
				return ar_shadow_decodeResponse(res);
			}

			// 2. 如果是非加密响应且数据为 ArrayBuffer：进行智能类型判定与自动还原
			const contentType = (headers['Content-Type'] || headers['content-type'] || '').toLowerCase();
			const isJson = contentType.indexOf('application/json') > -1;
			const isText = contentType.indexOf('text/') > -1 || contentType.indexOf('application/xml') > -1;

			if (isJson || isText) {
				let rawText = '';
				if (typeof TextDecoder !== 'undefined') {
					rawText = new TextDecoder('utf-8').decode(res.data);
				} else {
					try {
						rawText = decodeURIComponent(escape(String.fromCharCode.apply(null, new Uint8Array(res.data))));
					} catch (e) {
						console.error('[ShadowSDK] 兜底解码非加密二进制响应失败:', e);
						return res; // 失败则退回原始 ArrayBuffer，防止崩溃
					}
				}

				if (isJson) {
					try {
						res.data = JSON.parse(rawText);
					} catch (e) {
						res.data = rawText;
					}
				} else {
					res.data = rawText;
				}
			}
			// 其它文件流类型（如图片/PDF）直接以 ArrayBuffer 原样交回，绝不损坏其数据
			return res;
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
	fetchPubKey();
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