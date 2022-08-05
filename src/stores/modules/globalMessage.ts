import { defineStore } from 'pinia';

let timer: null | number = null;
const messageStore = defineStore('message', {
	state() {
		return {
			isShow: false,
			msg: '',
			duration: 0
		};
	},

	actions: {
		showMessage(message: string, duration = 0) {
			this.isShow = true;
			this.duration = duration;
			this.msg = message;

			uni.$emit('showMessage');

			if (timer) {
				clearTimeout(timer);
			}

			if (duration) {
				timer = setTimeout(() => {
					this.closeMessage();
				}, duration);
			}
		},

		closeMessage() {
			if (timer) {
				clearTimeout(timer);
			}
			this.isShow = false;
			uni.$emit('closeMessage');
		}
	}
});

export const useMessageStore = function () {
	return messageStore();
};
