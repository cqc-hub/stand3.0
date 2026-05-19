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
        v-if="!isFilterHoliday"
        :value="checkedDay"
        :choose-days="chooseDays"
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
            :item="item"
            :pageConfig="pageConfig"
            :patient="pageConfig.isOrderWithoutPat !== '1'"
            @date-click="(e) => dateClick(e, avatarClick)"
            @avatar-click="avatarClick"
            @preregistration-click="preregistrationClick"
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
    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { ref, computed, watch } from 'vue';
  import { onReady, onShareAppMessage, onLoad } from '@dcloudio/uni-app';
  import { useOrder, IChooseDays, type IDocListAll, TSchInfo } from './utils';
  import { handlerWeChatThRegLogin } from '@/utils';
  import { joinQuery, deQueryForUrl, cloneUtil } from '@/common';

  import OrderSelDate from './components/orderSelDate/orderSelDate.vue';
  import OrderRegConfirm from '@/components/orderRegConfirm/orderRegConfirm.vue';
  import OrderDocItemAll from './components/orderDocList/OrderDocItemAll.vue';
  import OrderDocItemDate from './components/orderDocList/OrderDocItemDate.vue';
  import OrderSelectSource from './components/orderSelectSource/OrderSelectSource.vue';
  import OrderPreSource from './components/orderSelectSource/OrderPreSource.vue';
  import OrderRecommendation from './components/orderRecommendation/orderRecommendation.vue';
  import orderFilters from './components/orderSelDate/orderFilters.vue';
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
          dateChange({
            item: {
              fullDay: '',
            },
          } as any);
        }
      }
    }
  );

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
    const _holidays = holidays.value.map((o) => o.date);

    return list.filter((o) => {
      o.schDocSubResultList = (o.schDocSubResultList || []).filter((p) => {
        let r = true;
        if (isFilterDoctor.value) {
          // 过滤有号
          r = p.schState === '0';
        }

        if (isFilterHoliday.value && r) {
          r = _holidays.includes(p.schDate);
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
    const list = cloneUtil(dateDocListFilterByDate.value);

    if (isFilterDoctor.value) {
      return list.filter((o) => {
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

我是一名前端程序员，请你帮我写一份简历，24年五月份作为实习生进入浙江和仁科技股份有限公司的患者应用研发公司，负责小程序管理平台的功能开发与功能维护（vue2），参与浙江省人民医院、宝鸡市中医院、运城中心医院、深圳市坪山区人民医院、深圳市坪山妇幼保健院、临夏州人民医院、临夏妇幼保健院、江西妇幼保健院、江西儿童医院小程序前端，江苏省中医院公众号网页项目、东部战区总医院公众号项目前端的功能开发与维护（vue2+uniapp）。25年7月份正式入职浙江和仁科技股份有限公司，此后上述项目基本都有我负责维护与开发，期间浙江省人民医院参与智慧服务分级评估小程序与小程序管理平台前端的功能改造由我主要负责，最终浙江省人民医院成功全国第六家通过四级评估的单位。此外我还负责医院消息引擎的前端的开发（vue3+ts），该系统对接各个消息渠道，主要提供接口给其他部门系统如his系统、crm系统等负责向患者、医护人员等推送各种消息（短信、公众号信息、钉钉消息、小程序内部消息、企业微信消息等），深度参与天水第一人民医院、陕西中医院医院、安康中医院二期、江苏省中医院二期公众号过渡小程序等项目（vue3+ts）成功验收并上线运行，作为前端负责人负责东部战区总医院二期公众号过渡小程序、温州市人民小程序、温州中西医小程序、义乌中心医院小程序、舟山市普陀区人民医院（vue3+ts）成功验收并上线运行，并且参与这些项目后续维护。部分医院的官网页面（react+ts）
如嘉兴省第二人民医院、宜兴人民医院、乐清人民医院项目我参与维护，中国人民解放军联勤保障部队第九八七医院、新疆军区总医院自助机（electron+react）项目偶尔我参与维护
