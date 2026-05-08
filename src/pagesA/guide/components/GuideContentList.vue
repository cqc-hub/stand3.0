<template>
  <view class="progress relative">
    <view class="my-hide f24">占位</view>

    <view
      v-for="(item, i) in list"
      :key="i"
      :class="{
        pb24: i !== list.length - 1,
      }"
      class="progress-item"
    >
      <view v-if="i !== list.length - 1" class="progress-line" />

      <view class="flex">
        <view
          :class="{
            ['bg-blue']: isActive(item),
          }"
          class="progress-number z-1 flex items-center justify-center relative f26 color-fff mr12"
        >
          {{ list.length - i }}
        </view>
        <view class="flex-1">
          <g-collapse
            :open="isActive(item)"
            @change="(v) => emits('collapse-change', v)"
            ref="collapseRef"
            :border="false"
          >
            <template #header="{ isShow: arrowBottom }">
              <view
                :class="{
                  'collapse-header-open': arrowBottom,
                  'collapse-header-close': !arrowBottom,
                  'collapse-unfinished': isActive(item),
                }"
                class="pl24 pr24 pt32 pb32 bg-white animate__animated relative collapse-header"
              >
                <view class="flex items-center">
                  <view class="f40">{{ getNodeTitle(item) }}</view>
                  <view class="flex-1"></view>
                  <!-- v-if="item.completionStatus === 1" -->
                  <!-- v-if="item.title !== '门诊缴费'" -->
                  <view class="mr60 absolute tag-status">
                    <Tag-Status
                      :color="
                        item.completionStatus === 1 ? '#B0F0DF' : '#ffb5a5'
                      "
                      :text-color="
                        item.completionStatus === 1 ? '#00B39E' : '#d23028'
                      "
                      :text="item.completionStatus === 1 ? '已完成' : '未完成'"
                    />
                  </view>
                  <view
                    :class="{
                      arrowBottom,
                    }"
                    class="iconfont right-icon color-888 f48"
                  >
                    &#xe6c8;
                  </view>
                </view>

                <view
                  v-if="getItemTip(item)"
                  class="g-break-word f28 color-warn mt12"
                >
                  {{ getItemTip(item) }}
                </view>
              </view>
            </template>

            <view class="bg-white pr24 pl24 pt24 pb24 collapse-content f28 row">
              <view v-if="item.title === '门诊取药'" class="">
                <view v-if="item.drugs && item.drugs.length">
                  <view
                    v-for="(drug, p) in item.drugs"
                    :key="p"
                    class="relative"
                  >
                    <view class="f32 font-semibold">
                      <text>{{ p + 1 }}</text>
                      <text>
                        {{ drug.itemName }}
                      </text>
                    </view>

                    <GuideContentListCol
                      :cols="drugCol"
                      :lab="drug"
                      @go-address-map="
                        (e) =>
                          handlerAddressMap({
                            ...item,
                            ...e,
                          })
                      "
                    />

                    <GuideBtns
                      :item="item"
                      :lab="drug"
                      :btns="takeDrugBtns"
                      @btn-click="(v) => emits('btn-click', v)"
                    />

                    <view
                      v-if="p !== item.drugs.length - 1"
                      class="drug-placeholder mb24 mt24"
                    />
                  </view>
                </view>
              </view>

              <view v-else-if="item.title === '检验项目'">
                <view v-if="item.labs && item.labs.length">
                  <view v-for="(lab, p) in item.labs" :key="p" class="relative">
                    <view class="flex justify-between">
                      <text class="f32 font-semibold">
                        {{ lab.itemName }}
                      </text>
                    </view>

                    <view class="flex flex-wrap d-tag-container">
                      <view class="flex-1"></view>
                      <text
                        v-if="lab.isEmptyStomach === '1'"
                        class="d-tag bg-danger f28 mt12"
                      >
                        空腹检查
                      </text>
                      <text
                        v-if="lab.appointIndicator === '1'"
                        class="d-tag bg-blue f28 mt12"
                      >
                        需要预约
                      </text>
                      <text
                        v-if="lab.isDeptStorage === '1'"
                        class="d-tag bg-green f28 mt12"
                      >
                        科室药柜
                      </text>
                    </view>

                    <view v-if="lab.status" class="pt24 pb24">
                      <GuideReportProgress :lab="lab" type="jy" />
                    </view>

                    <GuideContentListCol
                      :cols="reportJyCol"
                      :lab="lab"
                      @go-address-map="
                        (e) =>
                          handlerAddressMap({
                            ...item,
                            ...e,
                          })
                      "
                    />

                    <GuideBtns
                      :item="item"
                      :lab="lab"
                      :btns="jyBtns"
                      @btn-click="(v) => emits('btn-click', v)"
                    />

                    <view
                      v-if="p !== item.labs.length - 1"
                      class="drug-placeholder mb24 mt24"
                    />
                  </view>
                </view>

                <!-- 'btn-disabled': item.completionStatus === 0, -->
              </view>

              <view v-else-if="item.title === '检查项目'">
                <view v-if="item.exams && item.exams.length">
                  <view
                    v-for="(lab, p) in item.exams"
                    :key="p"
                    class="relative"
                  >
                    <view class="flex justify-between">
                      <text class="f32 font-semibold">
                        {{ lab.itemName }}
                      </text>
                    </view>

                    <view class="flex flex-wrap d-tag-container">
                      <view class="flex-1"></view>
                      <text
                        v-if="lab.isEmptyStomach === '1'"
                        class="d-tag bg-danger f28 mt12"
                      >
                        空腹检查
                      </text>
                      <text
                        v-if="lab.appointIndicator === '1'"
                        class="d-tag bg-blue f28 mt12"
                      >
                        需要预约
                      </text>
                      <text
                        v-if="lab.isDeptStorage === '1'"
                        class="d-tag bg-green f28 mt12"
                      >
                        科室药柜
                      </text>
                    </view>

                    <view v-if="lab.status" class="pt24 pb24">
                      <GuideReportProgress :lab="lab" />
                    </view>

                    <GuideContentListCol
                      :cols="reportJcCol"
                      :lab="lab"
                      @go-address-map="
                        (e) =>
                          handlerAddressMap({
                            ...item,
                            ...e,
                          })
                      "
                    />

                    <GuideBtns
                      :item="item"
                      :lab="lab"
                      :btns="jcBtns"
                      @btn-click="(v) => emits('btn-click', v)"
                    />

                    <view
                      v-if="p !== item.exams.length - 1"
                      class="drug-placeholder mb24 mt24"
                    />
                  </view>

                  <!-- 'btn-disabled': item.completionStatus === 0, -->
                </view>
              </view>

              <view v-else-if="item.title === '其他项目'">
                <view v-if="item.others && item.others.length">
                  <view
                    v-for="(lab, p) in item.others"
                    :key="p"
                    class="relative"
                  >
                    <view class="flex justify-between">
                      <text class="f32 font-semibold">
                        {{ lab.itemName }}
                      </text>
                    </view>

                    <GuideContentListCol
                      :cols="reportJcCol"
                      :lab="lab"
                      @go-address-map="
                        (e) =>
                          handlerAddressMap({
                            ...item,
                            ...e,
                          })
                      "
                    />

                    <view
                      v-if="p !== item.others.length - 1"
                      class="drug-placeholder mb24 mt24"
                    />
                  </view>
                </view>
              </view>

              <view v-else-if="item.title === '门诊缴费'">
                <GuideBtns
                  :item="item"
                  :btns="mzjfBtns"
                  @btn-click="(v) => emits('btn-click', v)"
                />
                <!-- <view
                  class="btn btn-border btn-primary btn-round f28 mt24"
                  @click="goPayPage(item)"
                >
                  {{ item.completionStatus === 1 ? '缴费记录' : '门诊缴费' }}
                </view> -->
              </view>

              <view v-else-if="item.title === '门诊就诊'">
                <GuideContentListCol
                  :cols="mzjzCol"
                  :lab="item"
                  @go-address-map="handlerAddressMap"
                />

                <GuideBtns
                  :item="item"
                  :btns="mzjzBtns"
                  @btn-click="(v) => emits('btn-click', v)"
                />

                <view
                  class="btn btn-border color-111 btn-default btn-round f28 mt24"
                  @click="goTakeNumber(item)"
                >
                  叫号查询
                </view>
              </view>

              <view v-else-if="item.title === '门诊取号'">
                <GuideContentListCol
                  :cols="mzqhCol"
                  :lab="item"
                  @click-row="(v) => colRowClick(item, v)"
                  @go-address-map="handlerAddressMap"
                />

                <GuideBtns
                  :item="item"
                  :btns="mzqhBtns"
                  @btn-click="(v) => emits('btn-click', v)"
                />
              </view>

              <view v-else-if="item.title === '诊区签到'">
                <GuideContentListCol
                  :cols="mzqhCol"
                  :lab="item"
                  @click-row="(v) => colRowClick(item, v)"
                  @go-address-map="handlerAddressMap"
                />
                <GuideBtns
                  :item="item"
                  :btns="zqqdBtns"
                  @btn-click="(v) => emits('btn-click', v)"
                />
              </view>

              <view v-else-if="item.title === '复诊签到'">
                <GuideContentListCol
                  :cols="mzqhCol"
                  :lab="item"
                  @click-row="(v) => colRowClick(item, v)"
                  @go-address-map="handlerAddressMap"
                />
              </view>

              <view v-else-if="item.title === '就诊完成'">
                <GuideContentListCol
                  :cols="mzqhCol"
                  :lab="item"
                  @click-row="(v) => colRowClick(item, v)"
                  @go-address-map="handlerAddressMap"
                />
                <GuideBtns
                  :item="item"
                  :btns="jzwcBtns"
                  @btn-click="(v) => emits('btn-click', v)"
                />
              </view>

              <view v-else>暂未实现</view>
            </view>
          </g-collapse>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { watch, ref, computed } from 'vue';
  import TagStatus from './TagStatus.vue';
  import { TVisitInfo } from '../guide';
  import { ApiParamsConfig, TButtonConfig, TGuideButtonConfig } from '@/types';
  import { GStores } from '@/utils';
  import GuideContentListCol from './GuideContentListCol.vue';
  import GuideReportProgress from './GuideReportProgress.vue';
  import GuideBtns from './GuideBtns.vue';

  const props = withDefaults(
    defineProps<{
      list: TVisitInfo[];
      config: ApiParamsConfig['GuideConfig'];
      hideTip?: boolean;
    }>(),
    {
      list: () => [],
    }
  );

  // 为了温附二的特殊需求 要求前两个节点标题展示不一样
  const getNodeTitle = (item) => {
    const gStores = new GStores();
    // 如果 susCode 是 1001067，则修改前两个节点的标题
    if (gStores.globalStore.sysCode === '1001067') {
      if (item.title === '门诊取号') return '挂号信息'; // 第一个节点改为“挂号信息”
      if (item.title === '诊区签到') return '门诊取号'; // 第二个节点改为“门诊取号”
    }
    return item.title; // 其他情况保持原样
  };

  const isActive = (item) => {
    return item.completionStatus === 0;
  };

  const jyBtns = computed(() => {
    return props.config.jyBtns || [];
  });

  const jcBtns = computed(() => {
    return props.config.jcBtns || [];
  });

  // 门诊就诊下面的按钮
  const mzjzBtns = computed(() => {
    return props.config.mzjzBtns || [];
  });

  // 门诊取号下面的按钮
  const mzqhBtns = computed(() => {
    return props.config.mzqhBtns || [];
  });

  // 诊区签到下面的按钮
  const zqqdBtns = computed(() => {
    return props.config.zqqdBtns || [];
  });

  // 门诊取药下面按钮
  const takeDrugBtns = computed(() => {
    return props.config.takeDrugBtns || [];
  });

  // 门诊缴费下面按钮
  const mzjfBtns = computed(() => {
    return props.config.mzjfBtns || [];
    // return [] as TGuideButtonConfig[];
  });
  // 就诊完成下面按钮
  const jzwcBtns = computed(() => {
    return props.config.jzwcBtns || [];
    // return [] as TGuideButtonConfig[];
  });

  const drugCol = ref([
    // {
    //   label: '执行科室',
    //   key: 'billDeptName',
    // },
    {
      label: '执行状态',
      key: '_disposeStatusLabel',
    },
    {
      label: '取药地点',
      key: 'itemAddress',
    },
    {
      label: '提示',
      key: 'reportPlace',
    },
  ]);

  const reportJyCol = ref([
    {
      label: '等待人数',
      key: 'beforeNum',
    },
    {
      label: '当前叫号',
      key: 'curNo',
    },
    {
      label: '执行状态',
      key: '_disposeStatusLabel',
    },
    {
      label: '预约时间',
      key: 'itemTime',
    },
    {
      label: '检验地址',
      key: 'itemAddress',
    },
    {
      label: '注意事项',
      key: 'remark',
    },
    {
      label: '取报告地点',
      key: 'reportPlace',
    },
  ]);

  const reportJcCol = ref([
    {
      label: '等待人数',
      key: 'beforeNum',
    },
    {
      label: '当前叫号',
      key: 'curNo',
    },
    {
      label: '执行状态',
      key: '_disposeStatusLabel',
    },
    {
      label: '预约时间',
      key: 'itemTime',
    },
    {
      label: '检查地址',
      key: 'itemAddress',
    },
    {
      label: '签到号码',
      key: 'no',
    },
    {
      label: '注意事项',
      key: 'remark',
    },
    {
      label: '取报告地点',
      key: 'reportPlace',
    },
  ]);

  const mzjzCol = ref([
    {
      label: '午别',
      key: 'ampm',
    },
    {
      label: '我的序号',
      key: 'no',
    },
    {
      label: '当前叫号',
      key: 'curNo',
    },
    {
      label: '等待人数',
      key: 'beforeNum',
    },
    {
      label: '医生',
      key: 'docName',
    },
    {
      label: '预计等待时间',
      key: 'remainTime',
    },
    {
      label: '就诊状态',
      key: 'statusName',
    },
    {
      label: '就诊地点',
      key: 'site',
    },
  ]);

  const mzqhCol = ref([
    {
      label: '院区',
      key: 'hosName',
    },
    {
      label: '科室号别',
      key: 'categorName',
    },
    {
      label: '预约时间',
      key: 'appointmentTime',
    },
    {
      label: '医生',
      key: 'docName',
    },
    {
      label: '就诊地点',
      key: 'areaName',
    },
  ]);

  // const mzqdCol = ref([

  // ])

  const emits = defineEmits([
    'btn-click',
    'go-report',
    'go-take-number',
    'go-address-map',
    'go-pay-page',
    'open-hos-location',
    'collapse-change',
  ]);

  const colRowClick = (item, { col }) => {
    if (
      ['categorName', 'site', 'areaName', 'hosName'].includes(col.key) &&
      item.hosId
    ) {
      emits('open-hos-location', item);
    }
  };

  const goTakeNumber = (item) => {
    emits('go-take-number', item);
  };

  const handlerAddressMap = (item) => {
    emits('go-address-map', item);
  };

  const goPayPage = (item) => {
    emits('go-pay-page', item);
  };

  const btnClick = ({ btn, item }) => {
    emits('btn-click', {
      btn,
      item,
    });
  };

  const getItemTip = (item: TVisitInfo) => {
    const { config } = props;
    let tip = '';

    if (props.hideTip) {
      return '';
    }

    switch (item.title) {
      case '门诊取药':
        tip = config.tabDrugTip || '';
        break;

      case '复诊签到':
        tip = config.fzqdTip || '如需复诊请去诊区自助机签到就诊！';
        break;

      case '检验项目':
        tip = config.jyTip || '';
        break;

      case '检查项目':
        tip = config.jcTip || '';
        break;

      case '其他项目':
        tip = config.otherTip || '';
        break;

      case '门诊缴费':
        tip = config.mzjfTip || '';
        break;

      case '门诊就诊':
        tip = config.mzjzTip || '';
        break;

      case '门诊取号':
        tip = config.mzqhTip || '';
        break;

      case '诊区签到':
        tip = config.mzqdTip || '';
        break;

      default:
        break;
    }

    return tip;
  };

  const collapseRef = ref(<any>'');
  watch(
    () => props.list,
    () => {
      collapseRef.value &&
        collapseRef.value.map((inst) => {
          inst.init();
        });
    }
  );
