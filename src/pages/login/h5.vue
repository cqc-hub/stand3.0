<template>
  <view class="g-page">
    <view class="container">
      <view class="header flex-normal flex-column">
        <image :src="hosLogo" class="hos-logo" />
        <text class="color-333 f28">{{ $global.systemConfig.name }}</text>
      </view>

      <view>
        <g-form
          v-model:value="formData"
          @submit="formSubmit"
          bodyBold
          ref="gform"
        />

        <view class="p32c mt70">
          <button @click="gform.submit" class="btn btn-primary btn-round">
            登录
          </button>
        </view>
      </view>
    </view>
    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';
  import { ServerStaticData, GStores, packageAuthParams } from '@/utils';
  import { joinQuery, getSysCode } from '@/common';

  import api from '@/service/api';

  const envH5 = ref<'browse' | 'wx'>('browse');
  const hosLogo = ref('');
  const gStores = new GStores();
  const formData = ref<BaseObject>({});
  const gform = ref<any>('');
  const formList = [
    {
      required: true,
      label: '',
      labelWidth: '0',
      field: 'input-text',
      placeholder: '请输入手机号',
      maxlength: 11,
      key: 'phone',
      rule: [
        {
          message: '请确认手机号是否有误',
          rule: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
        },
      ],
    },

    {
      required: true,
      maxlength: 6,
      label: '',
      labelWidth: '0',
      field: 'input-verify',
      placeholder: '请输入',
      key: 'verifyCode',
      verifyBtnText: '获取验证码',
      inputType: 'number',
      verifySecond: 60,
      rule: {
        message: '验证码必须是数字',
        rule: /\d+/,
      },
      phoneKey: 'phone',
      async submitVerify(cellPhoneNum: string) {
        const reqArg = {
          cellPhoneNum,
          type: '6',
          sysCode: getSysCode(),
        };

        api.allinoneAuthApi(
          packageAuthParams(
            {},
            joinQuery('/register/sendVerificationCode', reqArg)
          )
        );
      },
    },
  ];

  const formSubmit = async () => {};

  const getHosLogo = async () => {
    hosLogo.value = (await ServerStaticData.getHosList())[0]?.hosLogo || '';
  };

  onLoad(() => {
    getHosLogo();
    // #ifdef H5
    const _ua = navigator.userAgent.toLowerCase();
    const isWeixin = _ua.indexOf('micromessenger') !== -1;

    if (isWeixin) {
      envH5.value = 'wx';
    }
    // #endif
  });

  onMounted(() => {
    gform.value.setList(formList);
  });
</script>

<style lang="scss" scoped>
  .g-page {
    background-color: #fff;
  }

  .header {
    position: relative;
    padding: 70rpx 0;
  }

  .hos-logo {
    width: 240rpx;
    height: 240rpx;
  }

  .btn-round {
    border-radius: 140px;
  }
</style>
