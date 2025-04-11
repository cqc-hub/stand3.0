<template>
  <view
    :class="{
      'system-mode-old': gStores.globalStore.modeOld,
    }"
    class="g-page"
  >
    <scroll-view class="g-container" scroll-y>
      <view class="href-content">
        <image
          :src="$global.BASE_IMG + 'v3_doctor_card_top.png'"
          mode="widthFix"
          class="header-bg my-disabled"
        />
        <view class="content">
          <view class="header-box f28">
            <view class="content-box header-content-box g-border">
              <view class="header-transform">
                <view class="header mb16 flex-between">
                  <image
                    :src="headerBg"
                    @click="previewImg"
                    mode="aspectFill"
                    class="doc-avatar g-border"
                  />

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
                    <view class="doc-name mr24 f48 g-bold text-no-wrap">
                      <text class="text-ellipsis">{{ docDetail.docName }}</text>
                    </view>

                    <view
                      :class="{
                        'g-split-line': docDetail.docJobName,
                      }"
                      class="color-444 mr12 pr12 text-no-wrap"
                    >
                      {{ docDetail.docJobName || '' }}
                    </view>
                    <view class="color-444 text-no-wrap">
                      {{ props.docTitleName || docDetail.docTitleName || '' }}
                    </view>
                  </view>

                  <view class="mt12">
                    <text
                      :class="{
                        'g-split-line':
                          docDetail.deptName && pageConfig.orderMode !== '1',
                      }"
                      class="color-444 mr12 pr12"
                    >
                      <!-- {{ $global.systemInfo.name || '' }} -->
                      {{ docDetail.hosName || '' }}
                    </text>

                    <text v-if="pageConfig.orderMode !== '1'" class="color-444">
                      {{ docDetail.deptName || '' }}
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
                </view>

                <view class="flex-normal p32c doc-goodat">
                  <image
                    v-if="docDetail.goodAt"
                    :src="$global.BASE_IMG + 'v3_doctor_card_major.png'"
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
              <view class="text-no-wrap mr32">门诊排班</view>
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
              <template v-if="!isMultHosDoc">
                <view
                  v-if="docSchList.length"
                  class="content-sel-date mb16 g-border-bottom"
                >
                  <Order-Sel-Date
                    :value="checkedDay"
                    :choose-days="chooseDays"
                    :enable-days="enabledDays"
                    @change="dateChange"
                  />
                </view>

                <block v-if="docSchList.length">
                  <block v-if="Object.keys(schToday.schByHos).length">
                    <view v-if="isShowHosNet">
                      <text class="label-mark">
                        <text class="color-fff f28 label-mark-content">
                          到院就诊
                        </text>
                      </text>
                    </view>

                    <view
                      v-for="_hosId in Object.keys(schToday.schByHos)"
                      :key="_hosId"
                      class="p32c mt12"
                    >
                      <view
                        v-for="(item, idx) in schToday.schByHos[_hosId]"
                        :key="item.schId"
                      >
                        <view v-if="!idx" class="f32 g-bold mb16">
                          {{ item.hosName }}
                        </view>

                        <view
                          :class="{
                            mb32: idx === schToday.schByHos[_hosId].length - 1,
                          }"
                          class="sch-item mb8 animate__animated animate__fadeIn"
                        >
                          <Doc-Sch-Item
                            :pageConfig="pageConfig"
                            :patient="pageConfig.isOrderWithoutPat !== '1'"
                            :item="item"
                            :systemModeOld="gStores.globalStore.modeOld"
                            @reg-click="(scheme) => regClick({ scheme })"
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
              <template v-else>
                <view
                  class="tabs pl16 pr16 mb16"
                  v-if="docHosSchList.length"
                  style="width:100%"
                >
                  <g-tabs
                    v-model:value="tabCurrent"
                    :tabs="docHosSchList"
                    :scroll="true"
                    field="hosName"
                    @change="tabChange"
                  />
                </view>
                <swiper
                  v-if="docHosSchList.length"
                  :current="tabCurrent"
                  :duration="300"
                  @change="({ detail: { current } }) => tabChange(current)"
                  :style="{ height: `${docHosSchHeight}px` }"
                >
                  <swiper-item
                    v-for="(hosItem, hosIndex) in docHosSchList"
                    :key="`docHosSchList${hosIndex}`"
                  >
                    <view
                      class="doc-hos-sch-list"
                      :id="`doc-hos-sch-list${hosIndex}`"
                    >
                      <view
                        v-if="hosItem.schList.length"
                        class="content-sel-date mb16 g-border-bottom"
                      >
                        <Order-Sel-Date
                          :value="hosItem.checkedDay"
                          :choose-days="hosItem.chooseDays"
                          :enable-days="hosItem.enabledDays"
                          @change="dateChange"
                        />
                      </view>
                      <block v-if="docHosSchList.length">
                        <block
                          v-if="
                            Object.keys(schHosToday(hosItem).schByHos).length
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
                              schHosToday(hosItem).schByHos
                            )"
                            :key="_hosId"
                            class="p32c mt12"
                          >
                            <view
                              v-for="(item, idx) in schHosToday(hosItem)
                                .schByHos[_hosId]"
                              :key="item.schId"
                            >
                              <view v-if="!idx" class="f32 g-bold mb16">
                                {{ item.hosName }}
                              </view>

                              <view
                                :class="{
                                  mb32:
                                    idx ===
                                    schHosToday(hosItem).schByHos[_hosId]
                                      .length -
                                      1,
                                }"
                                class="sch-item mb8 animate__animated animate__fadeIn"
                              >
                                <Doc-Sch-Item
                                  :pageConfig="pageConfig"
                                  :patient="
                                    pageConfig.isOrderWithoutPat !== '1'
                                  "
                                  :item="item"
                                  :systemModeOld="gStores.globalStore.modeOld"
                                  @reg-click="
                                    (scheme) => {
                                      chooseDays = hosItem.chooseDays;
                                      regClick({ scheme });
                                    }
                                  "
                                  @wait-reg-click="showWaitRegDialog"
                                />
                              </view>
                            </view>
                          </view>
                        </block>

                        <block
                          v-if="
                            Object.keys(schHosToday(hosItem).schByNetHos).length
                          "
                        >
                          <view class="animate__animated animate__fadeIn">
                            <view>
                              <text class="label-mark mb8">
                                <text class="color-fff f28 label-mark-content">
                                  网络就诊
                                </text>
                              </text>
                            </view>

                            <view
                              v-for="_hosId in Object.keys(
                                schHosToday(hosItem).schByNetHos
                              )"
                              :key="_hosId"
                              class="p32c mt12"
                            >
                              <view
                                v-for="(item, idx) in schHosToday(hosItem)
                                  .schByNetHos[_hosId]"
                                :key="item.schId"
                              >
                                <view v-if="!idx" class="f36 g-bold mb16">
                                  {{ item.hosName }}
                                </view>

                                <view
                                  :class="{
                                    mb32:
                                      idx ===
                                      schToday.schByHos[_hosId].length - 1,
                                  }"
                                  class="sch-item mb8"
                                >
                                  <Doc-Sch-Item
                                    :pageConfig="pageConfig"
                                    :patient="
                                      pageConfig.isOrderWithoutPat !== '1'
                                    "
                                    :item="item"
                                    :systemModeOld="gStores.globalStore.modeOld"
                                    @reg-click="
                                      (data) => {
                                        chooseDays = hosItem.chooseDays;
                                        chooseDays;
                                        regClick(data);
                                      }
                                    "
                                    @wait-reg-click="showWaitRegDialog"
                                  />
                                </view>
                              </view>
                            </view>
                          </view>
                        </block>
                      </block>
                    </view>
                  </swiper-item>
                </swiper>
                <view
                  class="empty-list"
                  v-else-if="isComplete && !docHosSchList.length"
                >
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

        <block v-if="isDocServiceShow">
          <view class="f36 g-bold mb16 service-onlione p32c">在线服务</view>
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
      :headerIcon="$global.BASE_IMG + 'v3-order-reg-confirm-add.png'"
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

    <Doc-Share :pageProp="props" :detail="docDetail" ref="refDocShare" />

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
  import { deQueryForUrl, joinQuery } from '@/common';
  import {
    previewImage,
    GStores,
    ServerStaticData,
    type ISystemConfig,
    useTBanner,
    throughCharacterLineFeed,
  } from '@/utils';
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
  const waitRegClickData = ref({} as { scheme: TSchInfo });
  const waitRegDialog = ref<any>('');
  const docHosSchHeight = ref(100);
  const isMultHosDoc = ref(false);

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
  } = useOrder(props as any);
  const regDialogConfirm = ref<any>('');

  const docDetail = ref(<IDocDetail>{
    docName: props.value.docName,
    deptName: props.value.deptName,
  });
  const tabCurrent = ref(0);

  const headerBg = computed(() => {
    return (
      docDetail.value.docPhoto || '/static/image/order/order-doctor-avatar.png'
    );
  });

  const showWaitRegDialog = async (data) => {
    const {
      ampm,
      categor,
      clinicalType,
      hosDocId,
      docName,
      hosId,
      schDate,
      schId,
      addedNum,
    } = data.scheme;
    let query: any = {
      ampm,
      categor,
      clinicalType,
      hosDocId,
      docName,
      hosId,
      schDate,
      schId,
    };
    orderConfig.value.isOpenAddedNum === '1' && (query.addedNum = addedNum);
    const { result } = await api.canRegAlternate(query);
    if (result) {
      waitRegClickData.value = data;
      waitRegDialog.value.show();
    } else {
      gStores.messageStore.showMessage(
        '当前时段候补人数已达上限，暂不支持候补!',
        3000
      );
    }
  };

  const previewImg = () => {
    const photo = docDetail.value.docPhoto;
    if (photo) {
      previewImage([photo]);
    }
  };

  const dateChange = (item: IChooseDays) => {
    if (isMultHosDoc.value) {
      docHosSchList.value[tabCurrent.value].checkedDay = item.fullDay;
      getdocHosSchHeight();
    }
    checkedDay.value = item.fullDay;
  };

  const getSchData = async () => {
    isComplete.value = false;
    const { schList, enabledDays: _enabledDays } = await useDoctorDetail
      .getDocSch()
      .finally(() => {
        isComplete.value = true;
      });

    if (schList.length) {
      checkedDay.value = schList[0].schDate;
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
        getdocHosSchHeight();
      }
    }

    enabledDays.value = _enabledDays;
    filterChooseDays();
  };
  const inst = getCurrentInstance();
  const getdocHosSchHeight = () => {
    nextTick(() => {
      const query = uni.createSelectorQuery().in(inst);
      query
        .selectAll(`#doc-hos-sch-list${tabCurrent.value}`)
        .boundingClientRect((data: any) => {
          if (data) {
            console.log(data, 'docHosSchHeight');
            docHosSchHeight.value = data[0].height;
          }
        })
        .exec();
    });
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

  let tabChange = (idx: number) => {
    tabCurrent.value = idx;
    getdocHosSchHeight();
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

    // docPhoto ||= globalGl.BASE_IMG + 'order-doctor-avatar.png';

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
          // 复诊开药
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

  const init = async () => {
    await getPageConfig();
    await OrderInit();
    await getDocDetail();
    getSchData();

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

    if (isOpenDocCardOnlineService === '1') {
      getDocService();
    }

    // #ifdef MP-ALIPAY
    if (isOpenDocCardOnlineServiceAlipay === '1') {
      getDocService();
    }
    // #endif

    if (isOpenOutHosSch === '1') {
      docSchOutHosList.value = await useDoctorDetail.getOutHosSchData();
    }
  };

  onShareAppMessage((res) => {
    return {
      title: `${docDetail.value.docName}医生`,
      path: joinQuery('/pagesA/MyRegistration/DoctorDetails', props.value),
    };
  });

  onLoad(async (opt) => {
    //  weixin://dl/business/?t=LgnSWxNLRHs

    props.value = deQueryForUrl(deQueryForUrl(opt));
    // 兼容 alipays://platformapi/startapp?appId=2021003173633521&page=pagesA/MyRegistration/DoctorDetails&query=hosDocId%3D101714
    if (!Object.keys(props.value).length) {
      const queryParams = gStores.globalStore.appShowData.query || {};

      props.value = deQueryForUrl(deQueryForUrl(queryParams));
    }
    // 扫码进来, 不处理
    if (props.value.q) {
      return;
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

      .doc-avatar {
        width: 136rpx;
        height: 136rpx;
        border-radius: 50%;
        overflow: hidden;
        background-color: #fff;
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

  .service-onlione {
    margin-top: 56rpx;
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
    .tag {
      background: #dcad6c;
      border-radius: 4rpx;
      padding: 0 4rpx;
      line-height: 42rpx;
    }
    flex-wrap: wrap;
  }
</style>
