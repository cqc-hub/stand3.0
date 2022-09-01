<template>
	<view class="">
		<view v-if="list.length" class="container">
			<view
				v-for="item in list"
				:key="item.key"
				:class="{
					'form-item-icon': item.field === 'select',
					'item-for-show': item.isForShow,
					'form-item-bold': bodyBold,
					'form-item-disabled': item.disabled,
				}"
				:style="`--label-width: ${item.labelWidth || '190rpx'}; ${
					(item.rowStyle && item.rowStyle) || ''
				}`"
				class="form-item"
			>
				<view
					:class="{
						'item-require': item.required && showRequireIcon
					}"
					class="label"
				>
					{{ item.label }}
				</view>

				<view
					:class="{
						[`form-item-${item.field}`]: true
					}"
					class="container-body"
					@tap.prevent.stop="clickContainer(item)"
				>
					<block v-if="item.isForShow">
						<view class="content-show">
							{{
								item.field === 'select'
									? ServerStaticData.getOptionsLabel(
											item.options,
											value[item.key]
									  )
									: value[item.key]
							}}
						</view>
					</block>

					<block v-else>
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
							:disabled="item.disabled"
							@input="(e) => changeInput(item, e)"
							@blur="inputBlur(item, $event)"
							:class="{
								'my-disabled': item.disabled,
								'my-disabled-color': item.disabled
							}"
							class="form-input"
						/>

						<view
							v-if="item.field === 'select'"
							:class="{
								'my-disabled': item.disabled
							}"
							class="full-item"
						>
							<view class="select-item">
								<uni-easyinput
									:disabled="item.disabled"
									:placeholder="item.placeholder"
									:inputBorder="false"
									:clearable="false"
									:placeholderStyle="inputPlaceHolderStyle"
									:value="
										ServerStaticData.getOptionsLabel(
											item.options,
											value[item.key]
										)
									"
									class="form-input"
								/>
							</view>
						</view>

						<view
							v-if="item.field === 'address'"
							:class="{
								'my-disabled': item.disabled
							}"
							class="full-item"
						>
							<view class="my-disabled">
								<uni-easyinput
									:placeholder="item.placeholder"
									:inputBorder="false"
									:clearable="false"
									:placeholderStyle="inputPlaceHolderStyle"
									:value="value[item.key]"
									class="form-input"
								/>
							</view>
						</view>

						<view
							v-if="item.field === 'time-picker'"
							:class="{
								'my-disabled': item.disabled
							}"
							class="full-item"
						>
							<uni-datetime-picker
								:modelValue="value[item.key]"
								:type="item.type"
								:start="item.start"
								:end="item.end"
								:disabled="item.disabled"
								@change="changeTimePicker(item, $event)"
							>
								<view class="my-disabled">
									<uni-easyinput
										:placeholder="item.placeholder"
										:inputBorder="false"
										:clearable="false"
										:placeholderStyle="
											inputPlaceHolderStyle
										"
										:value="value[item.key]"
										class="form-input"
									/>
								</view>
							</uni-datetime-picker>
						</view>

						<view
							v-if="item.field === 'switch'"
							:class="{
								'my-disabled': item.disabled
							}"
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
								'form-item-verify-disabled':
									verifyTip || item.disabled,
								'my-disabled': verifyTip || item.disabled
							}"
							class="verify-btn"
						>
							{{ verifyTip || item.verifyBtnText }}
						</view>
					</block>

					<view
						v-if="item.ocr"
						@click="useOcrAction"
						:class="{
							'my-disabled': item.ocrDisabled
						}"
						class="ocr"
					>
						<view class="iconfont icon-camera">&#xe6be;</view>
						<view>身份证识别</view>
					</view>

					<view
						v-if="item.showSuffixArrowIcon"
						class="icon-font icon-resize ico_arrow"
					/>
				</view>
			</view>
		</view>

		<view class="form-picker">
			<uni-data-picker
				:map="{ text: 'label', value: 'value' }"
				:localdata="actionSheetOpt"
				:clear-icon="false"
				@change="pickerChange"
				ref="dataPicker"
			>
				<view />
			</uni-data-picker>
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

<script lang="ts" setup>
import { ref, withDefaults } from 'vue';
import type {
	TInstance,
	ISelectOptions,
	IRule,
	IInputVerifyInstance,
	ISwitchInstance
} from '@/components/g-form/index';
import wybActionSheet from '@/components/wyb-action-sheet/wyb-action-sheet.vue';
import { useMessageStore } from '@/stores';
import { ServerStaticData, useOcr } from '@/utils';

/**
 * 部分函数、正则等特殊对象在小程序无法prop传递， 请使用 setList(list)
 */

const props = withDefaults(
	defineProps<{
		value: BaseObject;
		// 加粗内容
		bodyBold: boolean;
		// 是否展示必填的 * 号
		showRequireIcon: boolean;
	}>(),
	{
		value: () => ({}),
		bodyBold: false,
		showRequireIcon: false
	}
);

const emits = defineEmits([
	'update:value',
	'submit',
	'change',
	'picker-change',
	'input-blur',
	'select-change',
	'address-change'
]);

const inputPlaceHolderStyle = `
    color: var(--hr-neutral-color-5);
		font-size: var(--hr-font-size-base);
