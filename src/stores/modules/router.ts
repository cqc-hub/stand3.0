import { defineStore } from 'pinia';
import { joinQuery } from '@/common';
import { outLogin } from '@/utils';
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

const routerStore = defineStore('router', {
	persist: {
		key: 'router',
		paths: ['_id', 'fullUrl', 'backRoute', '_p']
	},

	state: () => {
		return {
			_p: '',
			_id: '',
			fullUrl: '',

			backRoute: <ILoginBack>{}
		};
	},

	actions: {
		update_P() {
			this._p = '1';
		},

		updateId(id) {
			this._id = id;
		},

		updateFullUrl(url: string) {
			this.fullUrl = url;
		},

		receiveQuery(prop: ILoginBack) {
			if (!(prop._p || prop._url)) return;
			console.log(prop, '接受----');
			if (prop._isOutLogin) {
				outLogin({
					isHideMessage: true
				});
			}

			this.backRoute = prop;
			if (prop._p) {
				// ...
				this.update_P();
			} else {
				const { _url, _query } = prop;

				let fullUrl = decodeURIComponent(<string>_url);

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
			return !!(this.backRoute._p || this.backRoute._url);
		}
	}
});

export const useRouterStore = function () {
	return routerStore();
};
