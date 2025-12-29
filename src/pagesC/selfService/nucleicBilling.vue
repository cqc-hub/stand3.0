<template>
  <view class="g-page">
    <g-flag typeFg="801" isShowFg />
    <g-choose-pat />
    <view
      v-if="!pageProps.billingType && tabs.length > 1"
      class="g-border-bottom"
    >
      <g-tabs
        v-model:value="tabCurrent"
        :tabs="tabs"
        :scroll="false"
        @change="initConfig"
        field="label"
        style="width: 100%"
      />
    </view>
    <scroll-view
      v-if="pageLoading && list && list.length > 0"
      class="g-container box"
      scroll-y
    >
      <view
        class="box-tips box-card"
        v-if="list[0].itemTime || list[0].itemAddress"
      >
        <view>
          <label>检测时间</label>
          <label>{{ list[0].itemTime }}</label>
        </view>
        <view>
          <label>检测地点</label>
          <label>{{ list[0].itemAddress }}</label>
        </view>
      </view>
      <!-- <view class="box-date box-card">
        <label>检测日期</label>
        <label>2022-10-27</label>
        <text :class="`iconfont icon-resize`">&#xe66b;</text>
      </view> -->
      <view v-if="sideList.length === 1" class="box-list box-card mb20">
        <view
          v-for="item in list"
          :key="item.itemCode"
          @tap="clickItem(item)"
          :class="{
            active: selList.findIndex((o) => o.itemCode === item.itemCode) > -1,
          }"
          class="box-aaa g-fade-in"
        >
          <view
            :class="{
              'color-bbb': item.disabled === '1',
            }"
            class="box-item"
          >
            <label>{{ item.itemName }}</label>
            <label>{{ item.fee }}元</label>
            <template v-if="item.disabled !== '1'">
              <block
                v-if="
                  selList.findIndex((o) => o.itemCode === item.itemCode) > -1
                "
              >
                <text class="iconfont ico-checkbox">&#xe6d0;</text>
              </block>
              <block v-else>
                <text class="iconfont">&#xe6ce;</text>
              </block>
            </template>
          </view>

          <view
            v-if="item.itemAddress"
            class="color-888 f26 g-break-word tip flex-normal"
          >
            <rich-text :nodes="HTMLParser(item.itemAddress)" />
          </view>

          <view
            v-if="item.tips"
            :id="'nucle-item-' + item.itemCode"
            @click.stop="clickTip(item)"
            class="color-888 f26 g-break-word tip flex-normal"
          >
            <rich-text
              :style="{
                'line-height': `${tipLineHeight}rpx`,
              }"
              :class="{
                'text-ellipsis': !item.tipHide && item.showTipHideBtn,
              }"
              :nodes="HTMLParser(item.tips)"
            />

            <view v-if="!item.tipHide && item.showTipHideBtn" class="show-all">
              <text class="iconfont f36">&#xe66b;</text>
            </view>
          </view>
        </view>
      </view>

      <view
        v-else
        :class="{
          mt24: tabs.length && tabs.length > 1,
        }"
        class="mb20 flex-start box-list1"
      >
        <g-side-list
          :style="{
            width: '220rpx',
          }"
          :list="sideList"
          :field="{
            label: 'itemName',
            value: 'itemName',
          }"
          :value="sideValue"
          @item-click="sideClick"
          defaultChoose
        />

        <view class="flex1 list-content">
          <view
            v-for="item in list"
            :key="item.itemCode"
            @tap="clickItem(item)"
            :class="{
              active:
                selList.findIndex((o) => o.itemCode === item.itemCode) > -1,
            }"
            class="box-aaa g-fade-in"
          >
            <view
              :class="{
                'color-bbb': item.disabled === '1',
              }"
              class="box-item"
            >
              <label>{{ item.itemName }}</label>
              <label>{{ item.fee }}元</label>
              <template v-if="item.disabled !== '1'">
                <block
                  v-if="
                    selList.findIndex((o) => o.itemCode === item.itemCode) > -1
                  "
                >
                  <text class="iconfont ico-checkbox">&#xe6d0;</text>
                </block>
                <block v-else>
                  <text class="iconfont">&#xe6ce;</text>
                </block>
              </template>
            </view>

            <view
              v-if="item.itemAddress"
              class="color-888 f26 g-break-word tip flex-normal"
            >
              <rich-text :nodes="HTMLParser(item.itemAddress)" />
            </view>

            <view
              v-if="item.tips"
              :id="'nucle-item-' + item.itemCode"
              @click.stop="clickTip(item)"
              class="color-888 f26 g-break-word tip flex-normal"
            >
              <rich-text
                :style="{
                  'line-height': `${tipLineHeight}rpx`,
                }"
                :class="{
                  'text-ellipsis': !item.tipHide && item.showTipHideBtn,
                }"
                :nodes="HTMLParser(item.tips)"
              />

              <view
                v-if="!item.tipHide && item.showTipHideBtn"
                class="show-all"
              >
                <text class="iconfont f36">&#xe66b;</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="pr32 pl32">
        <g-flag typeFg="45" isShowFgTip aaa />
      </view>
    </scroll-view>
    <view class="g-footer" v-if="pageLoading && list && list.length > 0">
      <button
        v-if="pageConfig.footerBtn"
        class="btn btn-primary btn-plain btn-border flex1"
        @click="useTBanner(pageConfig.footerBtn)"
      >
        {{ pageConfig.footerBtn.text }}
      </button>
      <button
        :class="{
          'btn-disabled': !selList.length,
        }"
        class="btn btn-primary flex1"
        @click="submit"
      >
        确定开单{{ (selList.length && `(${selList.length})`) || '' }}
      </button>
    </view>
    <view v-if="pageLoading && list && list.length == 0" class="empty-box">
      <g-empty :current="1" />
    </view>

    <xy-dialog
      :title="fgTitle45"
      :show="isFgShow45"
      :isShowCancel="false"
      @confirmButton="isFgShow45 = false"
      isMaskClick
      isReverseBtn
    >
      <scroll-view scroll-y class="reg-tip">
        <g-flag
          v-model:title="fgTitle45"
          isHideTitle
          isShowFgTip
          typeFg="45"
          aaa
        />
      </scroll-view>
    </xy-dialog>
    <g-message />
  </view>
  <homeH5SharePopup
    ref="homeH5SharePopupRef"
    :configData="h5QrCodeData || undefined"
  />
