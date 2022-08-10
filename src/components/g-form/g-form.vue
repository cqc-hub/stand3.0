<template>
	<view class="">
		<view v-if="list.length" class="container">
			<view
				v-for="item in list"
				:key="item.key"
				:class="{
					'form-item-icon': item.field === 'select'
				}"
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
						v-if="['input-text'].includes(item.field)"
						:placeholder="item.placeholder"
						:inputBorder="false"
						:clearable="false"
						:placeholderStyle="inputPlaceHolderStyle"
						:value="value[item.key]"
						@input="(e) => changeInput(item, e)"
						:class="{
							'my-disabled': item.disabled
						}"
						class="form-input"
					/>

					<view
						v-if="item.field === 'select'"
						@tap.prevent.stop="chooseOption(item)"
						class=""
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

					<view>233</view>
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
	IRule
} from '@/components/g-form/index';
import wybActionSheet from '@/components/wyb-action-sheet/wyb-action-sheet.vue';
import { useGlobalStore, useUserStore, useMessageStore } from '@/stores';

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

	emits: ['update:value', 'submit'],

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
		let cacheItem: null | TInstance = null;

		const setList = function (initList: TInstance[]) {
			list.value = initList;

			const cache: BaseObject = {};
			list.value.map((o) => {
				const { key } = o;

				if (!props.value[key]) {
					cache[key] = '';
				}
			});

			setData(cache);
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

		const setData = function (value: BaseObject) {
			emits('update:value', {
				...props.value,
				...value
			});
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
						throw new Error(item.label + ': 校验失败');
					}
				});
			}
		};

		const submit = function () {
			const data = props.value;
			const len = list.value.length >>> 0;
			let k = 0;

			while (k < len) {
				const item = list.value[k++];
				const { rule, key } = item;
				const v = data[key];

				if (rule) {
					ruleMatch(rule, v, item);
				}
			}

			emits('submit', {
				data
			});
		};

		const changeInput = (item: TInstance, v: string) => {
			setData({
				[item.key]: v
			});
		};

		const changeSelect = function (item: TInstance, v: any) {
			if (item.field !== 'select') return;

			setData({
				[item.key]: v
			});
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
			changeInput
		};
	}
});
</script>

<style lang="scss" scoped>
.form-item {
	display: grid;

	grid-template-columns: 220rpx 1fr;
	align-items: center;
	background-color: var(--h-color-white);
	padding: 26rpx;
	padding-left: 14rpx;
	padding-right: 32rpx;
	border-bottom: 1rpx solid var(--hr-neutral-color-2);

	.label {
		&.item-require {
			color: var(--hr-neutral-color-8);

			&::before {
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

		&:first-child {
			flex: 1;
		}
	}
}

.my-disabled {
	pointer-events: none !important;
}
</style>
