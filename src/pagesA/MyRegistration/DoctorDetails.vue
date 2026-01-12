<template>
  <view
    :class="{
      [gStores.globalStore.getPageClass]: true,
    }"
    class="g-page"
  >
    <scroll-view class="g-container" scroll-y>
      <view class="href-content">
        <image
          :src="
            $global.BASE_IMG +
            `v3_doctor_card_top${
              gStores.globalStore.isTcmStyle ? '-tcm' : ''
            }.png`
          "
          mode="widthFix"
          class="header-bg my-disabled"
        />

        <view class="content">
          <view class="header-box f28">
            <view class="content-box header-content-box g-border">
              <view class="header-transform">
                <view
                  class="header flex-between"
                  :class="isPliticalDoc ? 'mb48' : 'mb16'"
                >
                  <image
                    :src="headerBg"
                    @click="previewImg"
                    mode="aspectFill"
                    class="doc-avatar g-border"
                  />
                       <!-- 2种党员样式 -->
                    <image
                      v-if="isPliticalDoc && pageConfig.isPartyMemberStyle ==='1'"
                      class="CPC-icon1"
                      :src="globalGl.BASE_IMG + 'is_party_member.png'"
                    ></image>
                    <image
                      v-if="isPliticalDoc && pageConfig.isPartyMemberStyle !=='1'"
                      class="CPC-icon"
                      :src="globalGl.BASE_IMG + 'CPC-icon2.png'"
                    ></image>

                  <view class="flex-normal header-btn">
                    <g-login @handler-next="collectDoc">
                      <button
                        @click="collectDoc"
                        class="btn btn-warning btn-round btn-size-small"
                      >
                        <text class="iconfont f36 mr12">
                          {{
                            docDetail.collectState == '2'
                              ? '&#xe6ff;'
                              : '&#xe700;'
                          }}
                        </text>
                        <text class="text-no-wrap">
                          {{
                            docDetail.collectState == '2' ? '已关注' : '关注'
                          }}
                        </text>
                      </button>
                    </g-login>

                    <button
                      @click="refDocShare.show"
                      class="btn btn-warning btn-round btn-size-small share-btn color-blue"
                    >
                      <text class="iconfont f36 mr12">&#xe6e0;</text>
                      <text class="text-no-wrap">分享</text>
                    </button>
                  </view>
                </view>

                <view class="p32c header-content">
                  <view class="flex-normal">
                    <view class="doc-name mr24 f48 g-bold">
                      <text class="---text-ellipsis">
                        {{ props.docName || docDetail.docName }}
                      </text>
                    </view>

                    <text
                      v-for="(t, ti) in getSuffixTitle()"
                      :key="t"
                      :class="{
                        'g-split-line1 mr12 pr12':
                          ti !== getSuffixTitle().length - 1,
                      }"
                      class="color-444 text-no-wrap"
                    >
                      {{ t }}
                    </text>
                  </view>

                  <view class="mt12 color-444">
                    <text
                      v-for="(item, i) in getShowRow2"
                      :key="i"
                      :class="{
                        'g-split-line  mr12 pr12': i !== getShowRow2.length - 1,
                      }"
                    >
                      {{ item }}
                    </text>
                  </view>

                  <view
                    v-if="docDetail.multiplePracticeLocation"
                    class="work-place mt12"
                  >
                    <text class="color-fff tag mr16 mb50">多点执业</text>
                    <text
                      v-for="(place, pi) in getDicMultiplePracticeLocation"
                      :class="{
                        'g-split-line':
                          pi !== getDicMultiplePracticeLocation.length - 1,
                      }"
                      :key="place"
                      class="color-444 mr12 pr12 g-break-world"
                    >
                      {{ place }}
                    </text>
                  </view>
                  <view
                    v-if="docDetail.clinicTime"
                    class="flex-normal doc-goodat"
                    @click="regDialogConfirm.show"
                  >
                    <text class="color-fff tags mr16 mb12">就诊提醒</text>
                    <view
                      class="color-666 f28 clinicTime-content text-ellipsis"
                    >
                      <!-- <text v-if="docDetail.goodAt">{{ docDetail.goodAt }}</text> -->
                      <rich-text
                        v-if="docDetail.clinicTime"
                        :nodes="
                          HTMLParser(
                            throughCharacterLineFeed(docDetail.clinicTime),
                            '\n'
                          )
                        "
                      />
                    </view>
                  </view>
                </view>

                <view class="flex-normal p32c doc-goodat">
                  <image
                    v-if="docDetail.goodAt"
                    :src="
                      $global.BASE_IMG +
                      `v3_doctor_card_major${
                        gStores.globalStore.isTcmStyle ? '-tcm' : ''
                      }.png`
                    "
                    class="doc-major-goodat mr12"
                    mode="widthFix"
                  />

                  <view class="color-666 f28 doc-goodat-content text-ellipsis">
                    <!-- <text v-if="docDetail.goodAt">{{ docDetail.goodAt }}</text> -->
                    <rich-text
                      v-if="docDetail.goodAt"
                      :nodes="
                        HTMLParser(
                          throughCharacterLineFeed(docDetail.goodAt),
                          '\n'
                        )
                      "
                    />
                    <!-- <rich-text
                      v-if="docDetail.goodAt"
                      :nodes="HTMLParser(docDetail.goodAt)"
                    /> -->

                    <view
                      v-if="
                        docDetail.goodAt ||
                        docDetail.intro ||
                        docDetail.academicAchievements
                      "
                      @click="regDialogConfirm.show"
                      class="doc-show-intro f26 color-blue"
                    >
                      <text>查看简介</text>
                      <text class="iconfont">&#xe66b;</text>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>

          <view>
            <view class="f36 g-bold mb16 flex-between">
              <view class="text-no-wrap mr32">出诊时间</view>
              <g-login
                v-if="docDetail.preStatus === '1'"
                @handler-next="preregistrationClick(docDetail as any)"
                patient
              >
                <button
                  @click="preregistrationClick(docDetail as any)"
                  class="btn btn-primary btn-round btn-size-small"
                >
                  预约登记
                </button>
              </g-login>
            </view>

            <view
              :class="{
                pb40: docSchList.length,
              }"
              class="content-box"
            >
              <template>
                <view
                  class="tabs pl16 pr16 mb16"
                  v-if="docHosSchList.length && isMultHosDoc"
                  style="width: 100%"
                >
                  <g-tabs
                    v-model:value="tabCurrent"
                    :tabs="docHosSchList"
                    :scroll="true"
                    field="hosName"
                    @change="tabChange"
                  >
                    <template #default="{ label, idx }">
                      <text @click.stop="confirmChangeHos(idx)">
                        {{ label }}
                      </text>
                    </template>
                  </g-tabs>
                </view>
                <view
                  v-if="docSchList.length"
                  class="content-sel-date mb16 g-border-bottom"
                >
                  <Order-Sel-Date
                    :value="
                      isMultHosDoc
                        ? docHosSchList[tabCurrent].checkedDay
                        : checkedDay
                    "
                    :choose-days="
                      isMultHosDoc
                        ? docHosSchList[tabCurrent].chooseDays
                        : chooseDays
                    "
                    :enable-days="
                      isMultHosDoc
                        ? docHosSchList[tabCurrent].enabledDays
                        : enabledDays
                    "
                    @change="dateChange"
                  />
                </view>

                <block
                  v-if="isMultHosDoc ? docHosSchList.length : docSchList.length"
                >
                  <block
                    v-if="
                      Object.keys(
                        isMultHosDoc
                          ? schHosToday(docHosSchList[tabCurrent]).schByHos
                          : schToday.schByHos
                      ).length
                    "
                  >
                    <view v-if="isShowHosNet">
                      <text class="label-mark">
                        <text class="color-fff f28 label-mark-content">
                          到院就诊
                        </text>
                      </text>
                    </view>

                    <view
                      v-for="_hosId in Object.keys(
                        (isMultHosDoc
                          ? schHosToday(docHosSchList[tabCurrent])
                          : schToday
                        ).schByHos
                      )"
                      :key="_hosId"
                      class="p32c mt12"
                    >
                      <view
                        v-for="(item, idx) in (isMultHosDoc
                          ? schHosToday(docHosSchList[tabCurrent])
                          : schToday
                        ).schByHos[_hosId]"
                        :key="item.schId"
                      >
                        <view v-if="!idx" class="f32 g-bold mb16">
                          {{ item.hosName }}
                        </view>

                        <view
                          :class="{
                            mb32:
                              idx ===
                              (isMultHosDoc
                                ? schHosToday(docHosSchList[tabCurrent])
                                : schToday
                              ).schByHos[_hosId].length -
                                1,
                          }"
                          class="sch-item mb8 animate__animated animate__fadeIn"
                        >
                          <Doc-Sch-Item
                            :gStores="gStores"
                            :pageConfig="pageConfig"
                            :patient="pageConfig.isOrderWithoutPat !== '1'"
                            :item="item"
                            :systemModeOld="gStores.globalStore.modeOld"
                            @reg-click="
                              (scheme) => {
                                isMultHosDoc &&
                                  (chooseDays =
                                    docHosSchList[tabCurrent].chooseDays);
                                regClick({ scheme });
                              }
                            "
                            @wait-reg-click="showWaitRegDialog"
                          />
                        </view>
                      </view>
                    </view>
                  </block>

                  <block v-if="Object.keys(schToday.schByNetHos).length">
                    <view class="animate__animated animate__fadeIn">
                      <view>
                        <text class="label-mark mb8">
                          <text class="color-fff f28 label-mark-content">
                            网络就诊
                          </text>
                        </text>
                      </view>

                      <view
                        v-for="_hosId in Object.keys(schToday.schByNetHos)"
                        :key="_hosId"
                        class="p32c mt12"
                      >
                        <view
                          v-for="(item, idx) in schToday.schByNetHos[_hosId]"
                          :key="item.schId"
                        >
                          <view v-if="!idx" class="f36 g-bold mb16">
                            {{ item.hosName }}
                          </view>

                          <view
                            :class="{
                              mb32:
                                idx === schToday.schByHos[_hosId].length - 1,
                            }"
                            class="sch-item mb8"
                          >
                            <Doc-Sch-Item
                              :gStores="gStores"
                              :pageConfig="pageConfig"
                              :patient="pageConfig.isOrderWithoutPat !== '1'"
                              :item="item"
                              :systemModeOld="gStores.globalStore.modeOld"
                              @reg-click="regClick"
                              @wait-reg-click="showWaitRegDialog"
                            />
                          </view>
                        </view>
                      </view>
                    </view>
                  </block>
                </block>

                <view class="empty-list" v-else-if="isComplete">
                  <g-empty
                    :current="2"
                    imgHeight="180rpx"
                    text="未查询到该医生排班信息"
                    noTransformY
                  />
                </view>
              </template>
            </view>
          </view>

          <view v-if="docSchOutHosList.length" class="mt32">
            <!-- <view class="f36 g-bold mb16 flex-between">
              <view>外院排班</view>
            </view> -->

            <doc-sch-out-hos
              v-model:hos-id="selOutHosId"
              v-model:day="selOutHosDay"
              :list="docSchOutHosList"
              :pageConfig="pageConfig"
              @reg-click="outRegClick"
            />
          </view>
        </view>

        <view v-if="mdtDocList.length" class="content">
          <view class="mb16 mt56">
            <text class="f36 g-bold mr24">联合门诊</text>
          </view>

          <view class="">
            <departmentDocList :list="mdtDocList" @item-click="mdtDocClick" />
          </view>
        </view>

        <block v-if="isDocServiceShow">
          <view class="mb16 mt56 p32c">
            <text class="f36 g-bold mr24">在线服务</text>
            <text
              v-if="
                gStores.globalStore.sysCode === '1001067' &&
                docServiceInfo.satisfaction
              "
              class="f28"
            >
              <text class="mr12">评分</text>
              <text class="color-warn">
                {{ docServiceInfo.satisfaction }}分
              </text>
              <text class="f26">/5分</text>
            </text>
          </view>
          <scroll-view class="service-content" scroll-x>
            <Doc-Service
              :docService="docServiceInfo"
              :hosDocId="docDetail.hosDocId"
            />
          </scroll-view>
        </block>

        <block v-if="pageConfig.isOpenBigDataNearlyYear === '1'">
          <view class="mt32 f36 g-bold mb16 service-onlione p32c">
            近一年大数据
          </view>

          <view v-if="tableData.length" class="table-content">
            <Doc-Big-Data-Table :columns="tableColumns" :tableData="tableData">
              <template #td="{ row, field, rowIndex }">
                <view v-if="field === 'name'" class="flex-normal">
                  <view
                    :class="{
                      'bg-yellow': !rowIndex,
                    }"
                    class="category-icon f24 g-flex-rc-cc"
                  >
                    {{ row._label }}
                  </view>
                  <view class="flex1 text-ellipsis">{{ row[field] }}</view>
                </view>

                <text v-else>{{ row[field] }}</text>
              </template>
            </Doc-Big-Data-Table>
          </view>
        </block>
        <view class="safe-height" />
      </view>

      <view
        v-if="
          pageConfig.isOpenComment === '1' &&
          pageConfig.isHideCommentListInDocDetail !== '1' &&
          commentList.length
        "
        class="doc-comment"
      >
        <view class="p32c">
          <Doc-Comment
            :list="commentList"
            :total="commentTotal"
            @show-all-click="goAllComment"
          />
        </view>
        <view class="safe-height" />
      </view>
    </scroll-view>

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

    <Doc-Share
      :pageProp="props"
      :detail="docDetail"
      :pageConfig="pageConfig"
      ref="refDocShare"
    />

    <Order-Select-Source
      v-model:show="isSelectOrderSourceShow"
      v-model:selectSchInfos="selectSchInfos"
      v-model:value="selectOrderSourceNumId"
      :isComplete="isComplete"
      :orderSourceList="orderSourceList"
      :column="orderConfig.selOrderColumn"
      :is-blur="orderConfig.isOrderBlur"
      :choose-days="chooseDays"
      :checked-day="regDate"
      @item-click="orderSourceChoose"
      @am-change="amChange"
    />

    <Order-Pre-Source
      v-model:show="isOrderPreSourceShow"
      :list="preregistrationRegNumbers"
      :pageConfig="orderConfig"
      @item-click="goPreregistration"
    />
    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { computed, nextTick, ref, getCurrentInstance } from 'vue';
  import { onLoad, onShareAppMessage } from '@dcloudio/uni-app';

  import { useOrder, IChooseDays, TSchInfo, getChooseDays } from './utils';

  import {
    UseDoctorDetail,
    type IProps,
    type IDocDetail,
    type IDocSchListItem,
    type IDocService,
    type ICommentItem,
    type IDocSchOutHosItem,
    type IDocHosSchListItem,
  } from './utils/DoctorDetails';
  import { deQueryForUrl, joinQuery, joinQueryForUrl } from '@/common';
  import {
    previewImage,
    GStores,
    ServerStaticData,
    type ISystemConfig,
    useTBanner,
    throughCharacterLineFeed,
    apiAsync,
    wait,
  } from '@/utils';

  import globalGl from '@/config/global';
  import HTMLParser from '@/common/html-parser';

  import OrderSelDate from './components/orderSelDate/OrderSelDate.vue';
  import OrderRegConfirm from '@/components/orderRegConfirm/orderRegConfirm.vue';
  import DocDetails from './components/DoctorDetails/DocDetails.vue';
  import DocShare from './components/DoctorDetails/DocShare.vue';
  import DocSchItem from './components/DoctorDetails/DocShcItem.vue';
  import OrderSelectSource from './components/orderSelectSource/OrderSelectSource.vue';
  import DocService from './components/DoctorDetails/DocService.vue';
  import DocBigDataTable from './components/DoctorDetails/DocBigDataTable.vue';
  import DocComment from './components/DoctorDetails/DocComment.vue';
  import OrderPreSource from './components/orderSelectSource/OrderPreSource.vue';
  import DocSchOutHos from './components/DoctorDetails/DocSchOutHos.vue';
  import departmentDocList from './components/DepartmentCard/departmentDocList.vue';

  import api from '@/service/api';

  /**
   * 医生名片分享:  后台新建普通链接二维码 https://h5.eheren.com/scan/${syscode}/DoctorDetails?${...props}
   */
  const props = ref({} as IProps);
  const gStores = new GStores();
  const pageConfig = ref({} as ISystemConfig['order']);

  const docServiceInfo = ref({} as IDocService);
  const isDocServiceShow = ref(false);

  const refDocShare = ref<any>('');

  const docSchList = ref<IDocSchListItem[]>([]);
  const docHosSchList = ref<IDocHosSchListItem[]>([]);
  const docSchOutHosList = ref<IDocSchOutHosItem[]>([]);
  const selOutHosId = ref('');
  const selOutHosDay = ref('');
  const flagTitle9 = ref('');
  const docHosSchHeight = ref(100);
  const isMultHosDoc = ref(false);

  const getSuffixTitle = (): string[] => {
    let { docJobName, docTitleName } = docDetail.value;
    if (pageConfig.value.isHideDocJob === '1') {
      docJobName = '';
    }
    return [docJobName, docTitleName].filter((o) => o);
  };

  const isPliticalDoc = computed(() => {
    return (
      docDetail.value?.politicalStatus &&
      ['中共党员', '中共预备党员'].includes(docDetail.value.politicalStatus)
    );
  });

  const schToday = computed(() => {
    if (checkedDay.value) {
      return docSchList.value.find((o) => o.schDate === checkedDay.value)!;
    } else {
      return {
        schByHos: {},
        schByNetHos: {},
        schDate: '???',
      };
    }
  });

  const isShowHosNet = computed(() => {
    return !!Object.keys(schToday.value.schByNetHos).length;
  });
  const getDicMultiplePracticeLocation = computed(() => {
    if (docDetail.value.multiplePracticeLocation) {
      return docDetail.value.multiplePracticeLocation.split(',');
    }

    return [];
  });

  const getShowRow2 = computed(() => {
    const c: string[] = [];
    if (pageConfig.value.orderMode !== '1') {
      if (pageConfig.value.isHideHosName !== '1') {
        c.push(docDetail.value.hosName!);
      }
      c.push(docDetail.value.deptName!);
    }

    return c.filter((o) => o);
  });

  const tableData = computed(() => {
    return [
      {
        name: docDetail.value.docName,
        time: '-',
        fee: '-',
        pl: '-',
        _label: '医',
      },
      {
        name: docDetail.value.deptName,
        time: '-',
        fee: '-',
        pl: '-',
        _label: '科',
      },
      {
        name: '清丰中医院',
        time: '-',
        fee: '-',
        pl: '-',
        _label: '院',
      },
      {
        name: '清丰县',
        time: '-',
        fee: '-',
        pl: '-',
        _label: '区',
      },
    ];
  });

  const tableColumns = ref(<any>[
    {
      label: '分类',
      key: 'name',
      width: '270rpx',
    },
    {
      label: '日均就诊次数(次)',
      key: 'time',
      width: '160rpx',
    },
    {
      label: '均次费用(元)',
      key: 'fee',
      width: '150rpx',
    },
    {
      label: '满意度',
      key: 'pl',
      width: '100rpx',
      align: 'center',
    },
  ]);

  let useDoctorDetail = {} as UseDoctorDetail;

  const {
    chooseDays,
    checkedDay,
    orderConfig,
    init: OrderInit,
    selectSchInfos,
    isSelectOrderSourceShow,
    selectOrderSourceNumId,
    isComplete,
    orderSourceList,
    orderSourceChoose,
    amChange,
    regClick,
    waitRegClick,
    enabledDays,
    filterChooseDays,
    regDate,
    preregistrationClick,
    isOrderPreSourceShow,
    preregistrationRegNumbers,
    goPreregistration,
    waitRegDialog,
    waitRegClickData,
    showWaitRegDialog,
  } = useOrder(props as any);
  const regDialogConfirm = ref<any>('');

  const docDetail = ref(<IDocDetail>{
    docName: props.value.docName,
    deptName: props.value.deptName,
  });
  const tabCurrent = ref(0);

  const headerBg = computed(() => {
    return (
      docDetail.value.docPhoto ||
      `/static/image/order/order-doctor-avatar${
        gStores.globalStore.isTcmStyle ? '-tcm' : ''
      }.png`
    );
  });

  const previewImg = () => {
    const photo = docDetail.value.docPhoto;
    if (photo) {
      previewImage([photo]);
    }
  };

  const dateChange = (item: IChooseDays) => {
    if (isMultHosDoc.value) {
      docHosSchList.value = docHosSchList.value.map((o, index) => {
        if (index === tabCurrent.value) {
          o.checkedDay = item.fullDay;
        } else {
          o.checkedDay = undefined;
        }
        return o;
      });
    }
    checkedDay.value = item.fullDay;
    getJointClinicList();
  };

  /** 联合门诊 */
  const mdtDocList = ref<any[]>([]);
  const getJointClinicList = async () => {
    mdtDocList.value = [];
    const schListToday = docSchList.value.find(
      (o) => o.schDate === checkedDay.value
    );

    if (schListToday) {
      const { schByHos = [] } = schListToday;

      const totalSchList = Object.keys(schByHos).reduce((acc, curr) => {
        return acc.concat(...schByHos[curr]);
      }, [] as TSchInfo[]);

      const mdtItem = totalSchList.find((o) => o.specialIndicator === '1');
      if (mdtItem) {
        const { clinicForRegistId } = mdtItem;

        const { result = [] } = await api.findByDocSchId({
          clinicForRegistId,
        });

        mdtDocList.value = result;
      }
    }
  };
  const mdtDocClick = (item) => {
    const { docName, hosDocId, hosId } = item;

    uni.navigateTo({
      url: joinQueryForUrl('/pagesA/MyRegistration/DoctorDetails', {
        docName,
        hosId,
        hosDocId,
        // hosDeptId,
      }),
    });
  };

  const getSchData = async () => {
    isComplete.value = false;

    const { schList, enabledDays: _enabledDays } = await useDoctorDetail
      .getDocSch()
      .finally(() => {
        isComplete.value = true;
      });

    if (schList.length) {
      const { schDate } = schList[0];
      checkedDay.value = schDate;
      docSchList.value = schList;

      //判断是否多院区
      let schListByhosId = groupedByHosId(schList);
      if (schListByhosId.length > 1) {
        isMultHosDoc.value = true;
        let myChooseDays = getChooseDays(orderConfig.value.chooseDay);
        schListByhosId = schListByhosId.map((item) => {
          const { enabledDays } = useDoctorDetail.dealSchList(item.schList);
          return {
            ...item,
            checkedDay: item.schList[0].schDate,
            enabledDays,
            chooseDays: myChooseDays.filter((o) => {
              return enabledDays[o.fullDay];
            }),
          };
        });

        docHosSchList.value = [
          {
            hosName: '全部院区',
            hosId: '',
            schList: schList,
            checkedDay: schList[0].schDate,
            enabledDays: _enabledDays,
            chooseDays: myChooseDays.filter((o) => {
              return _enabledDays[o.fullDay];
            }),
          },
        ];
        docHosSchList.value.push(...schListByhosId);
        await wait(0);
        if (props.value.hosId && docHosSchList.value.length > 1) {
          tabCurrent.value = docHosSchList.value.findIndex(
            (o) => o.hosId === props.value.hosId
          );
        }
        // tabCurrent.value=
      }
    }

    enabledDays.value = _enabledDays;
    filterChooseDays();
  };

  const schHosToday = (item) => {
    if (item.checkedDay) {
      return item.schList.find((o) => o.schDate === item.checkedDay)!;
    } else {
      return {
        schByHos: {},
        schByNetHos: {},
        schDate: '???',
      };
    }
  };

  let tabChange = async (idx: number) => {
    docHosSchList.value = docHosSchList.value.map((o, index) => {
      if (index === idx) {
        o.checkedDay = o.schList[0].schDate;
      } else {
        o.checkedDay = undefined;
      }
      return o;
    });

    tabCurrent.value = idx;
  };

  const groupedByHosId = (originalArray) => {
    return originalArray.reduce((acc, current) => {
      current.schDateList.forEach((item) => {
        const hosId = item.hosId;
        const existingHos = acc.find((h) => h.hosId === hosId);

        if (existingHos) {
          const existingDate = existingHos.schList.find(
            (d) => d.schDate === current.schDate
          );
          if (existingDate) {
            existingDate.schDateList.push(item);
          } else {
            existingHos.schList.push({
              schDate: current.schDate,
              schDateList: [item],
            });
          }
        } else {
          acc.push({
            hosId: hosId,
            hosName: item.hosName,
            schList: [
              {
                schDate: current.schDate,
                schDateList: [item],
              },
            ],
          });
        }
      });
      return acc;
    }, []);
  };

  const collectDoc = async () => {
    await getDocDetail();
    let { collectState, docPhoto, docTitleName } = docDetail.value;
    const { deptName, docName, hosDocId, hosDeptId, hosId } = props.value;

    const {
      herenId,
      browser: { source },
    } = gStores.globalStore;

    const collectType = 2;

    if (collectState == '1') {
      // weixin://dl/business/?t=XxTgl2eqtWq
      await api.addCollect({
        collectType,
        deptName,
        docName,
        docPhoto,
        docTitleName,
        hosDocId,
        herenId,
        hosDeptId,
        hosId,
        source,
      });
      docDetail.value.collectState = '2';
      gStores.messageStore.showMessage('关注成功', 3000);
    } else {
      await api.delMyCollect({
        collectType,
        herenId,
        hosDocId,
        hosId,
      });
      docDetail.value.collectState = '1';
      gStores.messageStore.showMessage('已经取消关注', 3000);
    }
  };

  const getDocDetail = async () => {
    await useDoctorDetail.getDoctorDetail().then((r) => {
      docDetail.value = r;
      props.value.docName = r.docName;
    });
  };

  const outRegClick = (e: { scheme: TSchInfo }) => {
    const additionalData = {
      ...props.value,
      ...e.scheme,
    };

    const handlerConfig = pageConfig.value.handlerOutHosSchClick;

    handlerConfig && useTBanner(handlerConfig, 'navigateTo', additionalData);
  };

  // 在线服务
  const getDocService = async () => {
    const { netHosId } = pageConfig.value;
    const { hosDocId } = props.value;

    const args = {
      hosDocId,
      hosId: netHosId,
      funcode: 'service-base-platform/rest/doctor/hos-doc-id',
    };

    const { data } = await api.sendNetHos(args);

    if (data) {
      const { receptionMode, jsonParam, pictureParam, videoParam, phoneParam } =
        data;

      if (receptionMode) {
        try {
          // 在线问诊
          data.jsonParam =
            receptionMode & 8 &&
            jsonParam &&
            JSON.parse(jsonParam)?.registerCategorys[0];

          // 图文咨询
          data.pictureParam =
            receptionMode & 1 &&
            pictureParam &&
            JSON.parse(pictureParam)?.registerCategorys[0];

          // 视频门诊
          data.videoParam =
            receptionMode & 4 &&
            videoParam &&
            JSON.parse(videoParam)?.registerCategorys[0];

          // 电话问诊
          data.phoneParam =
            receptionMode & 2 &&
            videoParam &&
            JSON.parse(phoneParam)?.registerCategorys[0];
        } catch (error) {
          console.error(error);
          throw new Error('医生在线服务参数异常');
        }

        if (jsonParam || pictureParam || videoParam) {
          isDocServiceShow.value = true;
        }

        docServiceInfo.value = data;
      }
    }
  };

  const getPageConfig = async () => {
    pageConfig.value = await ServerStaticData.getSystemConfig('order');
  };

  const commentTotal = ref('0');
  const commentList = ref<ICommentItem[]>([]);
  const getCommentList = async () => {
    const { hosDocId } = docDetail.value;

    const { result } = await api.getAllSatisfactions({
      hosDocId,
      pageSize: 6,
      index: 1,
    });

    if (result) {
      const { satisfactionResultList, totalNum } = result;

      commentTotal.value = totalNum;
      commentList.value = satisfactionResultList || [];
    }
  };

  const goAllComment = () => {
    uni.navigateTo({
      url: joinQuery('/pagesA/MyRegistration/DoctorDetailsComment', {
        hosDocId: docDetail.value.hosDocId,
      }),
    });
  };

  let isFirstChangeHos = false;
  const confirmChangeHos = async (idx: number) => {
    if (!isFirstChangeHos) {
      const { confirm } = await apiAsync(uni.showModal, {
        content:
          '您当前正在进行院区切换，请注意不同院区地址不同，是否继续切换预约对应院区号源？',
      });

      if (!confirm) {
        return;
      }
      isFirstChangeHos = true;
    }
    tabChange(idx);
  };

  const init = async () => {
    await getPageConfig();
    await OrderInit();
    await getDocDetail();
    await getSchData();

    const {
      isOpenComment,
      isHideCommentListInDocDetail,
      isOpenDocCardOnlineService,
      isOpenDocCardOnlineServiceAlipay,
      isOpenOutHosSch,
    } = pageConfig.value;

    if (isOpenComment === '1' && isHideCommentListInDocDetail !== '1') {
      getCommentList();
    }
    
    // #ifndef MP-TOUTIAO
     if (isOpenDocCardOnlineService === '1') {
      getDocService();
    }
    // #endif

    // #ifdef MP-ALIPAY
    if (isOpenDocCardOnlineServiceAlipay === '1') {
      getDocService();
    }
    // #endif

    if (isOpenOutHosSch === '1') {
      docSchOutHosList.value = await useDoctorDetail.getOutHosSchData();
    }

    getJointClinicList();
  };

  onShareAppMessage((res) => {
    return {
      title: `${docDetail.value.docName}医生`,
      path: joinQuery('/pagesA/MyRegistration/DoctorDetails', props.value),
    };
  });

  onLoad(async (opt) => {
    console.log('页面参数---', opt);
    //  weixin://dl/business/?t=LgnSWxNLRHs
    props.value = deQueryForUrl(deQueryForUrl(opt));

    // 兼容 alipays://platformapi/startapp?appId=2021003173633521&page=pagesA/MyRegistration/DoctorDetails&query=hosDocId%3D101714
    if (!Object.keys(props.value).length) {
      const queryParams = gStores.globalStore.appShowData.query || {};

      props.value = deQueryForUrl(deQueryForUrl(queryParams));
    }
    console.log(opt, Object.keys(props.value).length, props.value);
    // 扫码进来, 不处理
    if (props.value.q || props.value.qrCode) {
      return;
    }

    const { clinicalType } = props.value;

    if (
      clinicalType &&
      gStores.globalStore.sysCode === '1001035' &&
      !['3', '4', '6'].includes(clinicalType)
    ) {
      props.value.clinicalType = undefined;
    }

    useDoctorDetail = new UseDoctorDetail(props.value);
    init();
  });
