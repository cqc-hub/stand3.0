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

      <g-flag v-if="isOver" :typeFg="isWaitReg ? '1112' : '4'" isShowFgTip />
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
        v-if="isOver"
        v-model:title="flagTitle9"
        :typeFg="isWaitReg ? '1111' : '9'"
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
            {{ isWaitReg ? '《候补预约须知》' : '《预约挂号须知》' }}
          </text>
        </view>
      </view>

      <view class="flex1">
        <button class="btn btn-primary" @click="regConfirm">
          {{ isWaitReg ? '候补预约' : '确定预约' }}
        </button>
      </view>
    </view>

    <g-select
      v-model:value="selWaitRegSch"
      v-model:show="isShowSelWaitRegSch"
      :option="waitRegSchSecondResultList"
      :field="{
        label: 'ampmName',
        value: 'ampm',
      }"
      @change="resolve"
      @update:show="selClose"
      title="确认候补就诊时段"
      everyChoose
    />
    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';

  import { onLoad } from '@dcloudio/uni-app';

  import { IPageProps } from './utils/regConfirm';
  import { TSchInfo } from './utils/index';
  import {
    GStores,
    ServerStaticData,
    wait,
    apiAsync,
    ISystemConfig,
  } from '@/utils';
  import { deQueryForUrl, joinQueryForUrl } from '@/common/utils';
  import { getMyPowerQx } from '@/components/greenPower';
  import { getLocalStorage } from '@/common';
  import { useDeptStore } from '@/stores';

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
  const props = ref({} as IPageProps);
  const pageConfig = ref({} as ISystemConfig['order']);
  const deptStore = useDeptStore();

  const isCheck = ref(false);
  const isPreventOrder = ref(false);
  const preventOrderStr = ref('');
  const regDialogConfirm = ref<any>('');
  const flagTitle9 = ref('');
  const greenToastDuration = ref(1500);
  const contentTitle = ref('');
  const greenToastContent = ref('');
  const alipayPid = global.systemInfo.alipayPid;
  const waitRegSchSecondResultList = ref(<TSchInfo[]>[]);
  const selWaitRegSch = ref('');
  const isShowSelWaitRegSch = ref(false);
  const isOver = ref(false);
  const isOverLimit = ref('');

  // 候补挂号?
  const isWaitReg = computed(() => {
    return props.value.schState === '2';
  });

  const regConfirm = async () => {
    const { isOrderPay, wxOrderSubscribeMessage } = pageConfig.value;
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
      thRegisterId,
      regVerificationMode,
    } = props.value;
    const { herenId, patientId, realNameAuth, patientName } =
      gStores.userStore.patChoose;
    const { source } = gStores.globalStore.browser;

    if (!isCheck.value) {
      regDialogConfirm.value.show();
      return;
    }

    if (regVerificationMode === '2' && realNameAuth === '0') {
      const pages = getCurrentPages();
      const fullUrl: string = (pages[pages.length - 1] as any).$page.fullPath;

      gStores.messageStore.showMessage(
        `需要对就诊人${patientName}实名认证后才能继续预约改号源`,
        3000,
        {
          closeCallBack() {
            uni.navigateTo({
              url: joinQueryForUrl('/pagesA/medicalCardMan/medicalCardMan', {
                _url: fullUrl,
              }),
            });
          },
        }
      );

      return;
    }

    if (isWaitReg.value) {
      waitReg();
      return;
    }

    // #ifdef MP-WEIXIN
    if (wxOrderSubscribeMessage?.length) {
      // @ts-expect-error
      await apiAsync(uni.requestSubscribeMessage, {
        tmplIds: wxOrderSubscribeMessage,
      }).catch((e) => {
        console.error(e);
      });
    }
    // #endif

    // 预约类型：1.预约挂号，2.当日挂号
    const resType = (dayjs().format('YYYY-MM-DD') === schDate && '2') || '1';
    const [firstDept, secondDept] = deptStore.deptClickStep;

    const requestArg = {
      firstDeptName: firstDept?.deptName,
      firstHosDeptId: firstDept?.deptId,
      secondDeptName: secondDept?.deptName,
      secondHosDeptId: secondDept?.deptId,
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
      thRegisterId: thRegisterId || getLocalStorage('thRegisterId'),
      ageReminderCode: isOverLimit.value,
    };

    let alipayAuthCode = '';
    // #ifdef MP-ALIPAY
    if (alipayPid) {
      await getMyPowerQx()
        .then((qxRes: any) => {
          alipayAuthCode = qxRes.authCode;
        })
        .catch((e) => {});
    }
    // #endif

    let {
      result: { orderId, hasCharge, hint },
    } = await api.addReg(requestArg).catch(async (e) => {
      if (e) {
        const { respCode, message, code } = e;

        // 限制欠费用户预约挂号
        if (respCode === 999225) {
          gStores.messageStore.closeMessage();
          preventOrderStr.value = message;
          isPreventOrder.value = true;
        } else if (respCode === 999227) {
          //超限就诊提示
          OverlimiMessage(e);
        } else if (code !== 4000) {
          message && gStores.messageStore.showMessage(message, 3000);
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
                isOrderPay !== '1'
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
    if (hasCharge === '0') {
      const { confirm } = await apiAsync(uni.showModal, {
        content: hint,
        cancelText: '稍后缴费',
        confirmText: '立即缴费',
      });

      if (confirm) {
        goPay();

        throw new Error('去缴费');
      }
    } else if (hasCharge === '2') {
      await apiAsync(uni.showModal, {
        content: hint,
        confirmText: '确认',
        showCancel: false,
      });
    }

    deptStore.$patch({
      deptClickStep: [],
    });

    uni.navigateTo({
      url: joinQueryForUrl('/pagesA/MyRegistration/RegDetail', {
        orderId,
        preWz: '1',
        thRegisterId,
      }),
    });
  };

  const OverlimiMessage = async (e) => {
    const { respCode, message } = e;
    const { cancel } = await apiAsync(uni.showModal, {
      content: message,
      cancelText: '继续预约',
      confirmText: '暂不预约',
    });

    if (cancel) {
      isOverLimit.value = respCode;
      regConfirm();
    }
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

  const getWaitRegSch = async () => {
    const arg = {
      ...props.value,
      source: gStores.globalStore.browser.source,
    };

    const { result } = await api.getAlternateSch<{
      alternateData: string;
      alternateLevel: string;
      schDate: string;
      alternateNum: number;
      schSecondResultList: TSchInfo[];
    }>(arg);

    return result;
  };

  const selClose = () => {
    isShowSelWaitRegSch.value = false;
    reject();
  };

  let resolve: (...any) => any = () => {};
  let reject: (...any) => any = () => {};
  const waitReg = async () => {
    const { schSecondResultList, alternateData } = await getWaitRegSch();

    waitRegSchSecondResultList.value = schSecondResultList;

    if (schSecondResultList && schSecondResultList.length) {
      isShowSelWaitRegSch.value = true;

      await new Promise((r, j) => {
        resolve = r;
        reject = j;
      });

      const selSchItem = schSecondResultList.find(
        (o) => o.ampm === selWaitRegSch.value
      )!;

      selWaitRegSch.value = '';

      await api.addRegAlternate({
        ...props.value,
        ...selSchItem,
        alternateData,
        patientId: gStores.userStore.patChoose.patientId,
        source: gStores.globalStore.browser.source,
      });

      uni.reLaunch({
        url: '/pagesA/MyRegistration/MyRegistration?type=waitReg',
      });
    }
  };

  const getPageConfig = async () => {
    pageConfig.value = await ServerStaticData.getSystemConfig('order');
  };

  onLoad((p) => {
    props.value = deQueryForUrl<IPageProps>(deQueryForUrl(p));
    isOver.value = true;
    getPageConfig();
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
</style>
