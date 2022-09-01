import { defineStore } from 'pinia';
import { joinQuery } from '@/common';

const spliceUrl = (prop: Required<Pick<ILoginBack, '_url' | '_query'>>) => {
	const { _url, _query } = prop;

	const dealQuery = Object.fromEntries(
		Object.entries(_query).filter(([key, value]) => value)
	);

	if (_url.includes('?')) {
		return _url + '&' + joinQuery('', dealQuery).slice(1);
	} else {
		return joinQuery(_url, dealQuery);
	}
};

//页面存储token brower等
const routerStore = defineStore('router', {
	persist: {
		key: 'router',
		paths: ['itemUrl', 'fullUrl', 'backRoute']
	},

	state: () => {
		return {
			itemUrl: '',
			fullUrl: '',

			backRoute: <ILoginBack>{}
		};
	},

	actions: {
		updateItemUrl(itemUrl) {
			this.itemUrl = itemUrl;
		},

		updateFullUrl(url: string) {
			this.fullUrl = url;
		},

		receiveQuery(prop: ILoginBack) {
			if (!(prop._id || prop._url)) return;

			this.backRoute = prop;
			if (prop._id) {
				// ...
			} else {
				const { _url, _query } = prop;

				let fullUrl = _url;

				if (fullUrl) {
					if (_query) {
						fullUrl = spliceUrl({
							_url: fullUrl,
							_query
						});
					}

					this.fullUrl = fullUrl;
				}
			}
		},

		clear() {
			this.$reset();
		}
	},

	getters: {
		isWork(): boolean {
			return !!(this.backRoute._id || this.backRoute._url);
		}
	}
});

export const useRouterStore = function () {
	return routerStore();
};
