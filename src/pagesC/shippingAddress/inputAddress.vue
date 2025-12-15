<template>
  <view
    :class="{
      [gStores.globalStore.getPageClass]: true,
    }"
  >
    <view class="container">
      <g-form
        v-model:value="formData"
        :showRequireIcon="true"
        @submit="formSubmit"
        @address-change="addressChange"
        bodyBold
        ref="gform"
      >
        <!-- #ifdef MP-WEIXIN -->
        <template #suffix="{ item }">
          <view v-if="item.key == 'detailedAddress'" @click="getCurrentAdd">
            <view class="icon-font icon-resize ico_location2"></view>
          </view>
        </template>
        <!-- #endif -->
      </g-form>
    </view>
    <g-flag class="tip" typeFg="62" isShowFgTip />

    <g-message />
    <view class="footer">
      <button
        @click="gform.submit"
        :class="{
          'btn-disabled': btnDisabled,
        }"
        class="btn btn-primary"
      >
        确认
      </button>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { ref, onMounted, computed } from 'vue';
  import { GStores, wait } from '@/utils';
  import { onLoad } from '@dcloudio/uni-app';
  import { useCacheStore } from '@/stores';
  import api from '@/service/api';
  import { deQueryForUrl } from '@/common';
  import { rulePhone } from '@/utils/modules/verify';
  const cacheStore = useCacheStore();

  // const props = withDefaults(
  //   defineProps<{
  //     pageType: 'edit' | 'add' | 'editPatient';
  //     item: string;
  //   }>(),
  //   {
  //     pageType: 'add',
  //   }
  // );

  const props = ref(<
    {
      pageType: 'edit' | 'add' | 'editPatient';
      item: string;
    }
  >{
    pageType: 'add',
  });
  const gStores = new GStores();
  const gform = ref<any>('');
  const formData = ref<BaseObject>({
    senderName: '',
    senderPhone: '',
    address: '',
    detailedAddress: '',
    postcode: '',
  });

  const formList = [
    {
      required: true,
      maxlength: 50,
      label: '收货人',
      field: 'input-text',
      placeholder: '请输入收货人姓名',
      key: 'senderName',
      emptyMessage: '请填写收货人姓名',
    },
    {
      required: true,
      maxlength: 11,
      label: '手机号码',
      field: 'input-text',
      placeholder: '请输入收货人手机号码',
      key: 'senderPhone',
      emptyMessage: '请填写手机号',
      inputType: 'number',
      rule: [
        {
          message: '请填写正确的手机号',
          rule: rulePhone,
        },
      ],
    },
    {
      required: true,
      showSuffixArrowIcon: true,
      label: '所在地区',
      placeholder: '请选择',
      key: 'address',
      emptyMessage: '请选择所在地区',
      field: 'address',
    },

    {
      required: true,
      // maxlength: 200,
      label: '详细地址',
      field: 'input-text',
      inputType: 'textarea',
      autoHeight: true,
      placeholder: '请输入街道、小区、门牌号等',
      key: 'detailedAddress',
      emptyMessage: '请输入街道、小区、门牌号等',
      rowStyle: 'border-radius: 0 0 16rpx 16rpx;',
      validator: async (v: any) => {
        if (v && v.length > 7) {
          return {
            success: true,
          };
        } else {
          return {
            message: '详细地址至少输入7个字及以上',
            success: false,
          };
        }
      },
    },
    {
      required: false,
      maxlength: 6,
      label: '邮政编码',
      field: 'input-text',
      inputType: 'number',
      placeholder: '请输入邮政编码',
      key: 'postcode',
    },
  ];

  const addressChange = (e) => {
    const { value } = e;
    const [addressProvince, addressCity, addressCounty] = value;
    formData.value.province = addressProvince.text;
    formData.value.city = addressCity.text;
    formData.value.county = addressCounty.text;
  };

  //获取当前位置
  const getCurrentAdd = async () => {
    uni.chooseLocation({
      success(res) {
        getAddress(res);
      },
      // fail(res) {
      // },
    });
  };
  //获取拆分后的地址

  const getAddress = async (data) => {
    const { result } = await api.getAddress({
      addressName: data.name,
      allAddress: data.address,
    });
    formData.value.detailedAddress = result.detailedAddress;
    formData.value.address = result.province + result.city + result.county;
    formData.value.province = result.province;
    formData.value.city = result.city;
    formData.value.county = result.county;
  };

  const formSubmit = async () => {
    cacheStore.changeCacheData({
      ...formData.value,
    });

    uni.setStorage({
      data: '2',
      key: 'back-address',
    });

    uni.navigateBack({
      delta: 1,
    });
  };

  const btnDisabled = computed(() => {
    let isDisabled = false;
    const formKeys = formList.map((o) => o.key);
    Object.entries(formData.value).map(([key, value]) => {
      if (formKeys.includes(key) && value === '' && key !== 'postcode') {
        isDisabled = true;
      }
    });
    return isDisabled;
  });

  onLoad((opt) => {
    props.value = deQueryForUrl(deQueryForUrl(opt));
  });

  onMounted(async () => {
    await wait(20);
    gform.value.setList(formList);
  });
</script>

<style lang="scss" scoped>
  .icon-resize {
    height: 48rpx;
    width: 48rpx;
    // color: var(--hr-brand-color-6);
  }
  .footer {
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    background-color: var(--h-color-white);
    padding: 32rpx 32rpx 68rpx;
    button {
      &:first-child {
        margin-bottom: 24rpx;
      }
    }
  }
  // :deep(textarea) {
  //   min-height: 90rpx !important;
  //   height: 90rpx !important;
  // }
</style>
