<template>
  <view
    :class="{
      'system-mode-old': gStores.globalStore.modeOld,
    }"
    class="page"
  >
    <view class="header">
      <g-flag isShowFg typeFg="505" />

      <view class="g-border-bottom my-display-none">
        <g-selhos
          v-model:hosId="pageProps.hosId"
          @change="getOutPatientHosList"
          @get-list="getHosList"
        />
      </view>
      <g-choose-pat @choose-pat="getOutPatientHosList" />
    </view>

    <view class="header-btn flex-normal">
      <view
        v-if="isShowAddRecord"
        @click="goAddRecord"
        class="g-flex-rc-cc g-border"
      >
        <view class="iconfont color-blue">&#xe6fb;</view>
        <view>手动添加记录</view>
      </view>

      <view @click="goApplyRecord" class="g-flex-rc-cc g-border">
        <view class="iconfont color-green">&#xe6fc;</view>
        <view>查看申请记录</view>
      </view>
    </view>

    <view class="container">
      <block v-if="isComplete && outHosList.length">
        <Out-Hos-List-Com
          :list="outHosList"
          :value="checkOutHosList"
          @item-click="itemClick"
        />
      </block>

      <view class="empty-list" v-else-if="isComplete">
        <g-empty
          :current="2"
          :text="isShowAddRecord ? '没有住院记录，去手动补充' : ''"
        >
          <button
            v-if="isShowAddRecord"
            @click="goAddRecord"
            class="btn g-border btn-primary empty-btn"
          >
            手动添加记录
          </button>
        </g-empty>
      </view>
    </view>
    <view v-if="outHosList.length" class="g-footer flex-column g-border-top">
      <view class="fg-agree p32c">
        <view
          :class="{
            'is-check': isCheck,
          }"
          @click.stop="flagClick"
          class="iconfont check-box"
        >
          {{ (isCheck && '&#xe6d0;') || '&#xe6ce;' }}
        </view>

        <view>
          <text @click.stop="flagClick">我已阅读并同意</text>
          <text @click.stop="regDialogConfirm.show" class="fg-agree-name">
            《归档病历资料复印须知》
          </text>
        </view>
      </view>

      <view class="flex1 flex-normal p32c">
        <view @click="chooseAll" class="footer-check flex-normal color-444">
          <view
            :class="{
              'color-blue': isCheckAll,
            }"
            class="iconfont"
          >
            {{ isCheckAll ? '&#xe6d0;' : '&#xe6ce;' }}
          </view>
          <view class="flex-normal" v-if="isCheckAll">
            {{ '已选择全部' }}
          </view>
          <view v-else>
            <block v-if="checkOutHosList.length">
              <text class="mr8">已选择</text>
              <text class="mr8 color-blue">{{ checkOutHosList.length }}</text>
              <text>个</text>
            </block>

            <text v-else>全选</text>
          </view>
        </view>
        <button
          :class="{
            'btn-disabled': !checkOutHosList.length,
          }"
          @click="nextStep"
          class="btn g-border btn-primary"
        >
          下一步
        </button>
      </view>
    </view>

    <Order-Reg-Confirm
      :title="flagTitle508"
      @confirm="isCheck = true"
      ref="regDialogConfirm"
    >
      <g-flag
        v-model:title="flagTitle508"
        typeFg="508"
        isShowFgTip
        isHideTitle
        aaa
      />
    </Order-Reg-Confirm>
    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref, nextTick } from 'vue';
  import { onShow, onLoad } from '@dcloudio/uni-app';

  import { GStores, ServerStaticData, IHosInfo, ISystemConfig } from '@/utils';
  import { type TOutHosInfo, CACHE_KEY } from './utils/recordApply';
  import { deQueryForUrl, joinQuery } from '@/common/utils';
  import { setLocalStorage, getLocalStorage } from '@/common';
  import { useCacheStore } from '@/stores';

  import api from '@/service/api';

  import OutHosListCom from './components/RecordApplyOutHosList.vue';
  import OrderRegConfirm from '@/components/orderRegConfirm/orderRegConfirm.vue';

  const pageProps = ref(
    {} as {
      hosId?: string;
      isAll?: '1';
    }
  );
  const gStores = new GStores();
  const cacheStore = useCacheStore();
  const isComplete = ref(false);
  const outHosList = ref<TOutHosInfo[]>([]);
  const checkOutHosList = ref<TOutHosInfo[]>([]);
  const getRealHosId = computed(() =>
    pageProps.value.isAll === '1' ? '' : pageProps.value.hosId
  );

  const flagTitle508 = ref('');
  const regDialogConfirm = ref<any>('');
  const isCheck = ref(false);

  const itemClick = (item: TOutHosInfo) => {
    const { _id, hosId } = item;
    const oldItem = checkOutHosList.value[0];

    if (
      oldItem &&
      hosId !== oldItem.hosId &&
      checkOutHosList.value.length === 1
    ) {
      checkOutHosList.value = [item];
      return;
    }

    if (oldItem && hosId !== oldItem.hosId) {
      gStores.messageStore.showMessage('暂不支持跨院区申请病案', 3000);
      return;
    }

    const idx = checkOutHosList.value.findIndex((o) => o._id === _id);

    if (idx === -1) {
      checkOutHosList.value.push(item);
    } else {
      checkOutHosList.value.splice(idx, 1);
    }
  };

  const flagClick = () => {
    if (isCheck.value) {
      isCheck.value = false;
    } else {
      regDialogConfirm.value.show();
    }
  };

  const nextStep = () => {
    if (!isCheck.value) {
      gStores.messageStore.showMessage('请勾选协议', 3000, {
        closeCallBack() {
          flagClick();
        },
      });
      return;
    }

    setLocalStorage({
      [CACHE_KEY]: JSON.stringify(checkOutHosList.value),
    });

    nextTick(() => {
      uni.navigateTo({
        url: joinQuery('/pagesC/medRecordApply/medRecordDetails', {
          hosId: getRealHosId.value || checkOutHosList.value[0].hosId,
          selRecords: encodeURIComponent(JSON.stringify(checkOutHosList.value)),
        }),
      });
    });
  };

  const chooseAll = () => {
    if (isCheckAll.value) {
      checkOutHosList.value = [];
    } else {
      const selNos = checkOutHosList.value.map((o) => o.visitNo);
      outHosList.value.map((item) => {
        const _oldHosId = checkOutHosList.value[0]?.hosId;

        if (!_oldHosId || (_oldHosId && item.hosId === _oldHosId)) {
          if (!selNos.includes(item.visitNo)) {
            checkOutHosList.value.push(item);
          }
        }
      });
    }
  };

  const isCheckAll = computed(() => {
    if (checkOutHosList.value.length) {
      const hosId = checkOutHosList.value[0].hosId;
      return (
        outHosList.value.filter((o) => o.hosId === hosId).length ===
        checkOutHosList.value.length
      );
    }
    return false;
  });

  const getHosList = ({ list }: { list: IHosInfo[] }) => {
    if (list.length) {
      // if (!hosId.value) {
      //   hosId.value = list[0].hosId;
      // }

      init();
    }
  };

  const pageConfig = ref<ISystemConfig['medRecord'][number]>({
    sfz: [],
    fee: 10,
    isItemCount: '0',
    hosId: '2',
  });

  // 手动添加记录?
  const isShowAddRecord = computed(() => {
    return pageConfig.value.isCustomPatRecord === '1';
  });

  const getConfig = async () => {
    const listConfig = await ServerStaticData.getSystemConfig('medRecord');
    if (pageProps.value.hosId) {
      pageConfig.value =
        listConfig.find((o) => o.hosId === pageProps.value.hosId)! ||
        ({} as any);
    } else {
      const configDetail = listConfig[0];
      pageConfig.value = configDetail;
    }

    if (!pageConfig.value) {
      gStores.messageStore.showMessage(
        '未获取到该院区的配置' + `(${pageProps.value.hosId})`
      );

      throw new Error('未获取到该院区的配置' + `(${pageProps.value.hosId})`);
    }
  };

  const init = async () => {
    await getConfig();
    getOutPatientHosList();
  };

  const getOutPatientHosList = async () => {
    isComplete.value = true;
    outHosList.value = [];
    checkOutHosList.value = [];
    const { patientId } = gStores.userStore.patChoose;
    const requestArg = {
      patientId,
      type: '11',
      hosId: getRealHosId.value,
    };

    isComplete.value = false;
    let { result } = await api
      .getOutpatientHospitalList(requestArg)
      .finally(() => {
        isComplete.value = true;
      });

    const dataNow = new Date().getTime() + '';
    result.map((o, i) => {
      o._id = dataNow + '_' + i;
    });

    outHosList.value = result || [];
  };

  const goApplyRecord = () => {
    uni.navigateTo({
      url: joinQuery('/pagesC/medRecordApply/_recordApply', {
        hosId: getRealHosId.value,
      }),
    });
  };

  const goAddRecord = () => {
    uni.navigateTo({
      url: joinQuery('/pagesC/medRecordApply/medRecordDetails', {
        hosId: pageProps.value.hosId,
        isManual: '1',
      }),
    });
  };

  onShow(() => {
    if (getLocalStorage(CACHE_KEY)) {
      setLocalStorage({
        [CACHE_KEY]: '',
      });

      checkOutHosList.value = [];
    }
  });
  // gStores.userStore.patChoose

  onLoad((opt) => {
    pageProps.value = deQueryForUrl(deQueryForUrl(opt));

    const hosId = opt?.hosId;
    if (hosId) {
      cacheStore.changeHosId(hosId);
    }
  });
