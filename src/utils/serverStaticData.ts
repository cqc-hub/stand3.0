import { getLocalStorage, setLocalStorage } from '@/common';
import api from '@/service/api';

export class ServerStaticData {
	/**
	 * 选择地址的数据
	 */
	static async getAddressData(): Promise<any[]> {
		const addressCity = getLocalStorage('addressCity');

		if (!addressCity) {
			const { result } = await api.getAllDivision({});

			if (result && result.length) {
				setLocalStorage({
					addressCity: result
				});

				return result;
			} else {
				return [];
			}
		} else {
			return addressCity;
		}
	}

	private constructor() {}
}