</script>

<style lang="scss" scoped>
  .g-page {
    background-color: var(--hr-neutral-color-1);

    .href-content {
      background-color: #fff;
    }
  }

  .header-bg {
    width: 100%;
    position: absolute;
    z-index: 1;
  }

  .content-box {
    // padding: 0 32rpx;
    background-color: #fff;
    box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.06);
    border-radius: 8px;

    &.header-content-box {
      height: calc(100% - 500rpx);
    }

    .content-sel-date {
      padding: 8rpx 16rpx;
    }
  }

  .content {
    position: relative;
    z-index: 2;
    padding: 0 32rpx;
  }

  .header-box {
    margin-bottom: 56rpx;
    .header-transform {
      position: relative;

      transform: translateY(-50rpx);
    }

    .header {
      padding: 0 32rpx;
      position: relative;
      z-index: 2;
      align-items: flex-start;
      position: relative;

      .doc-avatar {
        width: 136rpx;
        height: 136rpx;
        border-radius: 50%;
        overflow: hidden;
        background-color: #fff;
      }
      .CPC-icon {
        width: 156rpx;
        height: 50rpx;
        position: absolute;
        bottom: -25rpx;
        transform: translate(-10rpx, 0px);
      }
      .CPC-icon1 {
        position: absolute;
        width: 60rpx;
        height: 60rpx; 
        bottom: 0;
        left: 130rpx;
      }

      .header-btn {
        margin-top: 20rpx;
        button {
          &:not(:last-child) {
            margin-right: 16rpx;
          }
        }
      }
    }

    &::before {
      content: '';
      display: block;
      width: 100%;
      height: 88rpx;
      background-color: transparent;
    }

    .doc-goodat {
      align-items: flex-start;
      transform: translateY(24rpx);
      .doc-major-goodat {
        width: 60rpx;
        position: relative;
        top: 5rpx;
        // #ifdef  MP-WEIXIN
        top: 8rpx;
        // #endif
      }
      .clinicTime-content {
        -webkit-line-clamp: 1;
        flex: 1;
      }
      .doc-goodat-content {
        -webkit-line-clamp: 2;
        flex: 1;

        .doc-show-intro {
          position: absolute;
          right: 32rpx;
          bottom: 0;
          z-index: 2;
          display: flex;
          padding-left: 1.5em;
          align-items: center;
          justify-content: flex-end;
          background: linear-gradient(
            270deg,
            #fff 0,
            #fff 80%,
            rgba(255, 255, 255, 0.3) 100%
          );
        }
      }
    }
  }

  .share-btn {
    background-color: var(--hr-brand-color-3-light);
    margin-left: 12rpx;
  }

  .label-mark {
    position: relative;
    left: -10rpx;
    z-index: 2;

    .label-mark-content {
      padding: 7rpx 24rpx;
      border-radius: 8px 40px 40px 4px;
      background-color: #22c5ae;
    }

    &::after {
      content: '';
      display: block;
      width: 13rpx;
      height: 13rpx;
      position: relative;
      top: 5rpx;
      z-index: 1;
      background: linear-gradient(
        -135deg,
        #108f7d,
        #108f7d 50%,
        transparent 50%,
        transparent 100%
      );
    }
  }

  .service-content {
    width: 100%;
  }

  .empty-list {
    transform: translateY(10rpx);
    padding: 20rpx 0;
  }

  .iconfont {
    font-weight: normal;
  }

  .table-content {
    background-color: #fff;
    margin: 0 32rpx;

    .category-icon {
      border-radius: 999px;
      background-color: #22c4ad;
      width: 40rpx;
      height: 40rpx;
      color: #fff;
      margin-right: 8rpx;
      position: relative;
      top: -2rpx;

      &.bg-yellow {
        background-color: var(--hr-warning-color-6);
      }
    }
  }

  .doc-comment {
    // border-top: var(--hr-neutral-color-1) solid 16rpx;
    margin-top: 16rpx;
    background-color: #fff;
  }

  .system-mode-old {
    .doc-goodat {
      .doc-major-goodat {
        width: 70rpx;
        position: relative;
        top: 5rpx;
        // #ifdef  MP-WEIXIN
        top: 8rpx;
        // #endif
      }
    }
  }

  .work-place {
    flex-wrap: wrap;
  }
  .tag {
    background: #dcad6c;
    border-radius: 4rpx;
    padding: 0 4rpx;
    line-height: 42rpx;
  }
  .tags {
    background: var(--hr-brand-color-6);
    border-radius: 4rpx;
    padding: 0 4rpx;
    // line-height: 42rpx;
  }
</style>