</script>

<style lang="scss" scoped>
  .page {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;

    .header {
      background-color: #fff;
    }

    .header-btn {
      margin: 16rpx 32rpx;
      margin-bottom: 0;
      gap: 14rpx;
      transition: all 0.2s linear;

      > view {
        flex: 1;
        font-size: var(--hr-font-size-s);
        border-radius: 8px;
        background-color: #fff;
        padding: 26rpx 0;

        .iconfont {
          font-size: var(--hr-font-size-xxl);
          margin-right: 14rpx;
        }
      }
    }

    .container {
      flex: 1;
      height: 1px;
      overflow-y: scroll;
      padding: 0 32rpx;
    }

    .g-footer {
      padding: 24rpx 0 48rpx;
      padding-top: 12rpx;

      .fg-agree {
        display: flex;
        font-size: var(--hr-font-size-xs);
        align-items: flex-start;
        border-bottom: 2rpx solid var(--hr-neutral-color-11);
        padding-bottom: 12rpx;

        .fg-agree-name {
          color: var(--hr-brand-color-6);
        }

        .check-box {
          color: var(--hr-neutral-color-7);
          font-size: 40rpx;
          margin-right: 4rpx;
          transform: translateY(-5rpx);

          &.is-check {
            color: var(--hr-brand-color-6);
          }
        }
      }

      .footer-check {
        font-size: var(--hr-font-size-xs);
        flex: 0.7;

        .iconfont {
          font-size: var(--hr-font-size-xxl);
          color: var(--hr-neutral-color-7);
          margin-right: 10rpx;
        }
      }
      .btn {
        flex: 1;
      }
    }
  }

  .empty-btn {
    font-size: var(--hr-font-size-xs);
    padding: 18rpx 24rpx;
    line-height: 1em;
    height: 100%;
    width: 100%;
  }
</style>
