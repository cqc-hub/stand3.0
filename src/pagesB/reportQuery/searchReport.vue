<template>
  <view class="g-page">
    <view class="g-container" scroll-y>
      <g-form
        v-model:value="formData"
        @submit="formSubmit"
        bodyBold
        ref="gform"
      >
        <template #suffix="{ item }">
          <view v-if="item.key === 'repId'">
            <text @click="toScan" class="ico_my_scon icon-font" />
          </view>
        </template>
      </g-form>

      <!-- <g-flag typeFg="592" isShowFgTip /> -->
    </view>

    <g-message />

    <view class="g-footer">
      <button @click="gform.submit" class="btn btn-primary flex1">确定</button>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import type { TInstance } from '@/components/g-form/index';
  import {
    GStores,
    apiAsync,
    getH5OpenidParam,
    PatientUtils,
    wait,
  } from '@/utils';

  import api from '@/service/api';

  const gStores = new GStores();
  const formData = ref({
    patientName: '徐佳瑶',
    repId: '4053211100',
  });
  const gform = ref<any>('');
  const tempList = ref<TInstance[]>([
    {
      required: true,
      label: '患者姓名',
      placeholder: '请输入患者姓名',
      key: 'patientName',
      field: 'input-text',
      maxlength: 50,
      validator(value) {
        const v = <string>value;

        if (v) {
          if (v.length < 2) {
            return Promise.resolve({
              success: false,
              message: '真实姓名需要大于2个字符',
            });
          }
          const isEng = v.match(/^[A-Za-z]+\s?[A-Za-z]+$/);

          if (isEng) {
            return Promise.resolve({
              success: true,
            });
          } else {
            if (v.length > 20) {
              return Promise.resolve({
                success: false,
                message: '真实姓名不能大于 20 个字符',
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
      field: 'input-text',
      key: 'repId',
      label: '检验单号',
      placeholder: '扫码或输入添加检验单号',
      // disabled: true,
      required: true,
    },
  ]);

  const toScan = async () => {
    let isH5 = false;
    // #ifdef H5
    isH5 = true;
    // #endif

    if (isH5) {
      gStores.messageStore.showMessage('暂不支持h5 扫码', 3000);
      return;
    }

    const { result } = await apiAsync(uni.scanCode, {
      scanType: ['barCode', 'qrCode'],
    });

    if (result && typeof result === 'string') {
      formData.value.repId = result;
    } else {
      gStores.messageStore.showMessage('扫码获取内容失败', 3000);
    }
  };

  const formSubmit = async ({ data }) => {
    const { result } = await api.getCheckoutReportInfo({
      ...data,
    });
    result.patientName = data.patientName;
    gStores.globalStore.assignCacheData(result);

    uni.navigateTo({
      url: '/pagesB/reportQuery/InspectionDetails?useCacheData=1',
    });
  };

  onMounted(() => {
    gform.value.setList(tempList.value);
  });
</script>

<style lang="scss" scoped>
  .g-page {
    background-color: #fff;
  }

  .ico_my_scon {
    width: 55rpx;
    height: 55rpx;
  }
</style>