</template>

<script setup lang="ts">
  import api from '@/service/api';
  import { ref, computed, onMounted, nextTick, getCurrentInstance } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';

  import { payMoneyOnline, toPayPull } from '@/components/g-pay/index';
  import {
    GStores,
    wait,
    getTimeStamp,
    useTBanner,
    type ISystemConfig,
    ServerStaticData,
    apiAsync,
    chooseImg,
  } from '@/utils';
  import { isSubscribeWx } from '@/common/checkJump';
  import HTMLParser from '@/common/html-parser';
  import { joinQuery, deQueryForUrl, joinQueryForUrl } from '@/common/utils';
  import { INucle } from './index';
  import { decryptDes } from '@/common/des';

  import homeH5SharePopup from './componetns/homeH5SharePopup.vue';

  const pageProps = ref(
    {} as {
      billingType?: string;
      hosName: string;
      hosId: string;
      isPay: string; //是否需要缴费 表示支付方式
      openId: string;
      type: string;
      showCareModel?: string;
    }
  );
  const pageConfig = ref(<ISystemConfig['selfBilling']>{});
  const tabs = computed(() => {
    return pageConfig.value.tabs || [];
  });
  const tipLineHeight = 40;

  const tabCurrent = ref(0);
  const isFgShow45 = ref(false);
  const fgTitle45 = ref('');
  const homeH5SharePopupRef = ref('' as any);
  const h5QrCodeData = ref();
  const list = ref<INucle[]>([]);
  const selList = ref<INucle[]>([]);
  const gStores = new GStores();
  const pageLoading = ref(false);

  const isWeiJingKaiDan1001067 = computed(() => {
    return (
      gStores.globalStore.sysCode === '1001067' &&
      pageProps.value.billingType === '99996'
    );
  });

  onLoad(async (opt) => {
    //针对支付宝扫普通二维码跳转的处理 一开始没拿到参数不掉接口
    const queryParams = gStores.globalStore.appLaunchData?.query?.qrCode;

    uni.showLoading({ title: '加载中' });
    pageConfig.value = await ServerStaticData.getSystemConfig('selfBilling');
    const { hosId } = pageProps.value;

    if (queryParams && !hosId) {
      return;
    }
    if (opt) {
      pageProps.value = deQueryForUrl(deQueryForUrl(opt));

      if (hosId) {
        gStores.globalStore.onAppLaunch({});
      }
      if (pageProps.value.showCareModel) {
        judgeCodeShow();
      }
    }
    await wait(650);

    //针对微信扫普通二维码跳转的处理 一开始没拿到参数不掉接口
    if (opt?.q) {
      return;
    }

    initConfig();

    // await gStores.userStore.getPatList();
  });

  const judgeCodeShow = async () => {
    h5QrCodeData.value = {
      attention: '1',
      imageCode: pageProps.value.showCareModel,
      theme: '公众号',
      title: '欢迎关注',
      subTitle: '长按识别二维码，关注公众号',
      isShowInfo: true,
    };
    console.log('await isSubscribeWx()', await isSubscribeWx());

    if (!(await isSubscribeWx())) {
      homeH5SharePopupRef.value.show();
    }
  };

  const sideList = ref(<any[]>[]);
  const sideValue = ref('');
  const sideClick = ({ item }) => {
    const { itemName, items, tips } = item;
    sideValue.value = itemName;
    list.value = items;

    tips &&
      gStores.messageStore.showMessage(tips, 0, {
        useDialog: true,
        dialogOpt: {
          title: '温馨提示',
          zIndex: 2000,
        },
      });
  };

  onMounted(() => {
    isFgShow45.value = true;
  });

  const get1001048List = async (billingType: any) => {
    const { hosId } = pageProps.value;
    const { result = [] } = await api
      .getConvenientServiceList({
        billingType,
        hosId,
      })
      .finally(() => {
        pageLoading.value = true;
        uni.stopPullDownRefresh();
      });

    result.map((o) => {
      o.itemCode = o.itemId;
    });
    const jcList = result.filter((o) => o.billingType === '99998');
    const jyList = result.filter((o) => o.billingType === '99999');

    sideList.value = [];
    if (jcList.length) {
      sideList.value = [
        {
          itemName: '检查项目',
          items: jcList,
        },
      ];
    }

    if (jyList.length) {
      sideList.value.push({
        itemName: '检验项目',
        items: jyList,
      });
    }

    if (sideList.value.length) {
      list.value = sideList.value[0].items;
    }
  };

  const getList = async (billingType: any) => {
    list.value.length = 0;
    sideList.value = [];
    const { hosId } = pageProps.value;

    if (gStores.globalStore.sysCode === '1001048') {
      return await get1001048List(billingType);
    }
    const { result = [] } = await api
      .getItemList({
        billingType,
        hosId,
      })
      .finally(() => {
        pageLoading.value = true;
        uni.stopPullDownRefresh();
      });

    if (result.length) {
      sideList.value = result;
      result.map((p) =>
        p.items.map((o) => {
          o.tipHide = false;
          o.showTipHideBtn = false;
        })
      );

      list.value = result[0].items;

      setTimeout(() => {
        list.value.map((o) => {
          if (o.tips && o.tips.length > 10) {
            uni
              .createSelectorQuery()
              .select(`#nucle-item-${o.itemCode}`)
              .boundingClientRect((rect) => {
                const lineHeight = parseInt(
                  // @ts-expect-error
                  rect.height / uni.upx2px(tipLineHeight)
                );

                if (lineHeight > 1) {
                  o.showTipHideBtn = true;
                }
              })
              .exec();
          }
        });
      }, 80);
    }
  };

  //初始化页面数据
  const initConfig = async () => {
    pageLoading.value = false;
    const { billingType: _billingType, type, isPay } = pageProps.value;
    // 不配type 默认 3-需要支付 99999-去门诊不需要支付
    let billingType = '99999';

    if (isPay === '1') {
      billingType = '3';
    } else if (_billingType || type) {
      billingType = _billingType || type;
    } else if (tabs.value.length) {
      billingType = tabs.value[tabCurrent.value]?.value;
    }
    getList(billingType);
  };

  const clickTip = (item: INucle) => {
    if (item.showTipHideBtn && !item.tipHide) {
      item.tipHide = true;
    } else {
      clickItem(item);
    }
  };

  const clickItem = async (item: INucle) => {
    const { disabled, tips, extend } = item;
    const { billingType } = pageProps.value;

    if (disabled === '1') {
      tips && gStores.messageStore.showMessage(tips, 3000);

      return;
    }
    if (tips && extend) {
      try {
        let extend = JSON.parse(item?.extend || '');
        if (extend?.extendShowMaxAge) {
          const patientAge = (gStores.userStore.patChoose?.patientAge as any || 0)*1;
          if (patientAge > extend.extendShowMaxAge) {
            throw new Error('超出年龄无需填写问卷');
          }
        }
        extend?.showCareModel == '1' &&
          (await new Promise<{ confirm: boolean }>((r) => {
            gStores.messageStore.showMessage(tips, 0, {
              useDialog: true,
              dialogOpt: {
                title: '温馨提示',
                isShowCancel: false,
                isMaskClick: true,
                confirmText: '确认',
              },
              closeCallBack: r,
            });
          }));
      } catch (e) {
        console.error('extend序列表失败', item.extend, e);
      }
    }

    const listLen = selList.value.length;
    if (pageConfig.value.multi === '1' && listLen) {
      const { billingDoc } = item;
      const { billingDoc: oldBillingDoc } = selList.value[0];
      if (listLen === 1 && billingDoc !== oldBillingDoc) {
        selList.value = [item];
        return;
      }
      const idx = selList.value.findIndex((o) => o.itemCode === item.itemCode);

      if (idx > -1) {
        selList.value.splice(idx, 1);
      } else {
        if (billingDoc !== oldBillingDoc) {
          gStores.messageStore.showMessage(
            '您选择的项目暂不支持合并开单',
            3000
          );
        } else {
          selList.value.push(item);
        }
      }
    } else {
      selList.value = [item];
    }

    if (isWeiJingKaiDan1001067.value) {
      handleItem1001067(item);
    }
  };

  /**
   * 有勾选无痛胃镜或无痛肠镜，则自动勾选心电图+心电向量图。
   * @param item
   */
  const handleItem1001067 = (item: INucle) => {
    const codes = ['202073', '202076']; //无痛胃镜202073 无痛肠镜202076
    const xindiantyuCode = '202127'; // 心电图+心电向量图

    const { itemCode } = item;
    const itemSel202127 = selList.value.find(
      (o) => o.itemCode === xindiantyuCode
    );
    const item202127 = list.value.find((o) => o.itemCode === xindiantyuCode)!;
    // +
    if (selList.value.find((o) => o.itemCode === itemCode)) {
      if (codes.includes(itemCode) && !itemSel202127) {
        selList.value.push(item202127);
      }
    } else {
      // -
      if (codes.includes(itemCode) && itemSel202127) {
        const weijingItem = selList.value.find((o) =>
          codes.includes(o.itemCode)
        );

        if (!weijingItem) {
          selList.value = selList.value.filter(
            (o) => o.itemCode !== xindiantyuCode
          );
        }
      }
    }
  };

  //确定开单
  const submit = async () => {
    const { patientId, patientName, cardNumber } = gStores.userStore.patChoose;
    const { hosId, isPay, hosName } = pageProps.value;
    const source = gStores.globalStore.browser.source;
    const reBillingUrl = joinQueryForUrl('/pagesC/selfService/nucleicBilling', {
      ...pageProps.value,
    });

    const totalCost = selList.value.reduce((p, c) => {
      p += (c.fee as unknown as number) * 1;
      return p;
    }, 0);
    if (selList.value?.length === 1 && selList.value[0].extend) {
      try {
        const extend = JSON.parse(selList.value[0].extend);
        if (extend?.extendShowMaxAge) {
          const patientAge =  (gStores.userStore.patChoose?.patientAge as any || 0)*1;;
          if (patientAge > extend.extendShowMaxAge) {
            throw new Error('超出年龄无需填写问卷');
          }
        }
        if (extend?.quesNeed) {
          const {
            birthday,
            patientSex,
            patientAge,
            patientName,
            patientPhone,
          } = gStores.userStore.patChoose;
          const extraData = {
            birthday,
            patientSex,
            patientAge,
            patientName,
            phoneNumber: patientPhone,
            hosId,
            isPay,
            patientId,
            items: selList.value,
            totalCost,
            source: source,
            hosName,
            reBillingUrl: reBillingUrl, //再次开单路径
          };

          useTBanner({
            type: 'h5',
            isSelfH5: '1',
            path: 'pagesC/question/yqQuestion3',
            addition: {
              herenId: 'herenId',
              token: 'token',
            },
            extraData,
          });
          return;
        }
      } catch (e) {
        console.error('extend序列表失败', selList.value[0].extend, e);
      }
    }

    const tips =
      `是否确认以下${selList.value.length}项开单: ` +
      selList.value
        .map((o) => {
          return `${o.itemName}` + (o.fee ? `(${o.fee}元)` : '');
        })
        .join(',');

    const { confirm } = await apiAsync(uni.showModal, {
      title: '开单确认',
      content: tips,
    });

    if (!confirm) {
      return;
    }

    if (isWeiJingKaiDan1001067.value) {
      useTBanner({
        path: joinQueryForUrl('pagesC/question/question1001067', {
          hosId,
          source,
          totalCost,
          hosName,
          reBillingUrl,
          items: JSON.stringify(selList.value),
        }),
        addition: {
          patientId: 'patientId',
        },
        type: 'h5',
        isSelfH5: '1',
      });
      return;
    }

    try {
      const { result } = await api.createBillingOrder({
        hosId,
        patientId,
        items: selList.value,
        totalCost,
        source: source,
        hosName,
        reBillingUrl: reBillingUrl, //再次开单路径
      });

      if (isPay == '1') {
        const data = {
          businessType: '',
          hosId,
          hosName,
          patientId: patientId,
          phsOrderNo: result.phsOrderNo,
          phsOrderSource: 11,
          totalFee: totalCost,
          patientName,
          cardNumber,
        };
        const res = await payMoneyOnline(data);

        await toPayPull(res);
        payAfter(patientId);
      } else {
        gStores.messageStore.showMessage('开单成功', 1500, {
          closeCallBack: () => {
            //跳转门诊缴费页面

            uni.reLaunch({
              url: joinQuery('/pagesA/clinicPay/clinicPayDetail', {
                visitNo: result?.visitNo || '',
              }),
            });
          },
        });
      }
    } catch (error) {
      throw new Error(error as string);
    }
  };
  const payAfter = async (patientId) => {
    uni.showLoading({ title: '加载中' });
    await wait(1000);
    uni.hideLoading();
    //去我的开单页面
    uni.reLaunch({
      url: `/pagesC/cloudHospital/myPath?path=/pagesC/selfService/myOrder&_pd=${patientId}&_pt=${getTimeStamp(
        6
      )}`,
    });
  };
