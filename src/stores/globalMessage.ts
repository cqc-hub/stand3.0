import { defineStore } from 'pinia'

let timer: null | number = null
const messageStore = defineStore('message', {
	state() {
		return {
			isShow: false,
			msg: 'dklajhsfklh短发话费四叔贷款累计话费了可视电话减肥了噶三闾大夫共同i他人风口浪尖和大嫂李开复黄金时代了咖啡馆,ghfkljhdsludlsk;ahj;djshah',
			duration: 2000
		}
	},

	actions: {
		showMessage(message: string, duration = 0) {
			this.isShow = true
			this.duration = duration
			this.msg = message

			if (timer) {
				clearTimeout(timer)
			}

			if (duration) {
				timer = setTimeout(() => {
					this.closeMessage()
				}, duration)
			}
		},

		closeMessage() {
			if (timer) {
				clearTimeout(timer)
			}
			this.isShow = false
		}
	}
})

export const useMessageStore = function () {
	return messageStore()
}
