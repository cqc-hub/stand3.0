import { defineStore } from 'pinia';

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
			patientId: '46375274563284564637527456328456'
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
			return 'https://phsdevoss.eheren.com/pcloud/image/img_boy_110px@3x.png';
		}
	}
});

export const useUserStore = function () {
	return userStore();
};