</script>
<style lang="scss" scoped>
  .g-page {
    .empty-box {
      padding-top: 200rpx;
    }
    .box {
      box-sizing: border-box;
      // padding: 24rpx 32rpx 40rpx;
      width: 100%;
      .box-card {
        background: #ffffff;
        border: 1rpx solid var(--hr-neutral-color-2);
        border-radius: 16rpx;
        box-sizing: border-box;
      }

      .iconfont {
        font-size: var(--hr-font-size-xxl);
      }
      .box-tips {
        width: 100%;
        padding: 32rpx;
        label {
          font-size: var(--hr-font-size-xs);
          text-align: left;
          color: var(--hr-neutral-color-7);
          line-height: 44rpx;
          &:last-child {
            margin-top: 8rpx;
            color: var(--hr-neutral-color-10);
            margin-left: 16rpx;
          }
        }
      }
      .box-date {
        margin-top: 16rpx;
        padding: 28rpx 32rpx;
        display: flex;
        label {
          color: -var(-hr-neutral-color-10);
          line-height: 48rpx;
          font-weight: 600;
          font-size: var(--hr-font-size-base);
          margin-right: 32rpx;

          &:nth-child(2) {
            flex: 1;
            font-weight: 400;
          }
        }
      }
      .box-list {
        margin-top: 16rpx;
      }
    }
  }

  .tip {
    position: relative;

    .show-all {
      transform: rotate(90deg);

      background: linear-gradient(
        180deg,
        #fff 0,
        #fff 60%,
        rgba(255, 255, 255, 0.3) 100%
      );
    }
  }

  .box-list1 {
    // background-color: #fff;
    background-color: #f6f6f6;
  }

  .list-content {
    background-color: #fff;
  }

  .box-aaa {
    box-shadow: 0px -1px 0px 0px #e6e6e6 inset;
    background-color: #fff;
    padding: 28rpx 0;
    margin: 0 32rpx;
    &:last-child {
      box-shadow: none;
    }
  }
  .box-item {
    display: flex;
    color: -var(-hr-neutral-color-10);

    label {
      line-height: 48rpx;
      font-weight: 600;
      font-size: var(--hr-font-size-base);
      margin-right: 32rpx;

      &:nth-child(2) {
        flex: 1;
        text-align: right;
        white-space: nowrap;
      }
    }
  }
  .active {
    label {
      color: var(--hr-brand-color-6);
    }
  }

  .ico-checkbox {
    color: var(--hr-brand-color-6);
  }
</style>
