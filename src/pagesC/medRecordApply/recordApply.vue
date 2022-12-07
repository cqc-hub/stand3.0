<template>
  <view class="page">
    <view class="header">
      <g-flag isShowFg typeFg="505" />

      <!-- class="my-display-none" -->
      <view class="g-border-bottom my-display-none">
        <g-selhos
          v-model:hosId="hosId"
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
    <view v-if="outHosList.length" class="g-footer g-border-top">
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
    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref, nextTick } from 'vue';
  import { onShow, onLoad } from '@dcloudio/uni-app';

  import { GStores, ServerStaticData, IHosInfo, ISystemConfig } from '@/utils';
  import { type TOutHosInfo, CACHE_KEY } from './utils/recordApply';
  import { joinQuery } from '@/common/utils';
  import { setLocalStorage, getLocalStorage } from '@/common';

  import api from '@/service/api';

  import OutHosListCom from './components/recordApplyOutHosList.vue';

  const props = defineProps<{
    hosId?: string;
  }>();
  const gStores = new GStores();
  const hosId = ref(props.hosId || '');
  const isComplete = ref(false);
  const outHosList = ref<TOutHosInfo[]>([]);
  const checkOutHosList = ref<TOutHosInfo[]>([]);

  const itemClick = (item: TOutHosInfo) => {
    const { _id } = item;

    const idx = checkOutHosList.value.findIndex((o) => o._id === _id);

    if (idx === -1) {
      checkOutHosList.value.push(item);
    } else {
      checkOutHosList.value.splice(idx, 1);
    }
  };

  const nextStep = () => {
    setLocalStorage({
      [CACHE_KEY]: JSON.stringify(checkOutHosList.value),
    });

    nextTick(() => {
      uni.navigateTo({
        url: joinQuery('/pagesC/medRecordApply/medRecordDetails', {
          hosId: hosId.value,
        }),
      });
    });
  };

  const chooseAll = () => {
    if (isCheckAll.value) {
      checkOutHosList.value = [];
    } else {
      checkOutHosList.value = [...outHosList.value];
    }
  };

  const isCheckAll = computed(() => {
    return checkOutHosList.value.length === outHosList.value.length;
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
    if (hosId.value) {
      pageConfig.value = listConfig.find((o) => o.hosId === hosId.value)!;
    } else {
      const configDetail = listConfig[0];
      pageConfig.value = configDetail;
    }

    if (!pageConfig.value) {
      gStores.messageStore.showMessage(
        '未获取到该院区的配置' + `(${hosId.value})`
      );

      throw new Error('未获取到该院区的配置' + `(${hosId.value})`);
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
      type: '1',
      hosId: hosId.value,
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
        hosId: hosId.value,
      }),
    });
  };

  const goAddRecord = () => {
    uni.navigateTo({
      url: joinQuery('/pagesC/medRecordApply/medRecordDetails', {
        hosId: hosId.value,
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
