<template>
  <!-- 顶部样式1 其他样式2  diff 里面区分老人版本3-->
  <view :class="options.type == 2 ? 'normal' : 'diff'">
    <uni-grid
      :showBorder="false"
      :square="false"
      :column="type == 1 ? options.list.length : type == 3 ? 2 : 4"
    >
      <uni-grid-item v-for="(item, i) in options.list" :key="i">
        <g-login
          @handler-login="updateIdFun(item)"
          @handler-next="gridClick(item)"
          :disabled="item.loginInterception === '0'"
        >
          <view
            class="grid-item-box g-fade-in"
            v-if="options.type != 3"
            @tap="gridClick(item)"
          >
            <!-- 绿色能量角标 -->
            <!-- v-if="item.enabled == 0 "  -->
            <!-- gridLabel  0 默认无角标 1 绿色能量 2 医保 3 维护中 -->
            <view
              :class="`${
                options.type == 1 && options.list.length == 3
                  ? 'warn-label3'
                  : 'warn-label'
              }`"
              v-if="item.gridLabel == '3'"
            >
              维护中
            </view>
            <view class="gree-label" v-if="item.gridLabel == '1'">
              绿色能量
            </view>
            <!-- 之前为立减五元 郭20250911要求改为 医保 -->
            <view class="warn-label" v-if="item.gridLabel == '2'">医保</view>
            <view
              class="warn-label badge"
              v-if="
                item.path?.includes('/pagesB/historicalMess/historicalMess') &&
                unreadMes
              "
            >
              new
            </view>
            <!-- 消息展示 -->
            <view v-if="item?.messageNum" class="warn-label badge">
              {{ item.messageNum }}
            </view>
            <img
              v-if="isImg(item.iconfont)"
              :class="`${
                options.type == 1 && options.list.length == 3
                  ? 'grid-resize1'
                  : 'grid-resize'
              }  `"
              :src="item.iconfont"
              mode="widthFix"
              lazy-load
            />
            <text
              v-else
              :class="`icon-font ${
                options.type == 1 && options.list.length == 3
                  ? 'grid-resize1'
                  : 'grid-resize'
              } ${item.iconfont}`"
            />
            <view class="grid-label text-ellipsis">{{ item.title }}</view>
            <!-- <text
              v-if="type == 1 && item.detail"
              class="grid-title  f22"
            >
              {{ item.detail }}
            </text> -->
            <rich-text
              v-if="type == 1 && item.detail"
              class="grid-title f22"
              :nodes="$HTMLParser(item.detail.replaceAll('  ', '<br/>'))"
            ></rich-text>
          </view>
          <view
            class="grid-item-box3 g-fade-in"
            v-if="options.type == 3"
            @tap="gridClick(item)"
          >
            <!-- 绿色能量角标 -->
            <!-- v-if="item.enabled == 0 "  -->
            <!-- gridLabel  0 默认无角标 1 绿色能量 2 立减五元 3 维护中 -->
            <view class="warn-label" v-if="item.gridLabel == '3'">维护中</view>
            <view class="gree-label" v-if="item.gridLabel == '1'">
              绿色能量
            </view>
            <view class="warn-label" v-if="item.gridLabel == '2'">医保</view>
            <img
              v-if="isImg(item.iconfont)"
              :class="`icon-font grid-resize`"
              :src="item.iconfont"
              mode="widthFix"
              lazy-load
            />
            <text v-else :class="`icon-font grid-resize ${item.iconfont}`" />
            <view class="grid-label text-ellipsis">{{ item.title }}</view>
          </view>
        </g-login>
      </uni-grid-item>
    </uni-grid>
  </view>
</template>

<script lang="ts" setup>
  import { withDefaults, computed, ref, onMounted } from 'vue';
  import { useRouterStore } from '@/stores';
  import { throttle, GStores } from '@/utils';
  import global from '@/config/global';
  import api from '@/service/api';

  /**
   * g-grid 网格布局
   * @description 用于页面中，网格布局使用
   * @property {Array} list 网格展示的数据
   * @property {Boolean} type = [1|2] 两种样式
   * @event {Function} gridclick 点击网格的方法
   */

  const emit = defineEmits(['gridClick']);

  interface IGridProps {
    list: IRoute[];
    type?: 1 | 2 | 3; //首页图标样式1 默认2
  }

  const isImg = (src?: string) => {
    if (src) {
      return src.startsWith('http');
    }
    return false;
  };

  const props = withDefaults(defineProps<IGridProps>(), {
    list: () => [
      {
        title: '医院介绍',
        path: '/xxx',
        iconfont: 'ico_sy_paper5',
      },
      {
        title: '医院介绍',
        path: '/xxx',
        iconfont: 'ico_sy_paper5',
      },
      {
        title: '医院介绍',
        path: '/xxx',
        iconfont: 'ico_sy_paper5',
      },
      {
        title: '医院介绍',
        path: '/xxx',
        iconfont: 'ico_sy_paper5',
      },
    ],
    type: 2,
  });

  const options = computed(() => {
    return {
      list: props.list,
      type: props.type,
    };
  });

  const unreadMes = ref(false);
  let getNum = () => {
    api
      .getStatus({
        str: `OPENID_${gStores.globalStore.h5OpenId}/${gStores.userStore.phoneNum}`,
      })
      .then(({ result }) => {
        unreadMes.value = result as boolean;
        // unreadMes.value = true;
      });
  };

  getNum = throttle(getNum, 1000);

  const gStores = new GStores();

  onMounted(async () => {
    if (
      global.sConfig.isMessageBtnShowNew &&
      gStores.userStore.patChoose.patientId
    ) {
      const hasMes = options.value.list.find((item) =>
        item.path?.includes('/pagesB/historicalMess/historicalMess')
      );
      hasMes && getNum();
    }
  });
  const gridClick = (item) => {
    if (item.path?.includes('/pagesB/historicalMess/historicalMess')) {
      unreadMes.value = false;
    }
    emit('gridClick', item);
  };

  const updateIdFun = (item) => {
    const routerStore = useRouterStore();
    routerStore.update_P();
    routerStore.updateId(item.id);
  };
</script>

<style lang="scss" scoped>
  // 样式一
  .diff {
    .grid-item-box {
      flex: 1;
      /* #ifndef APP-NVUE */
      display: flex;
      /* #endif */
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .grid-resize {
        width: 88upx;
        height: 88upx;
        position: relative;
      }
      .grid-resize1 {
        width: 100upx;
        height: 100upx;
        position: relative;
      }

      .grid-label {
        color: var(--hr-neutral-color-9);
        margin-top: 8upx;
        font-size: var(--hr-font-size-s);
        font-weight: var(--h-weight-2);
      }
      .grid-title {
        font-size: var(--hr-font-size-xxxs);
        text-align: center;
        color: var(--hr-neutral-color-7);
        line-height: 34rpx;
        white-space: normal;
      }

      .gree-label {
        position: absolute;
        background: #ffffff;
        border: 1rpx solid var(--hr-success-color-6);
        border-radius: 17rpx;
        color: var(--hr-success-color-6);
        line-height: 28rpx;
        font-size: var(--h-size-18);
        padding: 0 8rpx;
        z-index: 1;
        right: -6rpx;
        top: 0rpx;
        background-color: var(--h-color-white);
        box-sizing: border-box;
      }

      .warn-label {
        position: absolute;
        background: #ffffff;
        border: 1rpx solid var(--hr-error-color-6);
        border-radius: 17rpx;
        color: var(--hr-error-color-6);
        line-height: 28rpx;
        font-size: var(--h-size-18);
        padding: 0 8rpx;
        z-index: 1;
        right: -6rpx;
        top: 0rpx;
        background-color: var(--h-color-white);
        box-sizing: border-box;
      }
      .warn-label3 {
        position: absolute;
        background: #ffffff;
        border: 1rpx solid var(--hr-error-color-6);
        border-radius: 17rpx;
        color: var(--hr-error-color-6);
        line-height: 28rpx;
        font-size: var(--h-size-18);
        padding: 0 8rpx;
        z-index: 1;
        right: 29rpx;
        top: 4rpx;
        background-color: var(--h-color-white);
        box-sizing: border-box;
      }
      .gree-label3 {
        position: absolute;
        background: #ffffff;
        border: 1rpx solid var(--hr-success-color-6);
        border-radius: 17rpx;
        color: var(--hr-success-color-6);
        line-height: 28rpx;
        font-size: var(--h-size-18);
        padding: 0 8rpx;
        z-index: 1;
        right: 29rpx;
        top: 4rpx;
        background-color: var(--h-color-white);
        box-sizing: border-box;
      }
    }
    .grid-item-box3 {
      flex: 1;
      /* #ifndef APP-NVUE */
      display: flex;
      /* #endif */
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #f2f6ff;
      border: 2rpx solid var(--hr-brand-color-3);
      padding: 50rpx 0 38rpx;
      border-radius: 24px;
      &:nth-child(odd) {
        margin: 12rpx;
      }

      .grid-resize {
        width: 80upx;
        height: 80upx;
        position: relative;
      }

      .grid-label {
        color: var(--hr-neutral-color-9);
        margin-top: 18upx;
        font-size: 48rpx;
        font-weight: var(--h-weight-2);
      }

      .gree-label {
        position: absolute;
        background: #ffffff;
        border: 1rpx solid var(--hr-success-color-6);
        border-radius: 17rpx;
        color: var(--hr-success-color-6);
        padding: 2rpx 12rpx;
        z-index: 1;
        right: 34rpx;
        top: 26rpx;
        background-color: var(--h-color-white);
        box-sizing: border-box;
      }

      .warn-label {
        position: absolute;
        background: #ffffff;
        border: 1rpx solid var(--hr-error-color-6);
        border-radius: 17rpx;
        color: var(--hr-error-color-6);
        padding: 2rpx 12rpx;
        z-index: 1;
        top: 15px;
        right: 19px;
        background-color: var(--h-color-white);
        box-sizing: border-box;
      }
    }
  }
  // 样式二
  .normal {
    .grid-item-box {
      flex: 1;
      /* #ifndef APP-NVUE */
      display: flex;
      /* #endif */
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 15px 0;

      .grid-resize {
        width: 54upx;
        height: 54upx;
        position: relative;
      }

      .grid-label {
        margin-top: 12upx;
        font-size: var(--hr-font-size-xxs);
        color: var(--hr-neutral-color-9);
      }
      .grid-dot {
        position: absolute;
        top: 5px;
        right: 15px;
      }

      .gree-label {
        position: absolute;
        background: #ffffff;
        border: 1rpx solid var(--hr-success-color-6);
        border-radius: 17rpx;
        color: var(--hr-success-color-6);
        height: 28rpx;
        font-size: var(--h-size-18);
        padding: 0 8rpx;
        z-index: 1;
        right: 8rpx;
        top: 18rpx;
        background-color: var(--h-color-white);
        box-sizing: border-box;
      }

      .warn-label {
        position: absolute;
        background: #ffffff;
        border: 1rpx solid var(--hr-error-color-6);
        border-radius: 17rpx;
        color: var(--hr-error-color-6);
        height: 28rpx;
        font-size: var(--h-size-18);
        padding: 0 8rpx;
        z-index: 1;
        right: 8rpx;
        top: 18rpx;
        background-color: var(--h-color-white);
        box-sizing: border-box;
      }
    }
  }
  .badge {
    padding: 0 8rpx 5rpx 8rpx;
    text-align: center;
    line-height: 28rpx;
    font-size: var(--h-size-18);
    background-color: red !important;
    color: white !important;
    font-weight: 700;
    right: 35rpx !important;
  }
</style>
