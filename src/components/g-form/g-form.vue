<template>
	<view class="">
		<view v-if="list.length" class="container">
			<!-- ${(item.rowStyle && item.rowStyle) || ''} -->
			<view
				v-for="item in list"
				:key="item.key"
				:class="{
					'form-item-icon': item.field === 'select'
				}"
				:style="`--label-width: ${item.labelWidth || '190rpx'}; ${
					(item.rowStyle && item.rowStyle) || ''
				}`"
				class="form-item"
			>
				<view
					:class="`${item.required && 'item-require'}`"
					class="label"
				>
					{{ item.label }}
				</view>

				<view
					:class="{
						[`form-item-${item.field}`]: true,
						'my-disabled': item.disabled
					}"
					class="container-body"
				>
					<uni-easyinput
						v-if="
							item.field === 'input-text' ||
							item.field === 'input-verify'
						"
						:placeholder="item.placeholder"
						:inputBorder="false"
						:clearable="false"
						:placeholderStyle="inputPlaceHolderStyle"
						:value="value[item.key]"
						:type="item.inputType"
						:maxlength="item.maxlength"
						@input="(e) => changeInput(item, e)"
						:class="{
							'my-disabled': item.disabled
						}"
						class="form-input"
					/>

					<view
						v-if="item.field === 'select'"
						@tap.prevent.stop="chooseOption(item)"
					>
						<view class="my-disabled">
							<uni-easyinput
								:placeholder="item.placeholder"
								:inputBorder="false"
								:clearable="false"
								:placeholderStyle="inputPlaceHolderStyle"
								:value="findOptionLabel(item, value[item.key])"
								class="form-input"
							/>
						</view>
					</view>

					<view
						v-if="item.field === 'switch'"
						class="container-body-switch"
					>
						<switch
							:checked="!!value[item.key]"
							:disabled="item.disabled"
							@change="(e: any) => changeSwitch(item, e)"
							color="var(--hr-brand-color-6)"
						/>
					</view>

					<view
						v-if="item.field === 'input-verify'"
						@tap="requestVerify(item)"
						:class="{
							'form-item-verify-disabled': verifyTip,
							'my-disabled': verifyTip
						}"
						class="verify-btn"
					>
						{{ verifyTip || item.verifyBtnText }}
					</view>

					<view
						v-if="item.showSuffixArrowIcon"
						class="icon-font icon-resize ico_arrow"
					/>
				</view>
			</view>
		</view>

		<wyb-action-sheet
			ref="actionSheet"
			:options="actionSheetOpt"
			:showCancel="false"
			:duration="100"
			@itemclick="actionItemClick"
			title=""
		/>
	</view>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue';
import type {
	TInstance,
	ISelectOptions,
	IRule,
	IInputVerifyInstance,
	ISwitchInstance
} from '@/components/g-form/index';
import wybActionSheet from '@/components/wyb-action-sheet/wyb-action-sheet.vue';
import { useGlobalStore, useUserStore, useMessageStore } from '@/stores';

/**
 * 部分函数、正则等特殊对象在小程序无法prop传递， 请使用 setList(list)
 */

export default defineComponent({
	components: {
		wybActionSheet
	},

	props: {
		value: {
			type: Object as PropType<BaseObject>,
			default: () => ({})
		}
	},

	emits: ['update:value', 'submit', 'change'],

	setup(props, ctx) {
		const inputPlaceHolderStyle = `
    color: var(--hr-neutral-color-5);
		font-size: var(--hr-font-size-base);
