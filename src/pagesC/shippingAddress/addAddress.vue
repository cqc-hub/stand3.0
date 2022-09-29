<template>
  <view>
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
            <view class="iconfont icon-resize">&#xe6b6;</view>
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
          'btn-disabled': btnDisabled
        }"
        class="btn btn-primary"
      >
        保存
      </button>
      <button
        v-if="props.pageType === 'edit'"
        @click="
          () => {
            showDialog = true;
          }
        "
        class="btn btn-border btn-normal"
      >
        删除收货地址
      </button>
    </view>
    <xy-dialog
      content="您确定要删除所选地址吗？"
      :show="showDialog"
      @cancelButton="
        () => {
          showDialog = false;
        }
      "
      @confirmButton="deleteAddress"
    ></xy-dialog>
  </view>
</template>

<script lang="ts" setup>
  import { ref, onMounted, computed, withDefaults } from 'vue';
  import { GStores } from '@/utils';
  import { onReady } from '@dcloudio/uni-app';
  import { useMessageStore } from '@/stores';
  import api from '@/service/api';
  const messageStore = useMessageStore();

  const props = withDefaults(
    defineProps<{
      pageType: 'edit' | 'add' | 'editPatient';
      item: string;
    }>(),
    {
      pageType: 'add'
    }
  );
  const gStores = new GStores();
  const gform = ref<any>('');
  const formData = ref<BaseObject>({
    senderName: '',
    senderPhone: '',
    address: '',
    detailedAddress: '',
    postcode: '',
    defaultFlag: false
  });

  const formList = [
    {
      required: true,
      maxlength: 50,
      label: '收货人',
      field: 'input-text',
      placeholder: '请输入收货人姓名',
      key: 'senderName',
      emptyMessage: '请填写收货人姓名'
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
          rule: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
        }
      ]
    },
    {
      required: true,
      showSuffixArrowIcon: true,
      label: '所在地区',
      placeholder: '请选择',
      key: 'address',
      emptyMessage: '请选择所在地区',
      field: 'address'
    },

    {
      required: true,
      // maxlength: 200,
      label: '详细地址',
      field: 'input-text',
      inputType: 'textarea',
      autoHeight: true,
      placeholder: '请输入详细地址',
      key: 'detailedAddress',
      emptyMessage: '请填写详细地址',
      rowStyle: 'border-radius: 0 0 16rpx 16rpx;'
    },
    {
      required: false,
      maxlength: 6,
      label: '邮政编码',
      field: 'input-text',
      inputType: 'number',
      placeholder: '请输入邮政编码',
      key: 'postcode'
    },
    {
      field: 'switch',
      key: 'defaultFlag',
      label: '设为默认地址',
      labelWidth: '260rpx',
      rowStyle: 'margin-top: 16rpx; border-radius: 16rpx;'
    }
  ];
  const showDialog = ref(false);

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
      fail(res) {
        console.log(3333, res);
      }
    });
  };
  //获取拆分后的地址

  const getAddress = async (data) => {
    const { result } = await api.getAddress({
      addressName: data.name,
      allAddress: data.address
    });
    formData.value.detailedAddress = result.detailedAddress;
    formData.value.address = result.province + result.city + result.county;
    formData.value.province = result.province;
    formData.value.city = result.city;
    formData.value.county = result.county;
  };

  const deleteAddress = async () => {
    const item = JSON.parse(props.item);
    await api.delExpressAddress({
      herenId: gStores.globalStore.herenId,
      id: item.id
    });
    messageStore.showMessage('删除成功', 1000, {
      closeCallBack: () => {
        uni.navigateBack({ delta: 1 });
      }
    });
  };

  const formSubmit = async ({ data }) => {
    const params = {
      herenId: gStores.globalStore.herenId,
      ...data,
      defaultFlag: data.defaultFlag ? 1 : 0
    };
    delete params.address;
    let title = '地址保存成功';
    if (props.pageType == 'edit') {
      title = '地址修改成功';
      await api.updateExpressAddress(params);
    } else {
      await api.addExpressAddress(params);
    }

    messageStore.showMessage(title, 1000, {
      closeCallBack: () => {
        uni.navigateBack({ delta: props.pageType === 'editPatient' ? 2 : 1 });
      }
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

  onReady(() => {
    if (props.pageType === 'edit') {
      uni.setNavigationBarTitle({
        title: '编辑收货地址'
      });
    }
  });

  onMounted(() => {
    if (props.pageType !== 'add') {
      const item = JSON.parse(props.item);

      formData.value = {
        ...item,
        defaultFlag: item.defaultFlag === 0 ? false : true
      };
    }
    gform.value.setList(formList);
  });
</script>

<style lang="scss" scoped>
  .icon-resize {
    font-size: 48rpx;
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
  :deep(textarea) {
    min-height: 90rpx !important;
    height: 90rpx !important;
  }
</style>
