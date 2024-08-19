<template>
  <view
    :style="{
      '--bg-color': bgColor,
      '--main--color': lineColor,
    }"
    class="item g-border p32 mb16 mt16"
  >
    <view class="g-bold color-111 f32 g-break-word mb26 ">
      {{ title }}
    </view>

    <view class="color-666 f28">
      <view v-if="item.disposeStatus === '1'">
        <text class="mr12">执行状态: </text>
        <text>{{ "未执行" }}</text>
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
        <text class="mr12">注: </text>
        <text>{{ item.remark }}</text>

        <view v-if="isShowAllTipBtn && !isShowAllTip" @click="isShowAllTip = true" class="show-all pl36 color-blue">
          <text>查看全部</text>
          <text class="iconfont">&#xe66b;</text>
        </view>
      </view>

      <view v-if="item.address">
        <text class="mr12">地址: </text>
        <text>{{ item.address }}</text>
      </view>

      <view v-if="item.scheduledDateTime">
        <view>
          <text class="mr12">预约时间: </text>
          <text class="g-bold mr12">{{ item.scheduledDateTime }}</text>
          <text v-if="item.no" class="g-bold mr12">{{ item.no }}号</text>
        </view>

        <view v-if="dayjs(item.scheduledDateTime).format('YYYY-MM-DD') === now" class="flex-between mt12">
          <view>
            <view class="g-flex-rc-cc color-111 f64 g-bold number-num">
              {{ item.beforeNum || "-" }}
            </view>
            <view class="g-flex-rc-cc f28 color-444">等待人数</view>
          </view>

          <view>
            <view class="g-flex-rc-cc color-111 f64 g-bold number-num">
              {{ item.curNo || "-" }}
            </view>
            <view class="g-flex-rc-cc f28 color-444">当前叫号</view>
          </view>

          <view>
            <view class="g-flex-rc-cc color-yellow f64 g-bold number-num">
              {{ item.no || "-" }}
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
          class="mb16 mt26 mr48 ml48  btn-item f26 g-bold flex-normal"
        >
          {{ btn.label }}
        </button>
      </view>
    </view>
  </view>
</template>

<script>
import dayjs from "dayjs";
import { ORDER_CLASS_MAP } from "../utils";
  import { joinQuery  } from '@/common';
const buttons = [
  {
    label: "查看报告",
    key: "1",
  },
  {
    label: "用药指导",
    key: "3",
  },
  {
    label: "查看预约",
    key: "4",
  },
  {
    label: "立即预约",
    key: "5",
  },
  {
    label: "院内导航",
    key: "2",
  },
];

export default {
  data() {
    return {
      dayjs,
      isShowAllTip: false,
      isShowAllTipBtn: false,
      tipLineHeight: 40,
      now: dayjs().format("YYYY-MM-DD"),
    };
  },

  props: {
    item: {
      type: Object,
      default: () => ({}),
    },

    mainColor: String,
    bgColor: String,
  },

  computed: {
    lineColor({ mainColor }) {
      return mainColor === "#fff" ? "#dddddd" : mainColor;
    },

    showButtons({ item }) {
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
          // 未执行的需要预约的检查
          if (appointIndicator === "1" && disposeStatus === "1" && isAppoint === "0" && orderClass === "3") {
            return true;
          }
        },

        // 查看预约
        4() {
          if (appointIndicator === "1" && ["2", "3"].includes(orderClass)) {
            if (isAppoint === "1" && ["2", "3"].includes(disposeStatus)) {
              return true;
            }
          }
        },

        // 查看报告
        1() {
          if (["2", "3"].includes(orderClass)) {
            if (["2", "3"].includes(disposeStatus)) {
              return true;
            }
          }
        },

        // 用药指导
        3() {
          // 西药、中药、成药
          if (orderClass === "1") {
            if (["2", "3"].includes(disposeStatus)) {
              return true;
            }
          }
        },

        // 院内导航
        2() {
          if (performDeptCode) {
            return true;
            // // #ifdef MP-WEIXIN
            //  return true;
            // // #endif
            // // #ifdef  MP-ALIPAY
            // return false;
            // // #endif
          }
        },
      };

      return buttons.filter(({ key }) => {
        return btnShows[key] && btnShows[key]();
      });
    },

    title({ item }) {
      const types = [ORDER_CLASS_MAP[item.orderClass]];
      if (item.isEmptyStomach === "1") {
        types.push("需要空腹");
      }

      const str = types.join(",");

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
            const lineHeight = parseInt(rect.height / uni.upx2px(this.tipLineHeight));

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
      const { performDeptCode: deptId, orderClass, hosId } = item;

      const btnActionMap = {
        // 查看报告
        1: () => {
       
          // this.$Router.push({
          //   path: "/pagesB/reportQuery/reportQuery",
          //   query: {
          //     tabIndex: orderClass === "2" ? 0 : 1,
          //   },
          // });
        },

        // 院内导航
        2: () => {
          // 区分越城和朝晖
          // #ifdef MP-ALIPAY
          if (hosId == "03") {
            //越城院区
            appsId = 10320;
            let path = `https://his.ipalmap.com/navigation/dist/index.html#/map?appsId=${appsId}&deptId=${deptId}`;
            this.$Router.push({
              path: "/pagesB/thirdPart/guideWeb",
              query: {
                url: path,
              },
            });
          } else {
            console.log('朝晖支付宝')
            my.navigateToMiniProgram({
              appId: "2021003142699208",
              path: "pages/index/index",
              query: {
                subOrgCode: "SUB_ORG9051101",
                anchorCode: deptId,
              } 
            });
          }
          // #endif

          // #ifdef MP-WEIXIN
          if (hosId == "03") {
            //越城院区
            let path =
              "?buildId=0C3V01&url=" +
              encodeURIComponent(
                `https://his.ipalmap.com/navigation/dist/index.html#/map?appsId=10259&deptId=${deptId}`
              );
            uni.navigateToMiniProgram({
              appId: "wx83884e3a215b20f4",
              path: "pages/map/mapView" + path,
            });
          } else {
            wx.navigateToMiniProgram({
              appId: "wx0aeb52a97a73acc3",
              path: `/subPackages/hospital/pages/detail/index?subOrgCode=SUB_ORG9051101&anchorCode=${deptId}`,
            });
          }
          // #endif

        
        },

        // 用药指导
        3: () => {
          this.$Router.push({
            path: "/pagesB/healthRecordsPY/outpatientRecords",
            query: {
              type: "outPatient",
            },
          });
        },

        // 查看预约
        4: () => {
          this.$Router.push({
            path: "/pagesC/h5Url/chooseMedical",
          });
        },

        // 立即预约
        5() {
          return this[4]();
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
    content: "";
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

    background: linear-gradient(270deg, var(--bg-color) 0, var(--bg-color) 80%, rgba(255, 255, 255, 0.3) 100%);
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