</script>

<style lang="scss" scoped>
  $r: 12px;
  .btn-round {
    border-radius: 19px;
  }
  .d-tag-container {
    .d-tag {
      border-radius: 4px;
      padding: 0 6rpx;
      color: #fff;

      &:not(:last-child) {
        margin-right: 12rpx;
      }

      &.bg-warn {
        background: var(--hr-warning-color-6);
      }
      &.bg-green {
        background: var(--hr-success-color-6);
      }
      &.bg-danger {
        background: var(--hr-error-color-6);
      }
    }
  }

  .progress {
    .progress-number {
      position: relative;
      top: 44rpx;
      width: 40rpx;
      height: 40rpx;
      background: #bbbbbb;
      border-radius: 100px;
    }

    .progress-line {
      position: absolute;
      top: 0;
      bottom: 0rpx;
      left: 20rpx;
      width: 1rpx;
      border-left: 1px dashed #cccccc;
      z-index: 0;
    }
  }

  .collapse-header {
    border: 0.5px solid #e6e6e6;

    &.collapse-unfinished {
      background: linear-gradient(180deg, var(--hr-brand-color-1), #ffffff);
      &::before {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        left: 24rpx;
        right: 24rpx;
        height: 2px;
        background-color: var(--hr-brand-color-6);
      }
    }

    &.collapse-header-open {
      border-bottom: none;
      border-radius: $r $r 0 0;
    }

    &.collapse-header-close {
      @keyframes headerCloseAction {
        0% {
          border-radius: $r $r 0 0;
          border-bottom: none;
        }

        100% {
          border-radius: $r;
          border: 0.5px solid #e6e6e6;
        }
      }

      animation-name: headerCloseAction;
      animation-delay: 0.28s;
      animation-duration: 0.3s;
    }
  }

  .collapse-content {
    border: 0.5px solid #e6e6e6;
    border-radius: 0 0 $r $r;
  }

  .right-icon {
    transform: rotate(90deg);
    transition: 0.4s all;
    position: relative;
    // right: 0upx;

    &.arrowBottom {
      transform: rotate(-90deg);
    }
  }

  .tag-status {
    right: 1.5em;
  }

  .drug-placeholder {
    height: 8rpx;
    position: relative;

    &::after {
      content: '';
      height: 100%;
      display: block;
      position: absolute;
      left: -24rpx;
      right: -24rpx;
      background-color: #f6f6f6;
    }
  }
</style>
