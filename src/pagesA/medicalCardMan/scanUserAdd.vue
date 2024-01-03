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
          <view v-if="item.key === 'cardNumber'">
            <text @click="toScan" class="ico_my_scon icon-font" />
          </view>
        </template>
      </g-form>

      <g-flag typeFg="51" isShowFgTip />
    </view>

    <g-message />
    <Sel-Card-Dialog
      v-model:show="dialogSelCardShow"
      :activeCardNumber="activeCardSelCardNumber"
      :list="cardPatList"
      @item-click="selCardPat"
      @confirm="chooseCard"
      @mask-close="dialogMaskClose"
    />

    <view class="g-footer">
      <button @click="gform.submit" class="btn btn-primary flex1">确定</button>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import type { TInstance } from '@/components/g-form/index';
  import { TCardPat } from './utils';
  import {
    GStores,
    apiAsync,
    getH5OpenidParam,
    PatientUtils,
    wait,
  } from '@/utils';

  import api from '@/service/api';

  import SelCardDialog from './components/SelCardDialog.vue';

  const gStores = new GStores();
  const dialogSelCardShow = ref(false);
  const activeCardSelCardNumber = ref('');
  const cardPatList = ref(<TCardPat[]>[]);

  const formData = ref({
    patientName: '',
    cardNumber: '',
    // patientName: '雷炳源',
    // cardNumber: '806212374',
  });
  const gform = ref<any>('');
  const tempList = ref<TInstance[]>([
    {
      required: true,
      label: '患者姓名',
      placeholder: '请选择',
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
      key: 'cardNumber',
      label: '院内id',
      placeholder: '扫码添加',
      disabled: true,
      required: true,
    },
  ]);

  const selCardPat = (pat: TCardPat) => {
    activeCardSelCardNumber.value = pat.cardNumber;
  };

  let dialogConfirm = () => {};
  let dialogMaskClose = () => {};
  const chooseCard = (cardNumber: string) => {
    if (!cardNumber) {
      gStores.messageStore.showMessage('请选择就诊卡', 3000);
      return;
    }

    dialogSelCardShow.value = false;
    dialogConfirm();
  };

  let isLoading = false;
  const formSubmit = async ({ data }) => {
    if (!isLoading) {
      isLoading = true;
    } else {
      return;
    }

    try {
      const { source } = gStores.globalStore.browser;
      const { result } = await api.getPatByHosPatId({
        ...data,
        source,
      });

      if (result) {
        await new Promise((r, j) => {
          dialogSelCardShow.value = true;
          cardPatList.value = [result];
          dialogConfirm = () => {
            r(void 0);
          };

          dialogMaskClose = j;
        });

        const reqData = {
          ...result,
          source,
        };

        getH5OpenidParam(reqData);
        let invokeApi = api.perfectPatByHosPatId;
        if (gStores.globalStore.herenId) {
          invokeApi = api.addPatByHosPatId;
        }

        const {
          result: { patientId, accessToken },
        } = await invokeApi(reqData);

        if (accessToken) {
          // 完善流程后 token 会过期 重新取接口返回
          gStores.globalStore.updateToken({
            accessToken,
            refreshToken: gStores.globalStore.token.refreshToken,
          });
        }
        await wait(20);
        await new PatientUtils().getPatCardList();

        const newPat = gStores.userStore.patList.find(
          (o) => o.patientId === patientId
        )!;

        gStores.userStore.updatePatChoose(newPat);

        gStores.messageStore.showMessage('新增就诊人成功', 3000, {
          closeCallBack() {
            uni.reLaunch({
              url: '/pagesA/hospitalCare/hospitalCare',
            });
          },
        });
      }
    } catch (error) {
      throw new Error(error as any);
    } finally {
      isLoading = false;
    }
  };

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
      formData.value.cardNumber = result;
    } else {
      gStores.messageStore.showMessage('扫码获取内容失败', 3000);
    }
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
