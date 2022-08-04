import { defineStore } from 'pinia';

const userStore = defineStore('user', {
	persist: {
		key: '_user',
		paths: ['age']
	},

	state: () => {
		return {
			name: '张三',
			age: 20,
			sex: '',
			patientId: '46375274563284564637527456328456'
		};
	},

	actions: {
		updateName(name: string) {
			this.name = name;
		},

		updateAge(age: number) {
			this.age = age;
		}
	},

	getters: {
		double(): number {
			return this.age * 2;
		},

		getAvatar(): string {
			return 'https://phsdevoss.eheren.com/pcloud/image/img_boy_110px@3x.png';
		}
	}
});

export const useUserStore = function () {
	return userStore();
};
