<template>
  <view
    :class="{
      [gStores.globalStore.getPageClass]: true,
    }"
    class="page"
  >
    <g-flag isShowFg typeFg="1276" />
    <view class="container" scroll-y>
      <view class="form-container">
        <g-form
          v-model:value="formData"
          @submit="formSubmit"
          :show-require-icon="false"
          bodyBold
          ref="gform"
        />
      </view>
    </view>
    <view class="g-footer">
      <button @click="gform.submit" class="btn btn-primary flex1">确认捐款</button>
    </view>
    <g-message />
  </view>
</template>
<script lang="ts" setup>
  import { computed, onMounted, ref, nextTick } from 'vue';

  import { onLoad } from '@dcloudio/uni-app';
  import {
    GStores,
    idValidator,
    ISystemConfig,
    PatientUtils,
    routerJump,
    rulePhone,
    ruleAmountStrict,
  } from '@/utils';
  import api from '@/service/api';
  import { payMoneyOnline, toPayPull } from '@/components/g-pay/index';
  import { deQueryForUrl } from '@/common';

  const gStores = new GStores();
  const formData = ref({});
  const gform = ref<any>('');
  const formList = [
    {
      required: true,
      label: '捐款人姓名',
      field: 'input-text',
      placeholder: '请输入捐款人姓名',
      key: 'contribName',
      labelWidth: '220rpx',
      maxlength: 50,
    },
    {
      required: true,
      label: '联系人电话',
      field: 'input-text',
      placeholder: '请输入联系人电话',
      key: 'phone',
      labelWidth: '220rpx',
      maxlength: 11,
      rule: [
        {
          message: '请确认手机号是否有误',
          rule: rulePhone,
        },
      ],
    },
    {
      required: true,
      label: '所属科室',
      field: 'input-text',
      placeholder: '请输入所属科室',
      key: 'deptName',
      labelWidth: '220rpx',
      maxlength: 50,
    },
    {
      rowStyle: 'margin-top: 16rpx;',
      label: '捐款金额',
      field: 'input-text',
      required: true,
      placeholder: '请输入捐款金额',
      key: 'fee',
      labelWidth: '220rpx',
      maxlength: 10,
      rule: [
        {
          message: '请确认正确的整数捐款金额',
          rule: ruleAmountStrict,
        },
      ],
    },
  ];

  onLoad(() => {
    nextTick(() => {
      gform.value.setList(formList);
    });
  });

  const formSubmit = async ({ data }) => {
    let payType = 'WX_MINI';
    // #ifdef MP-ALIPAY
    payType = 'ALI_MINI';
    // #endif
    console.log('formSubmit', data);
    const { source } = gStores.globalStore.browser;
    const requestData = {
      ...data,
      payType,
      source,
    };
    if (gStores.globalStore.sysCode === '1001083') {
      requestData.hosId = '13140';
      requestData.hosName = '温州市人民医院';
    }
    const {
      result: { paySign, phsOrderNo },
    } = await api.addContribOrder(requestData);
    const { hosId, hosName, contribName: patientName } = requestData;

    const payRes = await payMoneyOnline({
      paySign,
      phsOrderNo,
      totalFee: requestData.fee,
      source,
      phsOrderSource: 15,
      hosId: hosId,
      patientName,
      cardNumber:''
    });
    await toPayPull(payRes);
    gStores.messageStore.showMessage('捐款成功，感谢您的爱心奉献！')
    // console.log('result', result);
  };
</script>
<style lang="scss" scoped>
  .g-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
  }
</style>