`;

		const emits = ctx.emit;
		const actionSheet = ref();
		const actionSheetOpt = ref<ISelectOptions[]>([]);
		const list = ref<TInstance[]>([]);
		const messageStore = useMessageStore();

		const verifyTip = ref<string>('');
		let cacheItem: null | TInstance = null;
		let timer: null | number = null;
		const wait = (n: number) => new Promise((r) => setTimeout(r, n));

		const clearTimer = () => {
			if (timer) {
				clearTimeout(timer);
				timer = null;
				verifyTip.value = '';
			}
		};
		const requestVerify = async (item: IInputVerifyInstance) => {
			if (timer) {
				clearTimer();
			} else {
				uni.showLoading({
					title: '请求中...',
					mask: true
				});

				await wait(1500);
				let waitTime = item.verifySecond;

				verifyTip.value = `${waitTime--}s后重新发送`;
				timer = setInterval(() => {
					verifyTip.value = `${waitTime--}s后重新发送`;

					if (waitTime <= -1) {
						clearTimer();
					}
				}, 1000);
				uni.hideLoading();
			}
		};

		const setList = function (initList: TInstance[]) {
			const defaultKeys = Reflect.ownKeys(props.value);
			const cache: BaseObject = {};

			initList.map((o) => {
				const { key } = o;
				if (!defaultKeys.includes(key)) {
					cache[key] = '';
				}
			});

			setData(cache);
			list.value = initList;
		};

		const chooseOption = function (item: TInstance) {
			if (item.disabled) {
				return;
			}

			if (item.field === 'select') {
				const { options } = item;
				actionSheetOpt.value = options;
				cacheItem = item;

				actionSheet.value.showActionSheet();
			}
		};

		const actionItemClick = function ({ item }: { item: ISelectOptions }) {
			if (!cacheItem) return;

			if (cacheItem.field === 'select') {
				changeSelect(cacheItem, item.value);
				cacheItem = null;
			}
		};

		const setData = function (value: BaseObject, item?: TInstance) {
			emits('update:value', {
				...props.value,
				...value
			});

			if (item) {
				const key = Object.keys(value)[0];
				emits('change', {
					item,
					value: value[key]
				});
			}
		};

		const findOptionLabel = function (item: TInstance, value) {
			if (item.field === 'select') {
				const opt = item.options.find((o) => o.value === value);

				if (opt) {
					return opt.label;
				} else {
					return '';
				}
			} else {
				return '';
			}
		};

		const ruleMatch = (
			rule: IRule | IRule[],
			value: string,
			item: TInstance
		) => {
			const matchValue = (r: IRule) => {
				const _rule = r.rule;
				const _r = value.match(_rule);

				if (_r) {
					const [_matchValue] = _r;
					return _matchValue === value;
				} else {
					return false;
				}
			};

			if (Array.isArray(rule)) {
				rule.map((o) => {
					const flag = matchValue(o);
					if (!flag) {
						messageStore.showMessage(o.message, 1500);
						throw new Error(item.label + ': 校验失败(rule)');
					}
				});
			} else {
				const flag = matchValue(rule);
				if (!flag) {
					messageStore.showMessage(rule.message, 1500);
					throw new Error(item.label + ': 校验失败(rule)');
				}
			}
		};

		const submit = function () {
			const data = props.value;
			const len = list.value.length >>> 0;
			let k = 0;

			while (k < len) {
				const item = list.value[k++];
				const { rule, key, required, emptyMessage } = item;
				const v = data[key];

				const isFillValue = !!(v || v === 0);

				if (required && !isFillValue) {
					const defaultEmptyMessage = item.label + ' 不能为空';
					messageStore.showMessage(
						emptyMessage || defaultEmptyMessage,
						1500
					);
					throw new Error(item.label + ': 校验失败(empty)');
				}

				if (rule && isFillValue) {
					ruleMatch(rule, v, item);
				}
			}

			emits('submit', {
				data
			});
		};

		const changeInput = (item: TInstance, v: string) => {
			setData(
				{
					[item.key]: v
				},
				item
			);
		};

		const changeSelect = function (item: TInstance, v: any) {
			if (item.field !== 'select') return;

			setData(
				{
					[item.key]: v
				},
				item
			);
		};

		const changeSwitch = function (item: ISwitchInstance, { detail }) {
			setData(
				{
					[item.key]: detail.value
				},
				item
			);
		};

		return {
			setData,
			actionSheet,
			actionSheetOpt,
			list,
			setList,
			chooseOption,
			actionItemClick,
			inputPlaceHolderStyle,
			findOptionLabel,
			submit,
			changeInput,
			requestVerify,
			verifyTip,
			changeSwitch
		};
	}
});
</script>

<style lang="scss" scoped>
.form-item {
	display: grid;

	grid-template-columns: var(--label-width) 1fr;
	align-items: center;
	background-color: var(--h-color-white);
	padding: 18rpx 32rpx;
	border-bottom: 1rpx solid var(--hr-neutral-color-2);
	color: var(--hr-neutral-color-8);

	.label {
		&.item-require {
			&::after {
				content: '*';
				color: var(--hr-error-color-6);
			}
		}
	}

	:deep(input) {
		color: var(--hr-neutral-color-10) !important;
		font-size: var(--hr-font-size-base);
		background-color: var(--h-color-white) !important;
		opacity: 1;
	}

	.container-body {
		display: flex;
		align-items: center;
		justify-content: space-between;

		.container-body-switch {
			flex: 1;
			display: flex;
			flex-direction: row-reverse;
		}

		&:first-child {
			flex: 1;
		}

		.verify-btn {
			color: var(--hr-brand-color-6);
		}

		.form-item-verify-disabled {
			color: var(--hr-neutral-color-5);
		}
	}
}

.my-disabled {
	pointer-events: none !important;
}


.icon-resize {
	width: 60rpx;
	height: 60rpx;
}
</style>
