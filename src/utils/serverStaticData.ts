import { getLocalStorage, setLocalStorage } from '@/common';
import { ISelectOptions } from '@/components/g-form';
import api from '@/service/api';

export class ServerStaticData {
	/**
	 * 选择地址的数据
	 */
	static async getAddressData(): Promise<ISelectOptions[]> {
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
