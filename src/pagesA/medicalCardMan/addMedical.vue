<template>
	<view>
		<scroll-view class="scroll-container" scroll-y>
			<view class="form-container">
				<g-form
					v-model:value="formData"
					@submit="formSubmit"
					@change="formChange"
					ref="gform"
				/>
			</view>

			<view class="aa">
				{{ JSON.stringify(formData) }}
			</view>

			<g-message />
			<view class="footer">
				<button
					@click="gform.submit"
					:class="{
						'btn-disabled': btnDisabled
					}"
					class="btn btn-primary"
				>
					保存
				</button>
			</view>
		</scroll-view>
	</view>
</template>

<script lang="ts" setup>
import { ref, nextTick, onMounted, computed } from 'vue';
import { FormKey, pickTempItem } from './utils';
import { GStores } from '@/utils';
import api from '@/service/api';

const props = defineProps<{
	patientName: 'string';
	medicalType: 'string';
	verify: 'string';
	defaultFalg: 'string';
	patientPhone: 'string';
}>();
const gStores = new GStores();
const gform = ref<any>('');
const formData = ref<BaseObject>({});

let formList = pickTempItem([
	FormKey.medicalType,
	FormKey.patientName,
	FormKey.patientPhone,
	FormKey.verify,
	FormKey.defaultFalg
]);

const formSubmit = async ({ data }) => {
	console.log('success', data);
};

const formChange = ({ item, value, oldValue }) => {
	if (item.key === FormKey.medicalType && oldValue !== value) {
		medicalTypeChange(value);
	}
};

/**
 *
 * @param value
 * 	-1  成人、儿童（有证件）
 * 	0  新生儿（无证件)
 *  1  军人
 *  2  军属
 */
const medicalTypeChange = (value: '-1' | '0' | '1' | '2') => {
	console.log(value, 'ssss');
	const listArr: FormKey[] = [FormKey.medicalType];

	switch (value) {
		case '-1':
			listArr.push(
				...[
					FormKey.patientName,
					FormKey.idType,
					FormKey.idCard,
					FormKey.nation,
					FormKey.patientPhone,
					FormKey.address,
					FormKey.location,
					FormKey.defaultFalg
				]
			);
			break;

		case '1':
			listArr.push(...[FormKey.defaultFalg]);
			break;

		default:
			break;
	}

	formList = pickTempItem(listArr);
	gform.value.setList(formList);
};

const btnDisabled = computed(() => {
	let isDisabled = false;
	const formKeys = formList.map((o) => o.key);
	Object.entries(formData.value).map(([key, value]) => {
		if (formKeys.includes(key) && value === '') {
			isDisabled = true;
		}
	});

	return isDisabled;
});

onMounted(() => {
	console.log('props----', props);

	formData.value = Object.fromEntries(
		Object.entries(props).map(([key, value]) => {
			if (key === FormKey.defaultFalg) {
				(value as any) = (value as unknown) === 'false' ? false : true;
			}
			return [key, value];
		})
	);
	nextTick(() => {
		// gform.value.setList(formList);
		medicalTypeChange('-1');
	});
});
</script>

<style lang="scss" scoped>
.scroll-container {
	height: 100vh;

	.form-container {
		margin-bottom: 100rpx;
	}
}

.footer {
	position: fixed;
	bottom: 0;
	right: 0;
	left: 0;
	background-color: var(--h-color-white);
	padding: 32rpx 32rpx 68rpx;
}
.aa {
	word-break: break-all;
}
</style>
