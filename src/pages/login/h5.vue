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
  import { ref, onMounted, computed } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';
  import { joinQueryForUrl } from '@/common';
  import { useGlobalStore, useUserStore } from '@/stores';
  import {
    ServerStaticData,
    GStores,
    packageAuthParams,
    LoginUtils,
    routerJump,
  } from '@/utils';
  import { joinQuery, getSysCode } from '@/common';

  import api from '@/service/api';

  // https://health.eheren.com/taizhou_pc/#/taizhou_pc/user/login

const props = defineProps({
  isOpenPassword: {
    type: String,
    default: '',
  },
});
  const hosLogo = ref('');
  const gStores = new GStores();
  const loginUtils = new LoginUtils();
  const formData = ref<BaseObject>({});
  const gform = ref<any>('');
  const envH5 = computed(() => gStores.globalStore.envH5);
  let isSendedVerify = false;
  const formList = ref([
    {
      required: true,
      emptyMessage: '请输入手机号',
      label: '',
      labelWidth: '0',
      field: 'input-text',
      placeholder: '请输入手机号',
      maxlength: 11,
      key: 'cellPhoneNum',
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
      emptyMessage: '请输入验证码',
      labelWidth: '0',
      field: 'input-verify',
      placeholder: '请输入验证码',
      key: 'code',
      verifyBtnText: '获取验证码',
      inputType: 'number',
      verifySecond: 60,
      rule: {
        message: '验证码必须是数字',
        rule: /\d+/,
      },
      phoneKey: 'cellPhoneNum',
      async submitVerify(cellPhoneNum: string) {
        const reqArg = {
          cellPhoneNum,
          type: '6',
          sysCode: getSysCode(),
        };
        isSendedVerify = true;

        await api.allinoneAuthApi(
          packageAuthParams(reqArg, '/register/sendVerifCode')
        );
      },
    },
    {
      required: true,
      emptyMessage: '请输入密码',
      label: '',
      labelWidth: '0',
      field: 'input-text',
      placeholder: '请输入密码',
      maxlength: 20,
      inputType: 'password',
      key: 'password',
      rule: [
        {
          message: '密码必须包含大小写字母和数字组成',
          rule: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        },
      ],
    }
  ]);

  const formSubmit = async ({ data }) => {
    const userStore = useUserStore();
    let resultResponst;
    //登录之前清除缓存
    useGlobalStore().clearStore();
    useUserStore().clearStore();
    if(props.isOpenPassword === '1'){
    const reqArg = {
      loginName:data.cellPhoneNum,
      password:data.password,
      sysCode: getSysCode(),
    };
    const payload = {
      isOutArgs:true
    }
    const requestUrl = joinQueryForUrl('/login/usePasswordLogin',reqArg)
    const { result } = await api.allinoneAuthApi(
      packageAuthParams(reqArg,requestUrl , payload)
    );
    resultResponst = result
    }else{
      if (!isSendedVerify) {
      gStores.messageStore.showMessage('请先获取验证码', 2000);
      return;
    }
    const reqArg = {
      ...data,
      sysCode: getSysCode(),
      accountType: '5',
    };

    const { result } = await api.allinoneAuthApi(
      packageAuthParams(reqArg, '/login/registerAndLogin')
    );
    resultResponst = result
    }

    const { accessToken, refreshToken } = resultResponst;

    gStores.globalStore.setToken({
      accessToken,
      refreshToken,
    });
    await loginUtils.getUerInfo();
    routerJump('/pages/home/home');
  };

  const getHosLogo = async () => {
    hosLogo.value = (await ServerStaticData.getHosList())[0]?.hosLogo || '';
  };

  onLoad(() => {
    getHosLogo();
  });

  onMounted(() => {
    if(props.isOpenPassword === '1'){
      formList.value.splice(1, 1);
    }else{
      formList.value.pop();
    }
    gform.value.setList(formList.value);
  });

  var coinChange = function (penny: any[], num: number) {
    if (!num) return num;
    const result = Array.from<number>({ length: num });
    for (let i = 1; i <= num; i++) {
      const minnum = Math.min(
        ...penny
          .filter((item: number) => i >= item) // 小于计算数的硬币不用计算过滤掉
          .map((item: number) => 1 + (result[i - item] || 0))
      );
      result[i] = minnum;
    }

    console.log(result);

    const _result = result.pop();
    return _result === Infinity ? -1 : _result;
  };

  console.log('res', coinChange([1, 5, 11], 14));
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
