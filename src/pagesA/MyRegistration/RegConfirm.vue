<template>
  <view
    :class="{
      [gStores.globalStore.getPageClass]: true,
    }"
    class="page"
  >
    <view scroll-y class="container">
      <view class="container-view">
        <view class="container-view-card">
          <Reg-Confirm-Card
            :my-props="props"
            :systemModeOld="gStores.globalStore.modeOld"
          />
        </view>

        <view class="bg-white">
          <Reg-Confirm-ChoosePat
            :pat="quickPat"
            :isOrderWithoutPat="isOrderWithoutPat"
            :pb0="isOrderWithoutPat"
            @choose-pat="patChoose"
          >
            <template #footer="{ chooseAction, showPat }">
              <view
                v-if="isOrderWithoutPat"
                :class="{
                  ['pt0']: !showPat.patientName,
                  'g-border-top mt24 pt24 ': showPat.patientName,
                }"
                class="flex items-center mb12 color-blue pb24"
              >
                <view
                  :class="{
                    ' g-border-right': showPat.patientName,
                  }"
                  class="f28 pr12 pl12 pt8 pb8 flex-1 flex items-center"
                  @click="handlerCreateCachePerson"
                >
                  <text class="iconfont qr-toggle-icon">&#xe6c3;</text>

                  无卡快速预约
                </view>

                <view
                  class="f28 pr12 pl12 pt8 pb8 mr12 flex-1 flex items-center"
                  @click="chooseAction"
                >
                  <text class="iconfont qr-toggle-icon">&#xe6f9;</text>
                  切换就诊人
                </view>
              </view>
            </template>
          </Reg-Confirm-ChoosePat>
        </view>
      </view>

      <g-flag v-if="isOver" :typeFg="isWaitReg ? '1112' : '4'" isShowFgTip />
      <!--  #ifdef MP-ALIPAY -->
      <template v-if="alipayPid">
        <Green-Power />
        <Green-Toast
          :contentTitle="contentTitle"
          :duration="greenToastDuration"
          v-model:content="greenToastContent"
        />
      </template>
      <!--  #endif -->
    </view>

    <Order-Reg-Confirm
      :headerIcon="`${global.BASE_IMG}v3-order-reg-confirm${
        gStores.globalStore.isTcmStyle ? '-tcm' : ''
      }.png`"
      :title="flagTitle9"
      @confirm="regDialogConfirm1"
      ref="regDialogConfirm"
    >
      <g-flag
        v-if="isOver"
        v-model:title="flagTitle9"
        :typeFg="isWaitReg ? '1111' : '9'"
        isShowFgTip
        isHideTitle
        aaa
      />
    </Order-Reg-Confirm>

    <Order-Reg-Confirm
      :headerIcon="`${global.BASE_IMG}v3-order-reg-confirm${
        gStores.globalStore.isTcmStyle ? '-tcm' : ''
      }.png`"
      :title="flagTitle1203"
      :maskClickClose="false"
      @cancel="cancelAsync"
      @confirm="confirmAsync"
      height="90vh"
      confirmText="同意授权,方便就诊"
      cannerText="不授权"
      ref="regDialogConfirmSign"
    >
      <g-flag
        v-model:title="flagTitle1203"
        typeFg="1203"
        isShowFgTip
        isHideTitle
        aaa
      />
    </Order-Reg-Confirm>

    <xy-dialog
      :title="'请选择候补方式'"
      :show="waitChooseDialog"
      @confirmButton="cancelAsync"
      @cancelButton="confirmAsync"
      :cancelColor="'var(--hr-brand-color-6)'"
      :confirmColor="'var(--hr-brand-color-6)'"
      :cancelFontWeight="'bold'"
      :isMaskClick="false"
      confirmText="去填写病情"
      cancelText="仅候补登记"
    >
      <view class="reg-tip">
        <g-flag
          v-model:title="flagTitle1226"
          typeFg="1226"
          isShowFgTip
          isHideTitle
          aaa
        />
      </view>
    </xy-dialog>

    <xy-dialog
      :title="'提示'"
      :show="isPreventOrder"
      @confirmButton="goPay"
      @cancelButton="isPreventOrder = false"
      confirmText="去缴费"
    >
      <view class="reg-tip">
        <rich-text :nodes="HTMLParser(preventOrderStr)" />
      </view>
    </xy-dialog>

    <view class="safe-height"></view>
    <view class="safe-height"></view>
    <view class="safe-height"></view>
    <view class="safe-height"></view>

    <view class="g-footer flex-column">
      <view class="fg-agree" v-if="!isWaitReg">
        <view
          :class="{
            'is-check': isCheck,
          }"
          @click.stop="flagClick"
          class="iconfont check-box"
        >
          {{ (isCheck && '&#xe6d0;') || '&#xe6ce;' }}
        </view>

        <view
          :class="{
            'border-warning animate__bounce': isFlagWarning,
          }"
          class="pl8 g-border animate__animated animate__fast"
        >
          <text @click.stop="flagClick" class="">我已阅读并同意</text>
          <text @click.stop="regDialogConfirm.show" class="fg-agree-name">
            {{ agreeText }}
          </text>
        </view>
      </view>

      <view class="flex1">
        <button class="btn btn-primary" @click="regConfirm">
          {{
            isWaitReg
              ? '候补预约'
              : pageConfig.isConfirmOrderWithPay === '1'
                ? '去支付'
                : '确定预约'
          }}
        </button>
      </view>
    </view>

    <RegConformQCreatePerson
      v-if="isOrderWithoutPat"
      v-model:visible="isCreateCachePersonFormShow"
      @submit="dialogSubmit"
      @cancel="dialogCancel"
    />
    <g-select
      v-model:value="selWaitRegSch"
      v-model:show="isShowSelWaitRegSch"
      :option="waitRegSchSecondResultList"
      :field="{
        label: 'ampmName',
        value: 'ampm',
      }"
      @change="resolve"
      @update:show="selClose"
      title="确认候补就诊时段"
      everyChoose
    />
    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';

  import { onLoad, onShow } from '@dcloudio/uni-app';

  import { IPageProps } from './utils/regConfirm';
  import { TSchInfo } from './utils/index';
  import {
    GStores,
    ServerStaticData,
    wait,
    apiAsync,
    ISystemConfig,
    nameConvert,
    PatientUtils,
    throttle,
    useTBanner,
  } from '@/utils';
  import { deQueryForUrl, joinQueryForUrl } from '@/common/utils';
  import { getMyPowerQx } from '@/components/greenPower';
  import { getLocalStorage } from '@/common';
  import { IPat, useDeptStore } from '@/stores';

  import api from '@/service/api';
  import dayjs from 'dayjs';
  import global from '@/config/global';
  import HTMLParser from '@/common/html-parser';

  import OrderRegConfirm from '@/components/orderRegConfirm/orderRegConfirm.vue';
  import RegConfirmCard from './components/RegConfirmCard/RegConfirmCard.vue';
  import RegConfirmChoosePat from './components/RegConfirmChoosePat/RegConfirmChoosePat.vue';
  import GreenPower from '@/components/greenPower/greenPower.vue';
  import GreenToast from '@/components/greenPower/greenToast.vue';
  import RegConformQCreatePerson from './components/RegConformQCreatePerson/RegConformQCreatePerson.vue';
  import {
    isShowAddPatCardNo,
    useProgramPaySign,
  } from '@/pagesA/medicalCardMan/utils';
  import { beforeEach } from '@/router';

  const gStores = new GStores();
  const props = ref({} as IPageProps);
  const pageConfig = ref({} as ISystemConfig['order']);
  const personConfig = ref({} as ISystemConfig['person']);
  const deptStore = useDeptStore();
  const quickPat = ref(
    {} as IPat & {
      verifyCode: string;
    }
  );

  const priorityReg = ref(false);
  const isCheck = ref(false);
  const isPreventOrder = ref(false);
  const preventOrderStr = ref('');
  const regDialogConfirm = ref<any>('');
  const flagTitle9 = ref('');
  const greenToastDuration = ref(1500);
  const contentTitle = ref('');
  const greenToastContent = ref('');
  const alipayPid = global.systemInfo.alipayPid;
  const waitRegSchSecondResultList = ref(<TSchInfo[]>[]);
  const selWaitRegSch = ref('');
  const waitChooseDialog = ref<boolean>(false);
  const isShowSelWaitRegSch = ref(false);
  const isOver = ref(false);
  const isOverLimit = ref('');
  const patientUtils = new PatientUtils();

  const {
    regDialogConfirmSign,
    flagTitle1226,
    flagTitle1203,
    initSign,
    goPaySign,
    signAfterOnPageShow,
    isSignExist,
    getFreeSignData,
  } = useProgramPaySign();

  // 候补登记?
  const isWaitReg = computed(() => {
    return props.value.schState === '2';
  });

  // 快速预约（挂号无需绑定就诊人）
  const isOrderWithoutPat = computed(() => {
    return pageConfig.value.isOrderWithoutPat === '1' && !isWaitReg.value;
  });

  const isAddedNumSelf = computed(() => {
    return pageConfig.value.isAddedNumSelf && isWaitReg.value;
  });

  const agreeText = computed(() => {
    if (isWaitReg.value) {
      return '《候补预约须知》';
    }

    return '《预约挂号须知》';
  });

  const regDialogConfirm1 = () => {
    isCheck.value = true;
    isFlagWarning.value = false;
  };

  const handlerConfirmPatReal = async () => {
    const pages = getCurrentPages();
    const fullUrl: string = (pages[pages.length - 1] as any).$page.fullPath;
    const { title, content } = await gStores.getSysAppMore('1204');
    const { confirm } = await new Promise<{ confirm: boolean }>((r) => {
      gStores.messageStore.showMessage(content, 0, {
        useDialog: true,
        dialogOpt: {
          title,
          isShowCancel: true,
          cancelText: '暂不预约',
          confirmText: '去实名认证',
          isMaskClick: false,
        },
        closeCallBack: r,
      });
    });

    if (confirm) {
      uni.navigateTo({
        url: joinQueryForUrl('/pagesA/medicalCardMan/medicalCardMan', {
          _url: fullUrl,
        }),
      });
    }

    throw new Error('实名?');
  };

  //  更新监护人信息 —— 省中
  const handlerConfirmPatReal1 = async () => {
    const pages = getCurrentPages();
    const fullUrl: string = (pages[pages.length - 1] as any).$page.fullPath;
    const { title, content } = await gStores.getSysAppMore('1262');
    const { confirm } = await new Promise<{ confirm: boolean }>((r) => {
      gStores.messageStore.showMessage(content, 0, {
        useDialog: true,
        dialogOpt: {
          title,
          isShowCancel: true,
          cancelText: '取消',
          confirmText: '确认',
          isMaskClick: false,
        },
        closeCallBack: r,
      });
    });

    if (confirm) {
      uni.navigateTo({
        url: joinQueryForUrl('/pagesA/medicalCardMan/medicalCardMan', {
          _url: fullUrl,
        }),
      });
    }

    throw new Error('更新监护人信息?');
  };

  const patChoose = () => {
    quickPat.value = {} as any;
  };

  const regConfirm = throttle(async () => {
    const {
      isOrderPay,
      wxOrderSubscribeMessage,
      isConfirmOrderWithConfirmDialog,
    } = pageConfig.value;
    const { isGuardianWithIdCard } = personConfig.value;
    /**
     * 未填写参数
     *
     * aliRegisterId
     * diseaseId
     * promptMessage
     * thRegisterId
     * timePoint
     * visitingArea
     */

    const {
      ampm,
      categor,
      categorName,
      deptName,
      disNo,
      docName,
      diseaseId,
      fee,
      hosDeptId,
      hosDocId,
      hosId,
      numId,
      schDate,
      schId,
      schQukCategor,
      timeDesc,
      clinicalType,
      promptMessage,
      docTitleName,
      thRegisterId,
      regVerificationMode,
      enData,
    } = props.value;
    let { patientId, realNameAuth } = gStores.userStore.patChoose;
    const { source } = gStores.globalStore.browser;

    if (isOrderWithoutPat.value) {
      if (!(patientId || quickPat.value.patientName)) {
        gStores.messageStore.showMessage('请先添加就诊人信息', 1500);
        return;
      }
    }

    if (!isCheck.value && !isWaitReg.value) {
      if (isConfirmOrderWithConfirmDialog === '1') {
        regDialogConfirm.value.show();
      } else {
        gStores.messageStore.showMessage(
          `请先阅读并同意${agreeText.value}`,
          3000,
          {
            closeCallBack() {
              isFlagWarning.value = true;
            },
            // useDialog: true,
            dialogOpt: {
              title: '温馨提示',
            },
          }
        );
      }

      return;
    }

    if (regVerificationMode === '2' && realNameAuth === '0') {
      await handlerConfirmPatReal();
    }

    // 没有证件号去补充
    if (
      !quickPat.value.patientName &&
      isShowAddPatCardNo(gStores.userStore.patChoose, personConfig.value)
    ) {
      /**
       * - 如果是儿童 存在本人或者监护人证件号即可
       * -如果是成人 本人身份证信息不能为空
       * -非身份证件类型患者不做任何校验
       */
      const { patientAge, idCardEncry, upIdCardEncry } =
        gStores.userStore.patChoose;

      let isCanOrder = true;
      const isChildren =
        patientAge &&
        isGuardianWithIdCard &&
        (patientAge as unknown as number) * 1 <= isGuardianWithIdCard * 1;

      if (isChildren) {
        isCanOrder = !!upIdCardEncry || !!idCardEncry;
      } else {
        isCanOrder = !!idCardEncry;
      }

      if (!isCanOrder) {
        const { title, content } = await gStores.getSysAppMore('1265');
        const { confirm } = await new Promise<any>((closeCallBack) => {
          gStores.messageStore.showMessage(content, 0, {
            useDialog: true,
            dialogOpt: {
              isShowCancel: true,
              title,
            },
            closeCallBack,
          });
        });

        if (confirm) {
          uni.navigateTo({
            url: joinQueryForUrl('/pagesA/medicalCardMan/medicalCardMan', {
              _url: joinQueryForUrl(
                '/pagesA/MyRegistration/RegConfirm',
                props.value
              ),
            }),
          });
        }

        return;
      }
    }

    if (isWaitReg.value) {
      waitReg();
      return;
    }

    // #ifdef MP-WEIXIN
    if (wxOrderSubscribeMessage?.length) {
      // @ts-expect-error
      await apiAsync(uni.requestSubscribeMessage, {
        tmplIds: wxOrderSubscribeMessage,
      }).catch((e) => {
        console.error(e);
      });
    }
    // #endif

    // 预约类型：1.预约挂号，2.当日挂号
    const resType = (dayjs().format('YYYY-MM-DD') === schDate && '2') || '1';
    const [firstDept, secondDept] = deptStore.deptClickStep;

    const requestArg: any = {
      ...props.value,
      freeSignData: '',
      openId: gStores.globalStore.openId,
      firstDeptName: firstDept?.deptName,
      firstHosDeptId: firstDept?.deptId,
      secondDeptName: secondDept?.deptName,
      secondHosDeptId: secondDept?.deptId,
      ampm,
      enData,
      categor,
      categorName,
      clinicalType: clinicalType === 'null' ? '1' : clinicalType || '1',
      deptName,
      docTitleName,
      docName,
      diseaseId,
      fee,
      hosDeptId,
      hosDocId,
      hosId,
      numId,
      schDate,
      schId,
      schQukCategor,
      timeDesc,
      patientId,
      source,
      resType,
      promptMessage,
      thRegisterId: thRegisterId || getLocalStorage('thRegisterId'),
      ageReminderCode: isOverLimit.value,
      quickAppoint: '',
    };
    pageConfig.value?.isOrderBlur === '1' && (requestArg.disNo = disNo);

    if (quickPat.value.patientName) {
      if (!quickPat.value.patientId) {
        const { patientId: _patientId } =
          await patientUtils.quickAppointmentAddPat(quickPat.value);
        quickPat.value.patientId = _patientId;
      }

      patientId = quickPat.value.patientId;
      requestArg.patientId = patientId;
      requestArg.quickAppoint = 'quickAppoint';
    }

    let alipayAuthCode = '';
    // #ifdef MP-ALIPAY
    if (alipayPid) {
      await getMyPowerQx()
        .then((qxRes: any) => {
          alipayAuthCode = qxRes.authCode;
        })
        .catch((e) => {});
    }
    // #endif

    /**
     * 免密代扣挂号
     */
    const isOpenSignExist = isSignExist.value && !quickPat.value.patientName;
    if (isOpenSignExist) {
      let { freeSignData } = await getFreeSignData(patientId);

      if (!freeSignData) {
        regDialogConfirmSign.value.show();
        await new Promise((r, j) => {
          resolve = r;
          reject = j;
        });

        await goPaySign(patientId, {
          type: 'order',
          cb: signAfterContinueOrder,
        });

        freeSignData = (await getFreeSignData(patientId)).freeSignData;
      }

      requestArg.freeSignData = freeSignData;
    }

    // true ? 免密代扣 :  正常挂号
    const actionApi = isOpenSignExist ? api.addOrder : api.addReg;

    let {
      result: { orderId, hasCharge, hint, hosOrderId },
    } = await actionApi(requestArg).catch(async (e) => {
      if (e) {
        const { respCode, message, code } = e;

        if (respCode === 999301 && !quickPat.value.patientName) {
          const { confirm } = await new Promise<any>((r: any) => {
            gStores.messageStore.showMessage(
              '档案已合并，请删除就诊人重新绑定',
              0,
              {
                useDialog: true,
                dialogOpt: {
                  title: '温馨提示',
                  isShowCancel: true,
                  isMaskClick: false,
                  confirmColor: 'var(--hr-error-color-6)',
                  confirmText: '去删除',
                },
                closeCallBack: r,
              }
            );
          });

          if (!confirm) {
            throw new Error('取消删除就诊人');
          }

          gStores.userStore.updatePatClick(gStores.userStore.patChoose);
          uni.navigateTo({
            url: '/pagesA/medicalCardMan/medicalCardDetail',
          });
        }
        // 限制欠费用户预约挂号
        else if (respCode === 999225) {
          gStores.messageStore.closeMessage();
          preventOrderStr.value = message;
          isPreventOrder.value = true;
        } else if (respCode === 999227) {
          //超限就诊提示
          OverlimiMessage(e);
        } else if (respCode === 999231 && realNameAuth === '0') {
          // 医生号源 去实名认证 -温附二
          await handlerConfirmPatReal();
        } else if (respCode === 884802) {
          //接口拦截 去实名认证 —— 省中
          await handlerConfirmPatReal();
        } else if (respCode === 884803) {
          //接口拦截 更新监护人信息 —— 省中
          await handlerConfirmPatReal1();
        } else if (code !== 4000) {
          message && gStores.messageStore.showMessage(message, 3000);
        }
      }
      throw new Error(e);
    });

    // #ifdef MP-ALIPAY
    if (alipayPid) {
      //有埋点的情况
      if (alipayAuthCode) {
        await api
          .energySendReg({
            orderId,
            scene: 'horegister', // 挂号 horegister
            userId: gStores.globalStore.openId,
          })
          .then(async ({ result }) => {
            // result.totalEnergy
            if (result && result.totalEnergy && result.totalEnergy != 0) {
              contentTitle.value =
                isOrderPay !== '1'
                  ? '本次预约得绿色能量'
                  : '本次挂号得绿色能量';
              greenToastContent.value = result.totalEnergy;
              await wait(greenToastDuration.value);
            }
          })
          .catch(async () => {
            await wait(1000);
          });
      }
    }
    // #endif
    if (hasCharge === '0') {
      const { confirm } = await apiAsync(uni.showModal, {
        content: hint,
        cancelText: '稍后缴费',
        confirmText: '立即缴费',
      });

      if (confirm) {
        goPay();

        throw new Error('去缴费');
      }
    } else if (hasCharge === '2') {
      await apiAsync(uni.showModal, {
        content: hint,
        confirmText: '确认',
        showCancel: false,
      });
    }

    deptStore.$patch({
      deptClickStep: [],
    });

    if (orderId) {
      uni.navigateTo({
        url: joinQueryForUrl('/pagesA/MyRegistration/RegDetail', {
          preWz: '1',
          _autoPay: '1',
          orderId,
          thRegisterId,
          patientId,
        }),
      });
    } else if (hosOrderId) {
      const pageArg: any = {
        typeId: '1',
      };

      // if (gStores.globalStore.sysCode === '1001094') {
      //   Object.assign(pageArg, {
      //     isAllOrder1001094: '1',
      //     hideTab: '1',
      //   });
      // }
      uni.navigateTo({
        url: joinQueryForUrl('/pagesA/MyRegistration/MyRegistration', pageArg),
      });
    }
  }, 500);

  const OverlimiMessage = async (e) => {
    const { respCode, message } = e;
    const { cancel } = await apiAsync(uni.showModal, {
      content: message,
      cancelText: '继续预约',
      confirmText: '暂不预约',
    });

    if (cancel) {
      isOverLimit.value = respCode;
      regConfirm();
    }
  };

  const goPay = () => {
    isPreventOrder.value = false;
    uni.reLaunch({
      url: '/pagesA/clinicPay/clinicPayDetail',
    });
  };

  const isFlagWarning = ref(false);
  const flagClick = () => {
    const { isConfirmOrderWithConfirmDialog } = pageConfig.value;
    if (isCheck.value) {
      isCheck.value = false;
    } else {
      isFlagWarning.value = false;
      if (isConfirmOrderWithConfirmDialog === '1') {
        regDialogConfirm.value.show();
      } else {
        isCheck.value = true;
      }
    }
  };

  const getWaitRegSch = async () => {
    const arg = {
      ...props.value,
      source: gStores.globalStore.browser.source,
    };

    const { result } = await api.getAlternateSch<{
      alternateData: string;
      alternateLevel: string;
      schDate: string;
      alternateNum: number;
      schSecondResultList: TSchInfo[];
    }>(arg);

    return result;
  };

  const selClose = () => {
    isShowSelWaitRegSch.value = false;
    reject();
  };

  let resolve: (...any) => any = () => {};
  let reject: (...any) => any = () => {};

  const confirmAsync = () => {
    resolve();
  };
  const cancelAsync = () => {
    reject();
  };
  const waitRegShow = async (args) => {
    await wait(200);
    await new Promise(async (r, j) => {
      resolve = async () => {
        waitChooseDialog.value = false;
        r('sueess');
      };
      reject = () => {
        waitChooseDialog.value = false;
        useTBanner({
          type: 'h5',
          isSelfH5: '1',
          path: 'pagesC/question/alternatePreQues',
          extraData: {
            data: JSON.stringify({
              ...args,
              priorityReg: true,
            }),
          },
          addition: {
            patientId: '_patientId',
            token: 'token',
            herenId: 'herenId',
          },
        });
        j('f');
      };
      waitChooseDialog.value = true;
    });
  };

  const checkWaitReg = async () => {
    const { isOpenAddedNum } = pageConfig.value;
    const { patientId } = gStores.userStore.patChoose;

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
      hosDeptId,
    } = props.value;
    const query = {
      ampm,
      categor,
      clinicalType,
      hosDocId,
      docName,
      hosId,
      schDate,
      schId,
      addedNum: undefined as any,
      patientId,
      hosDeptId,
    };

    if (isOpenAddedNum === '1') {
      query.addedNum = addedNum;
    }

    const { result } = await api.canRegAlternate(query);

    if (!result) {
      gStores.messageStore.showMessage(
        '当前时段候补人数已达上限，暂不支持候补!',
        1500
      );
      throw new Error('当前时段候补人数已达上限，暂不支持候补');
    }
  };

  const waitReg = async () => {
    await checkWaitReg();
    const { schSecondResultList, alternateData } = await getWaitRegSch();

    waitRegSchSecondResultList.value = schSecondResultList;

    if (schSecondResultList && schSecondResultList.length) {
      isShowSelWaitRegSch.value = true;

      await new Promise((r, j) => {
        resolve = r;
        reject = j;
      });

      const selSchItem = schSecondResultList.find(
        (o) => o.ampm === selWaitRegSch.value
      )!;
      const { addFlag } = selSchItem;

      selWaitRegSch.value = '';
      let { addedNum } = props.value;
      // addedNum = 1;
      if (props.value.hasOwnProperty('addedNum') && addFlag !== '1') {
        if (!(addedNum! * 1)) {
          const { confirm } = await apiAsync(uni.showModal, {
            content: '当前号别加号号源已满，系统将仅为您进行候补登记!',
          });

          if (!confirm) {
            return;
          }
        } else if (isAddedNumSelf.value) {
          await waitRegShow({
            ...props.value,
            ...selSchItem,
            alternateData,
            patientId: gStores.userStore.patChoose.patientId,
            source: gStores.globalStore.browser.source,
            addFlag,
          });
        }
      }
      await api
        .addRegAlternate({
          ...props.value,
          ...selSchItem,
          alternateData,
          patientId: gStores.userStore.patChoose.patientId,
          source: gStores.globalStore.browser.source,
          addFlag,
        })
        .catch(async (e) => {
          if (e) {
            const { respCode, code, message } = e;
            if (respCode === 884802) {
              //接口拦截 去实名认证 —— 省中
              await handlerConfirmPatReal();
            } else if (respCode === 884803) {
              //接口拦截 更新监护人信息 —— 省中
              await handlerConfirmPatReal1();
            } else if (code !== 4000) {
              message && gStores.messageStore.showMessage(message, 3000);
            }
          }
          throw new Error(e);
        });

      uni.reLaunch({
        url: '/pagesA/MyRegistration/MyRegistration?typeId=2',
      });
    } else {
      gStores.messageStore.showMessage('暂无可候补就诊时段', 1500);
    }
  };

  const getPageConfig = async () => {
    pageConfig.value = await ServerStaticData.getSystemConfig('order');
    personConfig.value = await ServerStaticData.getSystemConfig('person');
  };

  const signAfterContinueOrder = async () => {
    // #ifdef MP-WEIXIN
    await regConfirm();
    // #endif
  };

  let _resolve: any = () => {
    // r
  };

  let _reject: any = () => {
    // j
  };

  const dialogSubmit = (e) => {
    _resolve(e);
  };

  const dialogCancel = () => {
    _reject();
  };

  const isCreateCachePersonFormShow = ref(false);
  const handlerCreateCachePerson = async () => {
    isCreateCachePersonFormShow.value = true;

    const _quickPat = await new Promise<any>((r, j) => {
      _resolve = r;
      _reject = j;
    });

    _quickPat.patientNameEncry = nameConvert(_quickPat.patientName);
    quickPat.value = _quickPat;
    isCreateCachePersonFormShow.value = false;
  };

  onShow(() => {
    signAfterOnPageShow({
      type: 'order',
      cb: signAfterContinueOrder,
    });
  });

  onLoad(async (p) => {
    uni.showLoading({ title: '加载中' });
    props.value = deQueryForUrl<IPageProps>(deQueryForUrl(p));
    console.log('页面参数-----');
    console.log(props.value);
    isOver.value = true;
    isWaitReg.value &&
      uni.setNavigationBarTitle({
        title: '确认候补信息',
      });
    initSign();
    await getPageConfig();
    uni.hideLoading();

    await beforeEach({
      _isLogin: true,
      _isPatient: true,
    });

    const { isConfirmOrderWithDeptTip } = pageConfig.value;
    if (
      isConfirmOrderWithDeptTip &&
      ['1', '2'].includes(isConfirmOrderWithDeptTip)
    ) {
      const { result: { promptMessage = '' } = {} } = await api
        .getDeptDetail({
          hosDeptId: props.value.specialClinicDept || props.value.hosDeptId,
        })
        .catch(() => ({}) as any);

      if (promptMessage) {
        await new Promise<{ confirm: boolean }>((r) => {
          gStores.messageStore.showMessage(promptMessage, 0, {
            useDialog: true,
            dialogOpt: {
              title: '科室就诊提醒',
              isShowCancel: false,
            },
            closeCallBack: r,
          });
        });
      }
    }
    if (isAddedNumSelf.value) {
      // const locationInfo = await getLocation(true);
      priorityReg.value = pageConfig.value.isAddedNumSelf !== '1';
    }
  });
</script>

<style lang="scss" scoped>
  .page {
    height: 100vh;
    width: 100%;
    // display: flex;
    // flex-direction: column;
  }

  .container {
    // // height: 1px;
    height: 100vh;

    overflow-y: scroll;

    .container-view {
      padding: 0 32rpx;

      .container-view-card {
        padding-top: 24rpx;
        padding-bottom: 16rpx;
      }
    }
  }

  .fg-agree {
    display: flex;
    font-size: var(--hr-font-size-xs);
    align-items: flex-start;

    .g-border {
      border-color: transparent;

      &.border-warning {
        border-color: var(--hr-error-color-7);
      }
    }

    .fg-agree-name {
      color: var(--hr-brand-color-6);
    }

    .check-box {
      color: var(--hr-neutral-color-7);
      font-size: var(--h-size-40);
      // margin-right: 4rpx;
      transform: translateY(-5rpx);

      &.is-check {
        color: var(--hr-brand-color-6);
      }
    }
  }

  .system-mode-old {
    .check-box {
      font-size: 48rpx;
    }
  }

  .g-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
  }
</style>
