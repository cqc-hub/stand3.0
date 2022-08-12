import { defineStore } from 'pinia';
import { BASE_IMG } from '@/config/global';

const userStore = defineStore('user', {
	persist: {
		key: '_user',
		paths: ['name', 'sex', 'idNo', 'cellPhoneNum', 'patientId']
	},

	state: () => {
		return {
			name: '',
			sex: '',
			idNo: '',
			cellPhoneNum: '',
			patientId: ''
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

const getAvatar = function (sex) {
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
