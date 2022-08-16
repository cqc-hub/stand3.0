//公用方法
/**
 * 加载动画
 * @param tips 提示语句
 * @returns 关闭loading
 */
export const showLoading = (tips: string = '加载中...') => {
	uni.showLoading({
		title: tips,
		mask: true
	});
	uni.showNavigationBarLoading();
};
export const hideLoading = () => {
	uni.hideLoading();
	uni.hideNavigationBarLoading();
};

export function cloneUtil<T>(target): T {
	// [object Array]  [object Object]  [object Function]
	const type = Object.prototype.toString.call(target);
	let res;
	if (type.includes('Array')) {
		res = [];
	} else if (type.includes('Object')) {
		res = {};
	} else {
		res = target;
	}

	for (let i in target) {
		if (typeof target[i] === 'object') {
			res[i] = cloneUtil(target[i]);
		} else {
			res[i] = target[i];
		}
	}

	return res;
}
/**
 *
 * @param url 拼接之前的数据
 * @param query 对象
 * @returns 对象数据拼接在参数上
 */
export const joinQuery = function (url, query) {
	const strQuery = Object.entries(query)
		.map(([key, value]) => `${key}=${value}`)
		.join('&');

	return url + '?' + strQuery;
};

/**
 * 节流函数
 */
export const throttle = function (func: Function, wait: number) {
	let context, args;
	let previous = 0;

	return function () {
		const now = +new Date();
		context = this;
		args = arguments;

		if (now - previous > wait) {
			func.apply(context, args);
			previous = now;
		}
		// eslint enable
	};
};

export const getQueryUrl = function (url: string): BaseObject {
	const aUrl = [...url];
	const aArg = aUrl
		.slice(aUrl.findIndex((o) => o === '?') + 1)
		.join('')
		.split('&')
		.map((o) => {
			const [key, value] = o.split('=');
			return [key, value];
		});

	return Object.fromEntries(aArg);
};

/**
 * target.a.b.c = opt.value
 * @param opt
 * @param target
 * @returns target
 */
export const insertObject = (
	opt: { key: string; value: any },
	target: BaseObject
) => {
	const { key, value } = opt;
	const keySlice = key.split('.');
	const len = keySlice.length;
	let valueCache: any = {};

	while (keySlice.length) {
		const lenNow = keySlice.length;
		const keyItem = keySlice.shift();
		if (!keyItem) {
			break;
		}

		if (lenNow === len) {
			if (target[keyItem]) {
				valueCache = target[keyItem];
			} else {
				if (len === 1) {
					valueCache = target[keyItem] = value;
				} else {
					valueCache = target[keyItem] = {};
				}
			}
		} else {
			// end loop
			if (lenNow === 1) {
				valueCache[keyItem] = value;
			} else {
				if (!valueCache[keyItem]) {
					valueCache[keyItem] = {};
					valueCache = valueCache[keyItem];
				} else {
					valueCache = valueCache[keyItem];
				}
			}
		}
	}

	return target;
};