`;

const dataPicker = ref();
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

const useOcrAction = () => {
	useOcr();
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

const setList = async function (initList: TInstance[]) {
	const defaultKeys = Reflect.ownKeys(props.value);
	const cache: BaseObject = {};

	const len = initList.length >>> 0;
	let k = 0;

	while (k < len) {
		const o = initList[k++];
		const { key, field } = o;
		if (!defaultKeys.includes(key)) {
			if (field === 'switch') {
				cache[key] = false;
			} else {
				cache[key] = '';
			}
		}

		if (field === 'address' && !o.options) {
			o.options = await ServerStaticData.getAddressData();
		}

		if (field === 'select') {
			const { autoOptions, options } = o;

			if (!options.length && autoOptions) {
				switch (autoOptions) {
					case 'nationTerms':
						o.options = await ServerStaticData.getNationTerms();
						break;

					case 'patientTypeTerms':
						o.options =
							await ServerStaticData.getPatientTypeTerms();
						break;

					case 'sysTerms':
						o.options = await ServerStaticData.getSystemTerms();
						break;

					case 'idTypeTerms':
						o.options = await ServerStaticData.getIdTypeTerms();
						break;

					default:
						break;
				}
			}
		}
	}

	setData(cache);
	list.value = initList;
};

const clickContainer = function (item: TInstance) {
	if (item.disabled) {
		return;
	}
	if (item.field === 'select' || item.field === 'address') {
		const { options } = item;

		if (!options) {
			return;
		}

		actionSheetOpt.value = options;
		cacheItem = item;

		if (item.field === 'select') {
			actionSheet.value.showActionSheet();
		}

		if (item.field === 'address') {
			dataPicker.value.show();
		}
	}
};

const actionItemClick = function ({ item }: { item: ISelectOptions }) {
	if (!cacheItem) return;
	const { value } = item;

	emits('select-change', {
		item: { ...cacheItem },
		value
	});

	if (cacheItem.field === 'select') {
		changeSelect(cacheItem, value);
		cacheItem = null;
	}
};

const pickerChange = function (e: {
	detail: { value: { text: string; value: any }[] };
}) {
	if (!cacheItem) return;
	const { value: choose } = e.detail;
	const { key, field } = cacheItem;

	if (field === 'address') {
		addressChange(cacheItem, choose);
	} else {
		emits('picker-change', {
			item: cacheItem,
			value: choose
		});
	}
};

const addressChange = (item: TInstance, v) => {
	const { key, field } = item;

	if (field === 'address') {
		const selLabels = v.map((o) => o.text).join('');
		setData({
			[key]: selLabels
		});

		emits('address-change', {
			item: item,
			value: v
		});
	}
};

const setData = function (value: BaseObject, item?: TInstance) {
	const oldValue = item ? props.value[item.key] : undefined;

	emits('update:value', {
		...props.value,
		...value
	});

	if (item) {
		const key = Object.keys(value)[0];
		emits('change', {
			item,
			value: value[key],
			oldValue
		});
	}
};

const ruleMatch = (rule: IRule | IRule[], value: string, item: TInstance) => {
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

const submit = async function () {
	const data = props.value;
	const len = list.value.length >>> 0;
	let k = 0;

	while (k < len) {
		const item = list.value[k++];
		const { rule, key, required, emptyMessage, validator } = item;
		const v = data[key];

		const isFillValue = !!(v || v === 0);

		if (required && !isFillValue) {
			const defaultEmptyMessage = item.label + ' 不能为空';
			messageStore.showMessage(emptyMessage || defaultEmptyMessage, 1500);
			throw new Error(item.label + ': 校验失败(empty)');
		}

		if (rule && isFillValue) {
			ruleMatch(rule, v, item);
		}

		if (validator) {
			const { success, message } = await validator(v, item);

			if (!success) {
				messageStore.showMessage(message, 1500);
				throw new Error(item.label + ': 校验失败(validator)');
			}
		}
	}

	emits('submit', {
		data
	});
};

const changeInput = (item: TInstance, v: string) => {
	// 微信有bug 需要判断下
	if (typeof v === 'string') {
		setData(
			{
				[item.key]: v
			},
			item
		);
	}
};

const inputBlur = (item: TInstance, e) => {
	const {
		detail: { value }
	} = e;

	emits('input-blur', {
		item,
		value
	});
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

const changeTimePicker = function (item: TInstance, v: any) {
	const value = typeof v == 'string' ? v : v.join(' - ');

	setData(
		{
			[item.key]: value
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

defineExpose({
	setList,
	submit
});
</script>

<style lang="scss" scoped>
@import './css';
</style>
