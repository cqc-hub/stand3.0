import { defineStore } from 'pinia';
import { BASE_IMG } from '@/config/global';
import { IPat } from '@/stores/type';

const userStore = defineStore('user', {
	persist: {
		key: '_user',
		paths: [
			'name',
			'sex',
			'idNo',
			'cellPhoneNum',
			'patientId',
			'cacheUser',
			'patList',
			'patChoose'
		]
	},

	state: () => {
		return {
			name: '',
			sex: '',
			idNo: '',
			cellPhoneNum: '',
			patientId: '',
			patList: <IPat[]>[],
			patChoose: <IPat>{},

			cacheUser: {
				userName: '',
				mobile: '',
				certNo: '',
				certType: '',
				gender: ''
			}
		};
	},

	actions: {
		updateName(name: string) {
			this.name = name;
		},

		updateSex(sex: string) {
			this.sex = sex;
		},

		updateIdNo(id: string) {
			this.idNo = id;
		},

		updatePhone(phone: string) {
			this.cellPhoneNum = phone;
		},

		updateCacheUser(
			cache: Partial<{
				userName: string;
				mobile: string;
				certNo: string;
				certType: string;
				gender: string;
			}>
		) {
			Object.entries(cache).map(([key, value]) => {
				if (value) {
					this.cacheUser[key] = value;
				}
			});
		},

		updatePatList(patList: IPat[]) {
			this.patList = patList;

			if (!Object.keys(this.patChoose).length) {
				const patDefault = patList.find((o) => o.defaultFlag === '1');
				if (patDefault) {
					this.updatePatChoose(patDefault);
				}
			}
		},

		updatePatChoose(pat: IPat) {
			this.patChoose = pat;
		},

		clearStore() {
			this.name = '';
			this.sex = '';
			this.idNo = '';
			this.cellPhoneNum = '';
			this.patientId = '';
		}
	},

	getters: {
		double(): number {
			return this.name.length * 2;
		},

		getAvatar(): string {
			return getAvatar(this.sex);
		}
	}
});

export const getAvatar = function (sex) {
	let path = '';
	if (sex === '男') {
		path = 'home-my-avatar-nan.png.png';
	} else if (sex === '女') {
		path = 'home-my-avatar-nv.png';
	} else {
		path = 'home-my-avatar-outlogin.png';
	}
	return BASE_IMG + path;
};

export const useUserStore = function () {
	return userStore();
};
