<template>
  <view
    :class="{
      'system-mode-old': gStores.globalStore.modeOld,
    }"
    class="page"
  >
    <view class="container">
      <view class="container-view">
        <view class="container-view-card">
          <Reg-Confirm-Card
            :my-props="props"
            :systemModeOld="gStores.globalStore.modeOld"
          />
        </view>

        <view>
          <Reg-Confirm-ChoosePat />
        </view>
      </view>

      <g-flag typeFg="4" isShowFgTip />
      <!--  #ifdef MP-ALIPAY -->
      <template v-if="alipayPid">
        <Green-Power />
        <Green-Toast
          :contentTitle="contentTitle"
          :duration="greenToastDuration"
          v-model:content="greenToastContent"
        />
      </template>
      <!--  #endif -->
    </view>

    <Order-Reg-Confirm
      :title="flagTitle9"
      @confirm="isCheck = true"
      ref="regDialogConfirm"
    >
      <g-flag
        v-model:title="flagTitle9"
        typeFg="9"
        isShowFgTip
        isHideTitle
        aaa
      />
    </Order-Reg-Confirm>

    <xy-dialog
      :title="'提示'"
      :show="isPreventOrder"
      @confirmButton="goPay"
      @cancelButton="isPreventOrder = false"
      confirmText="去缴费"
    >
      <view class="reg-tip">
        <rich-text :nodes="HTMLParser(preventOrderStr)" />
      </view>
    </xy-dialog>

    <view class="g-footer flex-column">
      <view class="fg-agree">
        <view
          :class="{
            'is-check': isCheck,
          }"
          @click.stop="flagClick"
          class="iconfont check-box"
        >
          {{ (isCheck && '&#xe6d0;') || '&#xe6ce;' }}
        </view>

        <view class="fg-agree-text">
          <text @click.stop="flagClick">我已阅读并同意</text>
          <text @click.stop="regDialogConfirm.show" class="fg-agree-name">
            《预约挂号须知》
          </text>
        </view>
      </view>

      <view class="flex1">
        <button class="btn btn-primary" @click="regConfirm">确定预约</button>
      </view>
    </view>

    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';

  import { onLoad } from '@dcloudio/uni-app';

  import { IPageProps } from './utils/regConfirm';
  import { GStores, ServerStaticData, wait } from '@/utils';
  import { deQueryForUrl, joinQueryForUrl } from '@/common/utils';
  import { getMyPowerQx } from '@/components/greenPower';

  import api from '@/service/api';
  import dayjs from 'dayjs';
  import global from '@/config/global';
  import HTMLParser from '@/common/html-parser';

  import OrderRegConfirm from '@/components/orderRegConfirm/orderRegConfirm.vue';
  import RegConfirmCard from './components/RegConfirmCard/RegConfirmCard.vue';
  import RegConfirmChoosePat from './components/RegConfirmChoosePat/RegConfirmChoosePat.vue';
  import GreenPower from '@/components/greenPower/greenPower.vue';
  import GreenToast from '@/components/greenPower/greenToast.vue';

  const gStores = new GStores();
  const props = ref<IPageProps>({} as IPageProps);
  const isCheck = ref(false);
  const isPreventOrder = ref(false);
  const preventOrderStr = ref('');
  const regDialogConfirm = ref<any>('');
  const flagTitle9 = ref('');
  const greenToastDuration = ref(1500);
  const contentTitle = ref('');
  const greenToastContent = ref(0);
  const alipayPid = global.systemInfo.alipayPid;

  const regConfirm = async () => {
    if (!isCheck.value) {
      regDialogConfirm.value.show();
      return;
    }

    /**
     * 未填写参数
     *
     * aliRegisterId
     * diseaseId
     * promptMessage
     * thRegisterId
     * timePoint
     * visitingArea
     */

    const {
      ampm,
      categor,
      categorName,
      deptName,
      disNo,
      docName,
      fee,
      hosDeptId,
      hosDocId,
      hosId,
      numId,
      schDate,
      schId,
      schQukCategor,
      timeDesc,
      clinicalType,
      promptMessage,
      docTitleName,
      thRegisterId
    } = props.value;
    const { herenId, patientId } = gStores.userStore.patChoose;
    const { source } = gStores.globalStore.browser;
    // 预约类型：1.预约挂号，2.当日挂号
    const resType = (dayjs().format('YYYY-MM-DD') === schDate && '2') || '1';

    const requestArg = {
      ampm,
      categor,
      categorName,
      clinicalType: clinicalType === 'null' ? '1' : clinicalType || '1',
      deptName,
      disNo,
      docTitleName,
      docName,
      fee,
      hosDeptId,
      hosDocId,
      hosId,
      numId,
      schDate,
      schId,
      schQukCategor,
      timeDesc,
      herenId,
      patientId,
      source,
      resType,
      promptMessage,
    };

    let alipayAuthCode = '';
    // #ifdef MP-ALIPAY
    if (alipayPid) {
      await getMyPowerQx()
        .then((qxRes: any) => {
          alipayAuthCode = qxRes.authCode;
        })
        .catch(() => {});
    }
    // #endif

    const {
      result: { orderId },
    } = await api.addReg(requestArg).catch((e) => {
      if (e) {
        const { respCode, message } = e;

        // 限制欠费用户预约挂号
        if (respCode === 999225) {
          gStores.messageStore.closeMessage();
          preventOrderStr.value = message;
          isPreventOrder.value = true;
        } else {
          gStores.messageStore.showMessage(message || '挂号异常', 3000);
        }
      }
      throw new Error(e);
    });

    // #ifdef MP-ALIPAY
    if (alipayPid) {
      //有埋点的情况
      if (alipayAuthCode) {
        await api
          .energySendReg({
            orderId,
            scene: 'horegister', // 挂号 horegister
            userId: gStores.globalStore.openId,
          })
          .then(async ({ result }) => {
            // result.totalEnergy
            if (result && result.totalEnergy && result.totalEnergy != 0) {
              contentTitle.value =
                (await ServerStaticData.getSystemConfig('order')).isOrderPay !==
                '1'
                  ? '本次预约得绿色能量'
                  : '本次挂号得绿色能量';
              greenToastContent.value = result.totalEnergy;
              await wait(greenToastDuration.value);
            }
          })
          .catch(async () => {
            await wait(1000);
          });
      }
    }
    // #endif

    uni.navigateTo({
      url: joinQueryForUrl('/pagesA/MyRegistration/RegDetail', {
        orderId,
        preWz: '1',
        thRegisterId
      }),
    });
  };

  const goPay = () => {
    isPreventOrder.value = false;
    uni.reLaunch({
      url: '/pagesA/clinicPay/clinicPayDetail',
    });
  };

  const flagClick = () => {
    if (isCheck.value) {
      isCheck.value = false;
    } else {
      regDialogConfirm.value.show();
    }
  };

  onLoad((p) => {
    props.value = deQueryForUrl<IPageProps>(deQueryForUrl(p));
    console.log(props.value, 'props.value');
  });
</script>

<style lang="scss" scoped>
  .page {
    height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .container {
    height: 1px;
    flex: 1;
    overflow-y: scroll;

    .container-view {
      padding: 0 32rpx;

      .container-view-card {
        padding-top: 24rpx;
        padding-bottom: 16rpx;
      }
    }
  }

  .fg-agree {
    display: flex;
    font-size: var(--hr-font-size-xs);
    align-items: flex-start;

    .fg-agree-name {
      color: var(--hr-brand-color-6);
    }

    .check-box {
      color: var(--hr-neutral-color-7);
      font-size: var(--h-size-40);
      margin-right: 4rpx;
      transform: translateY(-5rpx);

      &.is-check {
        color: var(--hr-brand-color-6);
      }
    }
  }

  .system-mode-old {
    .check-box {
      font-size: 48rpx;
    }
  }

  .reg-tip {
    max-height: 550rpx;
    width: calc(100% - 64rpx);
    margin-left: 32rpx;
  }
</style>
