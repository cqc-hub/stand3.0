<template>
  <view class="progress">
    <view
      v-for="(item, i) in list"
      :key="i"
      :class="{
        pb24: i !== list.length - 1,
      }"
      class="progress-item relative"
    >
      <view v-if="i !== list.length - 1" class="progress-line" />

      <view class="flex">
        <view
          :class="{
            ['bg-blue']: isActive(item),
          }"
          class="progress-number flex items-center justify-center relative f26 color-fff mr12"
        >
          {{ list.length - i }}
        </view>

        <view class="flex-1">
          <!-- :open="isActive(item)" -->
          <g-collapse ref="collapseRef" :border="false" open>
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
                  <view class="f40">{{ item.title }}</view>
                  <view class="flex-1"></view>
                  <view
                    v-if="item.completionStatus === 1"
                    class="mr60 absolute tag-status"
                  >
                    <Tag-Status
                      color="#B0F0DF"
                      text-color="#00B39E"
                      text="已完成"
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
                  v-if="item.reportPlace"
                  class="g-break-word f28 color-warn"
                >
                  {{ item.reportPlace }}
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

                    <view
                      v-for="col in drugCol"
                      :key="col.key"
                      :style="{
                        'background-image':
                          (col.key === 'itemAddress' &&
                            `url(${
                              globalGl.BASE_IMG + 'stand3-guide-location-bg.png'
                            })`) ||
                          '',
                      }"
                      :class="{
                        'address-content': col.key === 'itemAddress',
                      }"
                    >
                      <view class="flex justify-start relative">
                        <view class="color-888 mr16 text-no-wrap label">
                          {{ col.label }}
                        </view>

                        <view
                          class="g-break-word relative flex flex-between items-start flex-1 row-value"
                        >
                          <view class="flex-1">
                            {{ drug[col.key] }}
                          </view>

                          <text
                            v-if="col.key === 'itemAddress'"
                            class="text-no-wrap color-blue mr12 location-tip"
                          >
                            带我去
                          </text>
                        </view>
                      </view>
                    </view>

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

                    <view class="pt24 pb24">
                      <view class="g-border-bottom flex flex-wrap">
                        <view
                          v-for="(s, si) in reportStatusMap"
                          :key="s.value"
                          :class="{
                            '': si !== reportStatusMap.length,
                            [(s.value === lab.status && 'color-blue') ||
                            'color-111']: 1,
                          }"
                          class="flex f32 font-semibold"
                        >
                          <view
                            :class="{
                              'active-report': s.value === lab.status,
                            }"
                            class="relative pb12"
                          >
                            {{ s.label }}
                          </view>
                          <view v-if="si !== reportStatusMap.length - 1">
                            <img
                              :src="globalGl.BASE_IMG + 'guide-arrow-right.png'"
                              alt=""
                              class="icon-arrow-1"
                            />
                          </view>
                        </view>
                      </view>
                    </view>

                    <view v-for="col in reportCol" :key="col.key">
                      <view
                        v-if="lab[col.key] ?? undefined !== undefined"
                        :style="{
                          'background-image':
                            (col.key === 'itemAddress' &&
                              `url(${
                                globalGl.BASE_IMG +
                                'stand3-guide-location-bg.png'
                              })`) ||
                            '',
                        }"
                        :class="{
                          'address-content': col.key === 'itemAddress',
                        }"
                      >
                        <view class="flex justify-start relative">
                          <view class="color-888 mr16 text-no-wrap label">
                            {{ col.label }}
                          </view>

                          <view
                            class="g-break-word relative flex flex-between items-start flex-1 row-value"
                          >
                            <view class="flex-1">
                              {{ lab[col.key] }}
                            </view>

                            <text
                              v-if="col.key === 'itemAddress'"
                              class="text-no-wrap color-blue mr12 location-tip"
                            >
                              带我去
                            </text>
                          </view>
                        </view>
                      </view>
                    </view>

                    <view
                      :class="{
                        'btn-disabled': lab.status !== '4',
                      }"
                      class="btn btn-border btn-primary btn-round f28 mt24"
                      @click="goReport(lab)"
                    >
                      查看报告
                    </view>

                    <view
                      v-if="p !== item.labs.length - 1"
                      class="drug-placeholder mb24 mt24"
                    />
                  </view>
                </view>
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

                    <view class="pt24 pb24">
                      <view class="g-border-bottom flex flex-wrap">
                        <view
                          v-for="(s, si) in reportStatusMap"
                          :key="s.value"
                          :class="{
                            '': si !== reportStatusMap.length,
                            [(s.value === lab.status && 'color-blue') ||
                            'color-111']: 1,
                          }"
                          class="flex f32 font-semibold"
                        >
                          <view
                            :class="{
                              'active-report': s.value === lab.status,
                            }"
                            class="relative pb12"
                          >
                            {{ s.label }}
                          </view>
                          <view v-if="si !== reportStatusMap.length - 1">
                            <img
                              :src="globalGl.BASE_IMG + 'guide-arrow-right.png'"
                              alt=""
                              class="icon-arrow-1"
                            />
                          </view>
                        </view>
                      </view>
                    </view>

                    <view v-for="col in reportCol" :key="col.key">
                      <view
                        v-if="lab[col.key] ?? undefined !== undefined"
                        :style="{
                          'background-image':
                            (col.key === 'itemAddress' &&
                              `url(${
                                globalGl.BASE_IMG +
                                'stand3-guide-location-bg.png'
                              })`) ||
                            '',
                        }"
                        :class="{
                          'address-content': col.key === 'itemAddress',
                        }"
                      >
                        <view class="flex justify-start relative">
                          <view class="color-888 mr16 text-no-wrap label">
                            {{ col.label }}
                          </view>

                          <view
                            class="g-break-word relative flex flex-between items-start flex-1 row-value"
                          >
                            <view class="flex-1">
                              {{ lab[col.key] }}
                            </view>

                            <text
                              v-if="col.key === 'itemAddress'"
                              class="text-no-wrap color-blue mr12 location-tip"
                            >
                              带我去
                            </text>
                          </view>
                        </view>
                      </view>
                    </view>

                    <view
                      v-if="p !== item.exams.length - 1"
                      class="drug-placeholder mb24 mt24"
                    />
                  </view>
                </view>
              </view>

              <view v-else>
                <view
                  v-for="col in column"
                  :key="col.key"
                  :class="{
                    'address-content': col.key === 'address',
                  }"
                  :style="{
                    'background-image':
                      (col.key === 'address' &&
                        `url(${
                          globalGl.BASE_IMG + 'stand3-guide-location-bg.png'
                        })`) ||
                      '',
                  }"
                >
                  <view
                    v-if="item[col.key]"
                    class="flex justify-start relative"
                  >
                    <view class="color-888 mr16 text-no-wrap label">
                      {{ col.label }}
                    </view>
                    <view
                      class="g-break-word relative flex flex-between items-start"
                    >
                      <text class="">
                        {{ item[col.key] || '' }}
                      </text>

                      <text
                        v-if="col.key === 'address'"
                        class="text-no-wrap color-blue mr12 location-tip"
                      >
                        带我去
                      </text>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </g-collapse>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { watch, ref } from 'vue';
  import TagStatus from './TagStatus.vue';
  import globalGl from '@/config/global';
  import { TVisitInfo } from '../guide';

  const props = withDefaults(
    defineProps<{
      list: TVisitInfo[];
    }>(),
    {
      list: () => [],
    }
  );

  const isActive = (item) => {
    return item.completionStatus === 0;
  };

  const column = ref([
    {
      label: '院区',
      key: 'hosName',
    },
    {
      label: '科室号别',
      key: 'deptName',
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
      key: 'address',
    },
  ]);

  const drugCol = ref([
    {
      label: '执行科室',
      key: 'billDeptName',
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

  const reportStatusMap = ref([
    {
      label: '待预约',
      value: '1',
    },
    {
      label: '待检查',
      value: '2',
    },
    {
      label: '等待报告',
      value: '3',
    },
    {
      label: '已出报告',
      value: '4',
    },
  ]);

  const reportCol = ref([
    {
      label: '等待人数',
      key: 'beforeNum',
    },
    {
      label: '当前叫号',
      key: 'curNo',
    },
    {
      label: '执行科室',
      key: 'billDeptName',
    },
    {
      label: '预约时间',
      key: 'itemTime',
    },
    {
      label: '报告地点',
      key: 'reportPlace',
    },
    {
      label: '地址',
      key: 'itemAddress',
    },
    {
      label: '注意事项',
      key: 'remark',
    },
  ]);

  const goReport = (item) => {
    console.log(item);
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

  .icon-arrow-1 {
    width: 40rpx;
    height: 40rpx;
    padding: 0 6rpx;
  }

  .active-report {
    &::after {
      content: '';
      display: block;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 4rpx;
      background: #296fff;
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
      bottom: -40rpx;
      left: 20rpx;
      width: 1rpx;
      border-left: 1px dashed #cccccc;
      z-index: 0;
    }
  }

  .collapse-header {
    border: 0.5px solid #e6e6e6;

    &.collapse-unfinished {
      background: linear-gradient(180deg, #e9f0ff, #ffffff);
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

  .row {
    min-height: 72rpx;

    .label {
      width: 4em;
      padding: 16rpx 0;
    }

    .row-value {
      // line-height: 1em;
      padding: 16rpx 0;
    }

    .address-content {
      background-position: top right;
      background-repeat: no-repeat;
      background-size: auto 72rpx;
      line-height: 72rpx;
      .row-value,
      .label {
        padding: 0;
      }
    }
  }

  .location-bg {
    height: 72rpx;
    position: absolute;
    right: 0;
  }

  .location-tip {
    margin-left: 2em;
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
