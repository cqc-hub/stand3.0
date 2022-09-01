import { useRouterStore } from '@/stores/modules/router';
import { joinQuery } from '@/common';

const spliceUrl = (prop: Required<Pick<ILoginBack, '_url' | '_query'>>) => {
	const { _url, _query } = prop;

	if (_url.includes('?')) {
		return _url + '&' + joinQuery('', _query).slice(1);
	} else {
		return joinQuery(_url, _query);
	}
};

export const receiveQuery = function (prop: ILoginBack) {
	const routeStore = useRouterStore();

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

			routeStore.updateFullUrl(fullUrl);
		}
	}
};
