<template>
  <view
    :style="{
      '--bg-color': bgColor,
      '--main--color': lineColor,
    }"
    class="item g-border p32 mb16 mt16"
  >
    <view class="g-bold color-111 f32 g-break-word mb26">
      {{ title }}
    </view>

    <view class="color-666 f28">
      <view v-if="item.disposeStatus === '1'">
        <text class="mr12">执行状态:</text>
        <text>{{ '未执行' }}</text>
      </view>

      <view
        v-if="item.remark"
        :class="{
          'ellipsis-line-clamp2': !isShowAllTip && isShowAllTipBtn,
        }"
        :style="{
          'line-height': `${tipLineHeight}rpx`,
        }"
        :id="item.uuid"
        class="g-break-word tip"
      >
        <text class="mr12">注:</text>
        <text>{{ item.remark }}</text>

        <view
          v-if="isShowAllTipBtn && !isShowAllTip"
          @click="isShowAllTip = true"
          class="show-all pl36 color-blue"
        >
          <text>查看全部</text>
          <text class="iconfont">&#xe66b;</text>
        </view>
      </view>

      <view v-if="item.address">
        <text class="mr12">地址:</text>
        <text>{{ item.address }}</text>
      </view>

      <view v-if="item.scheduledDateTime">
        <view>
          <text class="mr12">预约时间:</text>
          <text class="g-bold mr12">{{ item.scheduledDateTime }}</text>
          <text v-if="item.no" class="g-bold mr12">{{ item.no }}号</text>
        </view>

        <view
          v-if="dayjs(item.scheduledDateTime).format('YYYY-MM-DD') === now"
          class="flex-between mt12"
        >
          <view>
            <view class="g-flex-rc-cc color-111 f64 g-bold number-num">
              {{ item.beforeNum || '-' }}
            </view>
            <view class="g-flex-rc-cc f28 color-444">等待人数</view>
          </view>

          <view>
            <view class="g-flex-rc-cc color-111 f64 g-bold number-num">
              {{ item.curNo || '-' }}
            </view>
            <view class="g-flex-rc-cc f28 color-444">当前叫号</view>
          </view>

          <view>
            <view class="g-flex-rc-cc color-yellow f64 g-bold number-num">
              {{ item.no || '-' }}
            </view>
            <view class="g-flex-rc-cc f28 color-444">我的号码</view>
          </view>
        </view>
      </view>

      <view class="mt26">
        <button
          v-for="(btn, i) in showButtons"
          :key="btn.key"
          :class="{
            'btn-first': !i && mainColor !== '#fff',
          }"
          @click="btnAction(item, btn.key)"
          class="mb16 mt26 mr48 ml48 btn-item f26 g-bold flex-normal"
        >
          {{ btn.label }}
        </button>
      </view>
    </view>
  </view>
</template>

