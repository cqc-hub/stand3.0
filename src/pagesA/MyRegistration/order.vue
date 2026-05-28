<template>
  <view
    :class="{
      [gStores.globalStore.getPageClass]: true,
    }"
    class="g-page"
  >
    <Order-Recommendation :dept-info="deptInfo" />
    <view v-if="allDocList.length">
      <Order-Sel-Date
        :value="checkedDay"
        :choose-days="_chooseDays"
        :enable-days="enabledDays"
        :isShowOrderStatus="pageConfig.calendarShowOrderStatus === '1'"
        @change="dateChange"
        isShowAllDate
      />

      <orderFilters
        :pageConfig="pageConfig"
        v-model:isFilterDoctor="isFilterDoctor"
        v-model:isFilterHoliday="isFilterHoliday"
      />
    </view>
    <scroll-view class="g-container" scroll-y>
      <view
        v-if="!checkedDay"
        class="container-contract animate__animated animate__fadeIn"
      >
        <view v-for="(item, i) in _allDocList" :key="i" class="pb16">
          <Order-Doc-Item-All
            :listNum="_allDocList.length"
            :item="item"
            :pageConfig="pageConfig"
            :patient="pageConfig.isOrderWithoutPat !== '1'"
            @date-click="(e) => dateClick(e, avatarClick)"
            @avatar-click="avatarClick"
            @preregistration-click="preregistrationClick"
            @showdoc-dialog-click="showdocDialogClick"
          />
        </view>

        <view v-if="!_allDocList.length && isComplete" class="empty-list">
          <g-empty :current="2" text="未查询到医生排班信息" />
        </view>
      </view>

      <view v-if="checkedDay" class="container-contract">
        <view v-for="(item, i) in _dateDocListFilterByDate" :key="i" class="">
          <view v-for="(_item, _i) in item.schDateList" :key="_i">
            <view
              v-if="
                pageConfig.isHideOrderCategorName !== '1' && _item.categorName
              "
              class="item-scheme-date"
            >
              {{ _item.categorName }}
            </view>
            <view
              v-for="(__item, __i) in _item.schemeList"
              class="pb16 animate__animated animate__fadeIn"
              :key="__i"
            >
              <Order-Doc-Item-Date
                :patient="pageConfig.isOrderWithoutPat !== '1'"
                :item="__item"
                :pageConfig="pageConfig"
                :systemModeOld="gStores.globalStore.modeOld"
                @reg-click="regClick"
                @wait-reg-click="showWaitRegDialog"
                @avatar-click="avatarClick"
                @preregistration-click="preregistrationClick"
              />
            </view>
          </view>
        </view>

        <view
          v-if="!_dateDocListFilterByDate.length && isComplete"
          class="empty-list"
        >
          <g-empty :current="2" text="未查询到医生排班信息" />
        </view>
      </view>

      <view class="safe-height" />
    </scroll-view>

    <Order-Reg-Confirm
      :title="flagTitle9"
      @confirm="waitRegClick(waitRegClickData)"
      ref="waitRegDialog"
    >
      <g-flag
        v-model:title="flagTitle9"
        :typeFg="'1111'"
        isShowFgTip
        isHideTitle
        aaa
      />
    </Order-Reg-Confirm>

    <Order-Select-Source
      v-model:show="isSelectOrderSourceShow"
      v-model:selectSchInfos="selectSchInfos"
      v-model:value="selectOrderSourceNumId"
      :isComplete="isComplete"
      :orderSourceList="orderSourceList"
      :column="pageConfig.selOrderColumn"
      :is-blur="pageConfig.isOrderBlur"
      :choose-days="chooseDays"
      :checked-day="regDate"
      @item-click="orderSourceChoose"
      @am-change="amChange"
      ref="selectOrderSource"
    />
    <Order-Pre-Source
      v-model:show="isOrderPreSourceShow"
      :list="preregistrationRegNumbers"
      :pageConfig="pageConfig"
      @item-click="goPreregistration"
    />
    <Order-Reg-Confirm
      :headerIcon="
        $global.BASE_IMG +
        `v3-order-reg-confirm-add${
          gStores.globalStore.isTcmStyle ? '-tcm' : ''
        }.png`
      "
      title="医生简介"
      isHideFooter
      ref="regDialogConfirm"
    >
      <Doc-Details :detail="docDetail" />
    </Order-Reg-Confirm>

    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { ref, computed, watch } from 'vue';
  import { onReady, onShareAppMessage, onLoad } from '@dcloudio/uni-app';
  import { useOrder, IChooseDays, type IDocListAll } from './utils';
  import { getDateInfo, handlerWeChatThRegLogin } from '@/utils';
  import { joinQuery, deQueryForUrl, cloneUtil } from '@/common';
  import { IDocDetail } from './utils/DoctorDetails';

  import OrderSelDate from './components/orderSelDate/orderSelDate.vue';
  import OrderRegConfirm from '@/components/orderRegConfirm/orderRegConfirm.vue';
  import OrderDocItemAll from './components/orderDocList/OrderDocItemAll.vue';
  import OrderDocItemDate from './components/orderDocList/OrderDocItemDate.vue';
  import OrderSelectSource from './components/orderSelectSource/OrderSelectSource.vue';
  import OrderPreSource from './components/orderSelectSource/OrderPreSource.vue';
  import OrderRecommendation from './components/orderRecommendation/orderRecommendation.vue';
  import orderFilters from './components/orderSelDate/orderFilters.vue';
  import DocDetails from './components/DoctorDetails/DocDetails.vue';
  import { CanWrite } from '@/typeUtils';
  import api from '@/service/api';

  const props = defineProps<{
    hosId: string;
    clinicalType: string; // 1、普通预约 2-膏方预约 3-名医在线夜门诊 4-云诊室 5-自助便民门诊（省人民凤凰HIS）6-专病门诊 7-成人 8-儿童 9-弹性门诊 10-军属门诊 11-军人门诊
    deptId?: string;
    hosDeptId?: string;
    firstHosDeptId?: string;
    secondHosDeptId?: string;
    promptMessage?: string; // 就诊提示
    deptName: string;
    isExpertDeptId?: string; // 是否是专家科室（0否 1是） 是：按一级科室ID查询排班 否：按二级科室ID查询排班
    thRegisterId?: string;
  }>();
  const pageProps = ref(<CanWrite<typeof props>>{});
  const isFilterDoctor = ref(false);
  const isFilterHoliday = ref(false);
  const holidays = ref<
    {
      date: string;
      name: string;
      des: string;
    }[]
  >([]);
  const _holidays = computed(() => {
    if (Array.isArray(holidays.value)) {
      return holidays.value.map((o) => o.date);
    }
    return [];
  });
  watch(
    () => isFilterHoliday.value,
    async (v) => {
      if (v) {
        if (!holidays.value.length) {
          uni.showLoading({});

          holidays.value = await api.getChineseHolidays();
          uni.hideLoading();
        }

        if (checkedDay.value) {
          if (
            !(
              _holidays.value.includes(checkedDay.value) ||
              ['周六', '周日'].includes(getDateInfo(checkedDay.value).name)
            )
          ) {
            checkedDay.value = '';
          }
        }
      }
    }
  );

  const _chooseDays = computed(() => {
    if (isFilterHoliday.value) {
      return chooseDays.value.filter(
        (o) =>
          _holidays.value.includes(o.fullDay) ||
          ['周六', '周日'].includes(getDateInfo(o.fullDay).name)
      );
    }
    return chooseDays.value;
  });

  const hosDeptId = ref(
    (props.hosDeptId && decodeURIComponent(props.hosDeptId)) || ''
  );
  const firstHosDeptId = ref(
    (props.firstHosDeptId && decodeURIComponent(props.firstHosDeptId)) || ''
  );
  const secondHosDeptId = ref(
    (props.secondHosDeptId && decodeURIComponent(props.secondHosDeptId)) || ''
  );
  const flagTitle9 = ref('');

  const regDialogConfirm = ref<any>('');

  const docDetail = ref({} as IDocDetail);

  const deptName = ref(decodeURIComponent(props.deptName));
  const {
    init,
    chooseDays,
    checkedDay,
    getListByDate,
    allDocList,
    dateDocList,
    dateDocListFilterByDate,
    dateClick,
    isSelectOrderSourceShow,
    selectOrderSource,
    selectSchInfos,
    orderSourceList,
    orderConfig: pageConfig,
    orderSourceChoose,
    selectOrderSourceNumId,
    amChange,
    regClick,
    waitRegClick,
    isComplete,
    enabledDays,
    getDeptInfo,
    deptInfo,
    regDate,
    gStores,
    preregistrationClick,
    isOrderPreSourceShow,
    preregistrationRegNumbers,
    goPreregistration,
    waitRegDialog,
    waitRegClickData,
    showWaitRegDialog,
  } = useOrder(ref({ ...props }));

  const _allDocList = computed(() => {
    const list = cloneUtil(allDocList.value);

    return list.filter((o) => {
      o.schDocSubResultList = (o.schDocSubResultList || []).filter((p) => {
        let r = true;
        if (isFilterDoctor.value) {
          // 过滤有号
          r = p.schState === '0';
        }

        if (isFilterHoliday.value && r) {
          r =
            _holidays.value.includes(p.schDate) ||
            ['周六', '周日'].includes(getDateInfo(p.schDate).name);
        }
        return r;
      });

      if (isFilterDoctor.value || isFilterHoliday.value) {
        return o.schDocSubResultList.length;
      }

      return true;
    });
  });

  const _dateDocListFilterByDate = computed(() => {
    let list = cloneUtil(dateDocListFilterByDate.value);

    if (isFilterDoctor.value) {
      list = list.filter((o) => {
        o.schDateList = (o.schDateList || []).filter((p) => {
          p.schemeList = (p.schemeList || []).filter((q) => {
            q.schemeList = (q.schemeList || []).filter((r) => {
              return r.schState === '0';
            });

            return q.schemeList.length;
          });

          return p.schemeList.length;
        });

        return o.schDateList.length;
      });
    }

    if (isFilterHoliday.value) {
      list = list.filter(
        (o) =>
          _holidays.value.includes(o.schDate) ||
          ['周六', '周日'].includes(getDateInfo(o.schDate).name)
      );
    }

    return list;
  });

  onReady(() => {
    uni.setNavigationBarTitle({
      title: `${decodeURIComponent(deptName.value)}`,
    });
  });

  onShareAppMessage((res) => {
    return {
      title: `${decodeURIComponent(pageProps.value.deptName)}`,
      path: joinQuery('/pagesA/MyRegistration/order', pageProps.value),
    };
  });

  onLoad((opt) => {
    pageProps.value = deQueryForUrl(deQueryForUrl(opt));
  });

  const showdocDialogClick = (item: IDocDetail) => {
    docDetail.value = item;
    regDialogConfirm.value.show();
  };
  const dateChange = (item: IChooseDays) => {
    checkedDay.value = item.fullDay;

    if (!dateDocList.value.length) {
      getListByDate({
        ...props,
        hosDeptId: hosDeptId.value,
        firstHosDeptId: firstHosDeptId.value,
        secondHosDeptId: secondHosDeptId.value,
      });
    }
  };

  const avatarClick = (item: IDocListAll) => {
    const { deptName, docName, hosDocId, hosId, hosDeptId, docTitleName } =
      item;
    const { thRegisterId, clinicalType } = props;
    const args = {
      clinicalType,
      deptName,
      docName,
      docTitleName,
      hosDocId,
      hosId,
      // firstHosDeptId,
      // secondHosDeptId,
      hosDeptId,
      thRegisterId,
    };

    uni.navigateTo({
      url: joinQuery('/pagesA/MyRegistration/DoctorDetails', args),
    });
  };

  // 科室推荐
  getDeptInfo({ ...props });

  init({
    ...props,
    hosDeptId: hosDeptId.value,
    firstHosDeptId: firstHosDeptId.value,
    secondHosDeptId: secondHosDeptId.value,
  });

  handlerWeChatThRegLogin(props);
</script>

<style lang="scss" scoped>
  .g-container {
    .animate__animated {
      animation-duration: 0.3s;
    }
  }

  .container-contract {
    padding: 0 32rpx;
    padding-top: 24rpx;
  }

  .item-scheme-date {
    color: var(--hr-neutral-color-7);
    font-size: var(--hr-font-size-xs);
    margin: 16rpx 0;
  }

  .empty-list {
    transform: translateY(100%);
  }
</style>
