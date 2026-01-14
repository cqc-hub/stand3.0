<template>
  <view
    :class="{
      [gStores.globalStore.getPageClass]: true,
    }"
    class="page"
  >
    <g-flag isShowFg typeFg="1284" />
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
    <view class="p24">
      <button @click="gform.submit" class="btn btn-primary flex1">
        缴费查询
      </button>
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
  import {
    aliPayOldSystemPayType,
    payMoneyOnline,
    toPayPull,
  } from '@/components/g-pay/index';
  import { deQueryForUrl } from '@/common';

  const gStores = new GStores();
  const formData = ref({});
  const gform = ref<any>('');
  const formList = [
    {
      required: true,
      label: '姓名',
      field: 'input-text',
      placeholder: '请输入姓名',
      key: 'name',
      labelWidth: '220rpx',
      maxlength: 50,
      validator(value) {
        const v = <string>value;

        if (v) {
          if (v.length < 2) {
            return Promise.resolve({
              success: false,
              message: '姓名需要大于2个字符',
            });
          }
          if (/^\s*$/.test(v)) {
            return Promise.resolve({
              success: false,
              message: '姓名不能由空格组成',
            });
          }
          const isEng = v.match(/^[A-Za-z]+\s?[A-Za-z]+$/);

          if (isEng) {
            return Promise.resolve({
              success: true,
            });
          } else {
            if (v.length > 50) {
              return Promise.resolve({
                success: false,
                message: '姓名不能大于 50 个字符',
              });
            }
          }
        }

        return Promise.resolve({
          success: true,
        });
      },
    },
    {
      required: true,
      label: '考生号',
      field: 'input-text',
      placeholder: '请输入考生号',
      key: 'examineeNumber',
      labelWidth: '220rpx',
      maxlength: 50,
      validator(value) {
        const v = <string>value;
        if (v) {
          if (v.length < 1) {
            return Promise.resolve({
              success: false,
              message: '考生号需要大于1个字符',
            });
          }
          if (/^\s*$/.test(v)) {
            return Promise.resolve({
              success: false,
              message: '考生号不能由空格组成',
            });
          }
        }
        return Promise.resolve({
          success: true,
        });
      },
    },
  ];

  onLoad(() => {
    nextTick(() => {
      gform.value.setList(formList);
    });
  });
  const formSubmit = async ({ data }) => {
    const {
      result: { examineeNumber, fee, hosId, name, payState, payTime },
    } = await api.getExamPayResult(data);
    if (payState == '0') {
      gStores.messageStore.showMessage(`您已缴费,缴费时间：${payTime}`, 3000, {
        closeCallBack: () => {
          formData.value = {};
        },
      });
    } else {
      pay({
        examineeNumber,
        fee,
        hosId,
        name,
      });
    }
  };

  const pay = async (data) => {
    console.log('formSubmit', data);
    const { source } = gStores.globalStore.browser;
    const requestData = {
      ...data,
      payType: aliPayOldSystemPayType(),
      source,
    };

    const {
      result: { paySign, phsOrderNo },
    } = await api.addExamOrder(requestData);
    const { hosId, hosName, contribName: patientName } = requestData;

    const payRes = await payMoneyOnline({
      paySign,
      phsOrderNo,
      totalFee: requestData.fee,
      source,
      phsOrderSource: 16,
      hosId: hosId,
      patientName,
      cardNumber: '',
    });
    await toPayPull(payRes);
    gStores.messageStore.showMessage('缴费成功', 3000, {
      closeCallBack: () => {
        formData.value = {};
      },
    });
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