<script>
  import dayjs from 'dayjs';
  import { ORDER_CLASS_MAP } from '../utils';
  import { joinQuery } from '@/common';
  import { useTBanner } from '@/utils';
  import { GStores } from '@/utils';
  let buttons = [
    {
      label: '查看报告',
      key: '1',
    },
    {
      label: '用药指导',
      key: '3',
    },
    {
      label: '查看预约',
      key: '4',
    },
    {
      label: '立即预约',
      key: '5',
    },
    {
      label: '院内导航',
      key: '2',
    },
  ];

  export default {
    data() {
      return {
        dayjs,
        isShowAllTip: false,
        isShowAllTipBtn: false,
        tipLineHeight: 40,
        now: dayjs().format('YYYY-MM-DD'),
      };
    },

    props: {
      item: {
        type: Object,
        default: () => ({}),
      },

      mainColor: String,
      bgColor: String,
      btns: {
        type: Array,
        default: () => [{}, {}, {}, {}, {}],
      },
    },

    computed: {
      lineColor({ mainColor }) {
        return mainColor === '#fff' ? '#dddddd' : mainColor;
      },

      showButtons({ item }) {
        const that = this;
        const {
          appointIndicator, // 是否需要预约 0否1是
          disposeStatus, // 1 未执行 2部分执行 3已执行
          isAppoint, // 是否已预约 0否1是
          orderClass, // 1药品 2检验 3检查
          performDeptCode, // 执行科室代码
        } = item;
        const btnShows = {
          // 立即预约
          5() {
            if (
              !that.btns[3] ||
              JSON.stringify(that.btns[3]) === '{}' ||
              that.btns[4]?.path === ''
            ) {
              return;
            }
            // 未执行的需要预约的检查
            if (
              appointIndicator === '1' &&
              disposeStatus === '1' &&
              isAppoint === '0' &&
              orderClass === '3'
            ) {
              return true;
            }
          },

          // 查看预约
          4() {
            if (
              !that.btns[3] ||
              JSON.stringify(that.btns[3]) === '{}' ||
              that.btns[3]?.path === ''
            ) {
              return;
            }
            if (appointIndicator === '1' && ['2', '3'].includes(orderClass)) {
              if (isAppoint === '1' && ['2', '3'].includes(disposeStatus)) {
                return true;
              }
            }
          },

          // 查看报告
          1() {
            if (
              !that.btns[0] ||
              JSON.stringify(that.btns[0]) === '{}' ||
              that.btns[0]?.path === ''
            ) {
              return;
            }
            if (['2', '3'].includes(orderClass)) {
              if (['2', '3'].includes(disposeStatus)) {
                return true;
              }
            }
          },

          // 用药指导
          3() {
            if (
              !that.btns[2] ||
              JSON.stringify(that.btns[2]) === '{}' ||
              that.btns[2]?.path === ''
            ) {
              return;
            }
            // 西药、中药、成药
            if (orderClass === '1') {
              if (['2', '3'].includes(disposeStatus)) {
                return true;
              }
            }
          },

          // 院内导航
          2() {
            if (
              !that.btns[1] ||
              JSON.stringify(that.btns[1]) === '{}' ||
              that.btns[1]?.path === ''
            ) {
              return;
            }
            if (performDeptCode) {
              return true;
            }
          },
        };
        if (that.btns.length > 5) {
          buttons = [
                {
                  label: '查看报告',
                  key: '1',
                },
                {
                  label: '用药指导',
                  key: '3',
                },
                {
                  label: '查看预约',
                  key: '4',
                },
                {
                  label: '立即预约',
                  key: '5',
                },
                {
                  label: '院内导航',
                  key: '2',
                },
              ];
          Object.entries(this.btns).forEach(([k, v], i) => {
            if (i >= 5) {
              btnShows[k*1 + 1] = () => {
                let flag = true;
                Object.entries(v).forEach(([k2, v2]) => {
                  console.log('buttons',item,k2,item[k2] , v2)
                  if (item[k2] != v2) {
                    flag = undefined;
                  }
                });
                return flag;
              };
              
              buttons.push({
                key: k*1 + 1,
                label: v.text,
              });
            }
          });
         
        }

        return buttons.filter(({ key }) => {
          return btnShows[key] && btnShows[key]();
        });
      },

      title({ item }) {
        const types = [ORDER_CLASS_MAP[item.orderClass]];
        if (item.isEmptyStomach === '1') {
          types.push('需要空腹');
        }

        const str = types.join(',');

        return `${item.itemName}` + (str && `(${str})`);
      },
    },

    mounted() {
      setTimeout(() => {
        if (this.item.remark) {
          uni
            .createSelectorQuery()
            .in(this)
            .select(`#${this.item.uuid}`)
            .boundingClientRect((rect) => {
              const lineHeight = parseInt(
                rect.height / uni.upx2px(this.tipLineHeight)
              );

              if (lineHeight > 2) {
                this.isShowAllTipBtn = true;
              }
            })
            .exec();
        }
      }, 80);
    },

    methods: {
      /**
       *
       * @param {*} item
       * @param { typeof buttons[number]['key']} key
       */
      btnAction(item, key) {
        const gStores = new GStores();
        const { performDeptCode: deptId, orderClass, hosId } = item;
        console.log('that.item', this.item);
        const that = this;
        const { herenId } = gStores.globalStore;
        // eslint-disable-next-line vue/no-mutating-props
        that.item.herenId = herenId;
        const btnActionMap = {
          // 查看报告
          1: () => {
            // eslint-disable-next-line vue/no-mutating-props
            that.item.orderClassTabIndex =
              that.item?.orderClass === '2' ? 0 : 1;
            useTBanner(that.btns[0], 'navigateTo', that.item);
          },

          // 院内导航
          2: () => {
            useTBanner(that.btns[1], 'navigateTo', that.item);
          },

          // 用药指导
          3: () => {
            useTBanner(that.btns[2], 'navigateTo', that.item);
          },

          // 查看预约
          4: () => {
            useTBanner(that.btns[3], 'navigateTo', that.item);
          },

          // 立即预约
          5: () => {
            useTBanner(that.btns[4], 'navigateTo', that.item);
          },
        };

        if (key in btnActionMap) {
          btnActionMap[key]();
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .item {
    border-radius: 8px;
    background-color: var(--bg-color);
    position: relative;

    &::before {
      $gap-length: 32rpx;
      content: '';
      display: block;
      position: absolute;
      left: 0;
      top: $gap-length;
      bottom: $gap-length;
      width: 4rpx;
      background-color: var(--main--color);
      border-radius: 16rpx;
    }
  }

  .tip {
    position: relative;

    .show-all {
      position: absolute;
      bottom: -10rpx;
      right: 0;

      background: linear-gradient(
        270deg,
        var(--bg-color) 0,
        var(--bg-color) 80%,
        rgba(255, 255, 255, 0.3) 100%
      );
    }
  }

  .btn-item {
    border-radius: 14px;
    border: 1px solid #cccccc;
    background: #ffffff;
    height: 56rpx;
    justify-content: center;
  }

  .btn-first {
    background-color: var(--main--color);
    color: #fff;
  }

  .f64 {
    font-size: 64rpx;
  }

  .number-num {
    line-height: 64rpx;
  }

  .color-yellow {
    color: #f68f1e;
  }
</style>
